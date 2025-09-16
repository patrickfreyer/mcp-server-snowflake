#!/bin/bash

# Build script for creating Snowflake MCP Bundle (.mcpb)
# This creates a distributable package for Claude Desktop installation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="${SCRIPT_DIR}/build"
OUTPUT_DIR="${SCRIPT_DIR}"
PACKAGE_NAME="snowflake-mcp"
VERSION=$(grep '"version"' "${SCRIPT_DIR}/manifest.json" | sed -E 's/.*"version": "([^"]+)".*/\1/')

echo -e "${GREEN}Building Snowflake MCP Bundle v${VERSION}${NC}"
echo "========================================="

# Step 1: Clean build directory
echo -e "\n${YELLOW}Step 1: Cleaning build directory...${NC}"
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Step 2: Build TypeScript if needed
echo -e "\n${YELLOW}Step 2: Building TypeScript...${NC}"
npm run build

# Step 3: Copy manifest.json
echo -e "\n${YELLOW}Step 3: Copying manifest.json...${NC}"
cp "${SCRIPT_DIR}/manifest.json" "${BUILD_DIR}/"

# Step 4: Copy package files
echo -e "\n${YELLOW}Step 4: Copying package files...${NC}"
cp "${SCRIPT_DIR}/package.json" "${BUILD_DIR}/"
cp "${SCRIPT_DIR}/package-lock.json" "${BUILD_DIR}/"

# Step 5: Copy built distribution files
echo -e "\n${YELLOW}Step 5: Copying distribution files...${NC}"
cp -r "${SCRIPT_DIR}/dist" "${BUILD_DIR}/"

# Step 6: Install production dependencies only
echo -e "\n${YELLOW}Step 6: Installing production dependencies...${NC}"
cd "${BUILD_DIR}"
npm ci --production --silent
cd "${SCRIPT_DIR}"

# Step 7: Create README if it doesn't exist
echo -e "\n${YELLOW}Step 7: Creating README for package...${NC}"
cat > "${BUILD_DIR}/README.md" << 'EOF'
# Snowflake MCP Server

This is a Model Context Protocol (MCP) server for Snowflake integration, enabling Claude to query and interact with Snowflake data warehouses.

## Installation

1. Install this .mcpb file in Claude Desktop
2. Configure your Snowflake credentials when prompted
3. The server will connect using the provided credentials

## Features

- Execute SELECT queries on Snowflake
- List databases, schemas, and tables
- Get table schema information
- Optimized for LCL retail analytics

## Configuration

The following environment variables are required:
- SNOWFLAKE_ACCOUNT: Your Snowflake account identifier
- SNOWFLAKE_WAREHOUSE: Warehouse to use for queries
- SNOWFLAKE_USER: Your username (typically BCG email)
- SNOWFLAKE_PASSWORD: Your password
- SNOWFLAKE_ROLE: Role to use
- SNOWFLAKE_DATABASE: Default database
- SNOWFLAKE_SCHEMA: Default schema

## Support

For issues or questions, contact: freyer.patrick@bcg.com
Repository: https://github.com/patrickfreyer/mcp-server-snowflake
EOF

# Step 8: Create the MCPB package
echo -e "\n${YELLOW}Step 8: Creating MCPB package...${NC}"
cd "${BUILD_DIR}"
OUTPUT_FILE="${OUTPUT_DIR}/${PACKAGE_NAME}-v${VERSION}.mcpb"

# Create zip archive with .mcpb extension
zip -r -q "${OUTPUT_FILE}" . -x "*.DS_Store" "*__MACOSX*" "*.git*"

# Step 9: Verify package
echo -e "\n${YELLOW}Step 9: Verifying package...${NC}"
if [ -f "${OUTPUT_FILE}" ]; then
    FILE_SIZE=$(du -h "${OUTPUT_FILE}" | cut -f1)
    echo -e "  ${GREEN}✓${NC} Package created successfully"
    echo -e "  ${GREEN}✓${NC} Size: ${FILE_SIZE}"
    echo -e "  ${GREEN}✓${NC} Location: ${OUTPUT_FILE}"

    # List contents
    echo -e "\n  Package contents:"
    unzip -l "${OUTPUT_FILE}" | head -20
else
    echo -e "  ${RED}✗${NC} Failed to create package"
    exit 1
fi

# Step 10: Clean up
echo -e "\n${YELLOW}Step 10: Cleaning up...${NC}"
rm -rf "${BUILD_DIR}"

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "\nPackage created: ${GREEN}${OUTPUT_FILE}${NC}"
echo -e "\nTo install in Claude Desktop:"
echo -e "  1. Open Claude Desktop settings"
echo -e "  2. Navigate to Developer > MCP Servers"
echo -e "  3. Click 'Install from file' and select the .mcpb file"
echo -e "  4. Configure your Snowflake credentials when prompted"