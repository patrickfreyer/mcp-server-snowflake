# Node-based Snowflake MCP

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

### Installation Options

#### Option 1: Install via MCPB Package (Recommended for Claude Desktop)

The easiest way to install this MCP server in Claude Desktop is using the pre-built MCPB package:

1. **Download the latest release:**
   - Go to [Releases](https://github.com/patrickfreyer/mcp-server-snowflake/releases)
   - Download the `snowflake-mcp-v1.0.0.mcpb` file

2. **Install in Claude Desktop:**
   - Open Claude Desktop
   - Navigate to Settings → Developer → MCP Servers
   - Click "Install from file"
   - Select the downloaded `.mcpb` file
   - Configure your Snowflake credentials when prompted

#### Option 2: Build MCPB Package from Source

```bash
# Clone the repository
git clone https://github.com/patrickfreyer/mcp-server-snowflake.git
cd mcp-server-snowflake

# Install dependencies
npm install

# Build the TypeScript server
npm run build

# Create the MCPB package
./build-mcpb.sh

# The package will be created as snowflake-mcp-v1.0.0.mcpb
# Install this file in Claude Desktop as described above
```

#### Option 3: Manual Installation (For Development)

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

Configuration depends on your installation method:

#### For MCPB Package Users

When you install the MCPB package, Claude Desktop will automatically prompt you for:
- Snowflake Account (e.g., `your-account.region.provider`)
- Warehouse name
- Username (typically your email)
- Password
- Role (optional)
- Database (optional)
- Schema (optional)

These credentials are securely stored in Claude Desktop's configuration.

#### For Manual Installation

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

## 📦 Building MCPB Packages

The MCPB (MCP Bundle) format allows for easy distribution and installation of MCP servers in Claude Desktop.

### Building a Package

```bash
# Ensure the project is built
npm run build

# Create the MCPB package
./build-mcpb.sh
```

This will create a `snowflake-mcp-v1.0.0.mcpb` file containing:
- Compiled server code
- Manifest with configuration schema
- Production dependencies
- Installation metadata

### Package Contents

The MCPB package includes:
- `manifest.json` - Defines configuration parameters and server entry point
- `dist/` - Compiled TypeScript server code
- `node_modules/` - Production dependencies only
- `README.md` - Package documentation

### Manifest Configuration

The `manifest.json` file defines:
- User configuration parameters (without default values for security)
- Server entry point and environment variable mapping
- Tool definitions for Snowflake operations
- Package metadata (name, version, author, etc.)

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
├── manifest.json        # MCPB package configuration
├── build-mcpb.sh        # Script to build MCPB package
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
