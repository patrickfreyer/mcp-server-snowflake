#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { promisify } from 'util';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const snowflake = require('snowflake-sdk');

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

interface SnowflakeConfig {
  account: string;
  username: string;
  password: string;
  warehouse?: string;
  database?: string;
  schema?: string;
  role?: string;
}

class SnowflakeMCPServer {
  private server: Server;
  private connection: any | null = null;
  private config: SnowflakeConfig;

  constructor() {
    this.config = this.loadConfig();
    this.server = new Server(
      {
        name: 'snowflake-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private loadConfig(): SnowflakeConfig {
    // Load from environment variables (including those set by MCP config)
    const config: SnowflakeConfig = {
      account: process.env.SNOWFLAKE_ACCOUNT || '',
      username: process.env.SNOWFLAKE_USER || process.env.SNOWFLAKE_USERNAME || '',
      password: process.env.SNOWFLAKE_PASSWORD || '',
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      role: process.env.SNOWFLAKE_ROLE,
    };

    // Debug logging
    console.error('Environment variables received:');
    console.error('SNOWFLAKE_ACCOUNT:', process.env.SNOWFLAKE_ACCOUNT ? 'SET' : 'NOT SET');
    console.error('SNOWFLAKE_USER:', process.env.SNOWFLAKE_USER ? 'SET' : 'NOT SET');
    console.error('SNOWFLAKE_PASSWORD:', process.env.SNOWFLAKE_PASSWORD ? 'SET' : 'NOT SET');

    // Validate required fields
    if (!config.account || !config.username || !config.password) {
      console.error('Error: Missing required Snowflake configuration.');
      console.error('\nConfiguration should be provided through MCP config env vars:');
      console.error('{');
      console.error('  "mcpServers": {');
      console.error('    "snowflake": {');
      console.error('      "command": "node",');
      console.error('      "args": ["path/to/dist/index.js"],');
      console.error('      "env": {');
      console.error('        "SNOWFLAKE_ACCOUNT": "your-account.region.provider",');
      console.error('        "SNOWFLAKE_USER": "your-username",');
      console.error('        "SNOWFLAKE_PASSWORD": "your-password",');
      console.error('        "SNOWFLAKE_WAREHOUSE": "optional",');
      console.error('        "SNOWFLAKE_DATABASE": "optional",');
      console.error('        "SNOWFLAKE_SCHEMA": "optional",');
      console.error('        "SNOWFLAKE_ROLE": "optional"');
      console.error('      }');
      console.error('    }');
      console.error('  }');
      console.error('}');
      throw new Error('Missing required Snowflake configuration');
    }

    return config;
  }

  private async connect(): Promise<void> {
    if (this.connection) {
      return;
    }

    const connectionOptions: any = {
      account: this.config.account,
      username: this.config.username,
      password: this.config.password,
      warehouse: this.config.warehouse,
      database: this.config.database,
      schema: this.config.schema,
      role: this.config.role,
    };

    this.connection = snowflake.createConnection(connectionOptions);

    const connectAsync = promisify(this.connection.connect.bind(this.connection));
    await connectAsync();

    console.error('Connected to Snowflake');
  }

  private async executeQuery(sqlText: string): Promise<any[]> {
    if (!this.connection) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.connection!.execute({
        sqlText,
        complete: (err: any, stmt: any, rows: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      });
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'snowflake://databases',
          name: 'Databases',
          description: 'List of available Snowflake databases',
          mimeType: 'application/json',
        },
        {
          uri: 'snowflake://schemas',
          name: 'Schemas',
          description: 'List of available schemas in the current database',
          mimeType: 'application/json',
        },
        {
          uri: 'snowflake://tables',
          name: 'Tables',
          description: 'List of tables in the current schema',
          mimeType: 'application/json',
        },
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        await this.connect();

        if (uri === 'snowflake://databases') {
          const databases = await this.executeQuery('SHOW DATABASES');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(databases, null, 2),
              },
            ],
          };
        }

        if (uri === 'snowflake://schemas') {
          const schemas = await this.executeQuery('SHOW SCHEMAS');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(schemas, null, 2),
              },
            ],
          };
        }

        if (uri === 'snowflake://tables') {
          const tables = await this.executeQuery('SHOW TABLES');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(tables, null, 2),
              },
            ],
          };
        }

        throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to read resource: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'read_query',
          description: 'Execute a SELECT query on Snowflake',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The SELECT query to execute',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'list_databases',
          description: 'List all available databases',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'list_schemas',
          description: 'List all schemas in a database',
          inputSchema: {
            type: 'object',
            properties: {
              database: {
                type: 'string',
                description: 'The database name (optional, uses current if not specified)',
              },
            },
          },
        },
        {
          name: 'list_tables',
          description: 'List all tables in a schema',
          inputSchema: {
            type: 'object',
            properties: {
              database: {
                type: 'string',
                description: 'The database name (optional)',
              },
              schema: {
                type: 'string',
                description: 'The schema name (optional)',
              },
            },
          },
        },
        {
          name: 'describe_table',
          description: 'Get table schema information',
          inputSchema: {
            type: 'object',
            properties: {
              table_name: {
                type: 'string',
                description: 'The table name (can include database.schema.table)',
              },
            },
            required: ['table_name'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        await this.connect();

        switch (name) {
          case 'read_query': {
            const query = args?.query as string;
            if (!query.trim().toUpperCase().startsWith('SELECT')) {
              throw new Error('Only SELECT queries are allowed');
            }
            const results = await this.executeQuery(query);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'list_databases': {
            const databases = await this.executeQuery('SHOW DATABASES');
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(databases, null, 2),
                },
              ],
            };
          }

          case 'list_schemas': {
            let query = 'SHOW SCHEMAS';
            if (args?.database) {
              query = `SHOW SCHEMAS IN DATABASE ${args.database}`;
            }
            const schemas = await this.executeQuery(query);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(schemas, null, 2),
                },
              ],
            };
          }

          case 'list_tables': {
            let query = 'SHOW TABLES';
            if (args?.database && args?.schema) {
              query = `SHOW TABLES IN ${args.database}.${args.schema}`;
            } else if (args?.schema) {
              query = `SHOW TABLES IN SCHEMA ${args.schema}`;
            } else if (args?.database) {
              query = `SHOW TABLES IN DATABASE ${args.database}`;
            }
            const tables = await this.executeQuery(query);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(tables, null, 2),
                },
              ],
            };
          }

          case 'describe_table': {
            const tableName = args?.table_name as string;
            const description = await this.executeQuery(`DESCRIBE TABLE ${tableName}`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(description, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Snowflake MCP Server running on stdio');
  }
}

const server = new SnowflakeMCPServer();
server.run().catch(console.error);