# MCP Server Snowflake

[![npm version](https://img.shields.io/npm/v/mcp-server-snowflake.svg)](https://www.npmjs.com/package/mcp-server-snowflake)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/patrickfreyer/mcp-server-snowflake/actions/workflows/ci.yml/badge.svg)](https://github.com/patrickfreyer/mcp-server-snowflake/actions/workflows/ci.yml)

A TypeScript-based MCP (Model Context Protocol) server that enables Large Language Models (LLMs) like Claude to directly query and interact with Snowflake databases.

## 🌟 Features

- 🔌 **Easy Integration** - Simple setup with Claude Desktop, Cursor, or any MCP-compatible tool
- 🔒 **Secure** - Multiple authentication methods including environment variables and key-pair authentication
- 🚀 **High Performance** - Built with TypeScript and the native Snowflake Node.js driver
- 📊 **Full Database Access** - Query, explore schemas, list tables, and analyze data
- 🛠️ **Developer Friendly** - Comprehensive TypeScript types and error handling

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Snowflake account with appropriate access permissions
- MCP-compatible client (Claude Desktop, Cursor, Continue, etc.)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/patrickfreyer/mcp-server-snowflake.git
cd mcp-server-snowflake

# Install dependencies
npm install

# Build the server
npm run build
```

### Configuration

1. **Set up environment variables:**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Snowflake credentials
SNOWFLAKE_ACCOUNT=your-account.region.provider
SNOWFLAKE_USER=your.email@company.com
SNOWFLAKE_PASSWORD=your-password
SNOWFLAKE_WAREHOUSE=YOUR_WAREHOUSE  # Optional
SNOWFLAKE_DATABASE=YOUR_DATABASE     # Optional
SNOWFLAKE_SCHEMA=YOUR_SCHEMA        # Optional
SNOWFLAKE_ROLE=YOUR_ROLE           # Optional
```

2. **Configure your MCP client:**

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "snowflake": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server-snowflake/dist/index.js"],
      "env": {
        "SNOWFLAKE_ACCOUNT": "your-account.region.provider",
        "SNOWFLAKE_USER": "your.email@company.com",
        "SNOWFLAKE_PASSWORD": "your-password",
        "SNOWFLAKE_WAREHOUSE": "YOUR_WAREHOUSE",
        "SNOWFLAKE_DATABASE": "YOUR_DATABASE",
        "SNOWFLAKE_SCHEMA": "YOUR_SCHEMA",
        "SNOWFLAKE_ROLE": "YOUR_ROLE"
      }
    }
  }
}
```

#### Cursor

Add to Cursor settings:

```json
{
  "mcp.servers": {
    "snowflake": {
      "command": "node",
      "args": ["/path/to/mcp-server-snowflake/dist/index.js"],
      "env": {
        "SNOWFLAKE_ACCOUNT": "your-account",
        "SNOWFLAKE_USER": "your-user",
        "SNOWFLAKE_PASSWORD": "your-password"
      }
    }
  }
}
```

## 📚 Available Tools

The MCP server provides the following tools for interacting with Snowflake:

### `read_query`
Execute SELECT queries on your Snowflake database.

```typescript
// Example
{
  "query": "SELECT * FROM customers LIMIT 10"
}
```

### `list_databases`
List all available databases in your Snowflake account.

### `list_schemas`
List all schemas in a specific database.

```typescript
// Example
{
  "database": "MY_DATABASE"  // Optional
}
```

### `list_tables`
List all tables in a specific schema.

```typescript
// Example
{
  "database": "MY_DATABASE",  // Optional
  "schema": "MY_SCHEMA"       // Optional
}
```

### `describe_table`
Get detailed information about a table's structure.

```typescript
// Example
{
  "table_name": "DATABASE.SCHEMA.TABLE"
}
```

## 🔒 Security

### Environment Variables

The recommended approach for credentials:

```bash
export SNOWFLAKE_ACCOUNT="your-account"
export SNOWFLAKE_USER="your-user"
export SNOWFLAKE_PASSWORD="your-password"
```

### Key-Pair Authentication (Production)

For production environments, we recommend using key-pair authentication:

1. Generate a key pair
2. Configure your Snowflake user with the public key
3. Update the server configuration to use the private key

### File Permissions

Secure your configuration files:

```bash
chmod 600 ~/.env
chmod 600 ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## 🧪 Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

### Project Structure

```
mcp-server-snowflake/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── tests/               # Test files
├── .env.example         # Environment variable template
├── .github/
│   └── workflows/       # CI/CD workflows
├── package.json         # Node.js dependencies
├── tsconfig.json        # TypeScript configuration
├── LICENSE             # MIT License
├── CONTRIBUTING.md     # Contribution guidelines
└── README.md          # This file
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section below
2. Search [existing issues](https://github.com/patrickfreyer/mcp-server-snowflake/issues)
3. Create a [new issue](https://github.com/patrickfreyer/mcp-server-snowflake/issues/new)

## 🔧 Troubleshooting

### Common Issues

#### "Missing required Snowflake configuration"
- Ensure all required environment variables are set
- Check for typos in variable names
- Verify the .env file is in the correct location

#### Connection Failed
- Verify your Snowflake account format: `account.region.provider`
- Check network connectivity and firewall settings
- Ensure your IP is whitelisted in Snowflake network policies

#### Permission Denied
- Verify your Snowflake role has necessary permissions
- Check warehouse access rights
- Ensure database and schema permissions are granted

### Debug Mode

Enable verbose logging:

```bash
export DEBUG=mcp:*
node dist/index.js
```

## 🚀 Roadmap

- [ ] Add support for write operations (INSERT, UPDATE, DELETE)
- [ ] Implement connection pooling
- [ ] Add support for Snowflake stored procedures
- [ ] Create a web-based configuration UI
- [ ] Add support for multiple Snowflake accounts
- [ ] Implement query result caching
- [ ] Add data visualization capabilities

## 👥 Authors

- **Patrick Freyer** - *Initial work*

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) for the MCP protocol specification
- [Snowflake](https://www.snowflake.com/) for their excellent Node.js SDK
- The open-source community for continuous support and contributions

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/patrickfreyer/mcp-server-snowflake?style=social)
![GitHub forks](https://img.shields.io/github/forks/patrickfreyer/mcp-server-snowflake?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/patrickfreyer/mcp-server-snowflake?style=social)

---

Made with ❤️ by Patrick Freyer