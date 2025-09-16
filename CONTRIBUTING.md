# Contributing to MCP Server Snowflake

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)
Pull requests are the best way to propose changes to the codebase:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/patrickfreyer/mcp-server-snowflake/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Process

### Prerequisites
- Node.js 18+
- npm or yarn
- A Snowflake account for testing

### Setup
```bash
# Clone the repository
git clone https://github.com/patrickfreyer/mcp-server-snowflake.git
cd mcp-server-snowflake

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your Snowflake credentials

# Build the project
npm run build

# Run tests
npm test
```

### Code Style
- We use TypeScript for type safety
- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Test with actual Snowflake connection when possible

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/main/CONTRIBUTING.md)