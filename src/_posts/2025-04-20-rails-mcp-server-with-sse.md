---
layout: post
title: Rails MCP Server with HTTP Server-Sent Events support
date: 2025-04-20 00:00:00 -0600
published: April 20, 2025
categories: desarrollo
image: /images/rails-mcp-server/rails-mcp-server-1-1-0.jpg
lang: en_US
description: Rails MCP Server v1.1.0 introduces FastMCP integration and HTTP Server-Sent Events (SSE) support. Learn about the improved code organization, new tools, and how to use HTTP mode with SSE for integration with LLM clients.
keywords: Rails MCP Server, FastMCP, HTTP SSE, Server-Sent Events, LLM integration, Ruby on Rails, Model Context Protocol, Claude Desktop, MCP Inspector, Ruby, AI tools
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Rails MCP Server 1.1.0 with HTTP SSE support",
    "description": "Rails MCP Server v1.1.0 introduces FastMCP integration and HTTP Server-Sent Events (SSE) support. Learn about the improved code organization, new tools, and how to use HTTP mode with SSE.",
    "image": "https://mariochavez.io/images/rails-mcp-server/rails-mcp-server-1-1-0.jpg",
    "datePublished": "2025-04-20T12:00:00Z",
    "dateModified": "2025-04-20T12:00:00Z",
    "author": {
      "@type": "Person",
      "name": "Mario Alberto Chávez",
      "url": "https://mariochavez.io"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mario Alberto Chávez",
      "url": "https://mariochavez.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mariochavez.io/images/mario.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://mariochavez.io/desarrollo/2025/04/20/rails-mcp-server-with-sse"
    },
    "keywords": "Rails MCP Server, FastMCP, HTTP SSE, Model Context Protocol, Ruby on Rails, LLM integration, Claude Desktop, MCP Inspector",
    "articleSection": "Ruby on Rails",
    "programmingLanguage": "Ruby",
    "about": [
      {
        "@type": "SoftwareApplication",
        "name": "Rails MCP Server",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Cross-platform"
      }
    ],
    "isAccessibleForFree": "True"
  }
---

# Rails MCP Server 1.1.0 with HTTP SSE support

I'm excited to announce this new version of Rails MCP Server, version 1.1.0! This release introduces significant internal refactoring through the integration of the [FastMCP gem](https://github.com/jlowin/fastmcp), providing better code organization and adding support for HTTP Server-Sent Events (SSE).

## What's New in v1.1.0

### FastMCP Integration

The most substantial change in this release is the internal refactoring to use the FastMCP gem. This refactoring has provided several benefits:

- **Improved Code Organization**: I've made the codebase more modular and easier to maintain
- **Improved tools**: I've reviewed the code for each tool to fix issues with edge cases and to make the tools honor `.gitignore` file when scanning the codebase for files. This is important for large codebases.
- **Added two new tools**: There are two new tools, analyze controller and views and analyze environment configuration. Analyze controllers and views finds all the relationships with the routes, views, stimulus controllers and controller actions in detail. Analyze environment configuration compares the configuration for inconsistencies between environments, missing configuration, and possible security issues, _it does not leak keys or passwords to the LLM_.

### HTTP Server-Sent Events (SSE) Support

With this release, I've added HTTP Server-Sent Events (SSE) support for real-time communication:

- **Support for other clients:** Clients with support for HTTP Server-Sent Events (SSE) can now interact with the Rails MCP Server.

## Using HTTP Mode with SSE

The Rails MCP Server can now run in two distinct modes:

1. **STDIO mode (default)**: Communicates over standard input/output for direct integration with clients like Claude Desktop.
2. **HTTP mode**: Runs as an HTTP server with JSON-RPC and Server-Sent Events (SSE) endpoints.

To start in HTTP mode:

```bash
# Start in HTTP mode on the default port (6029)
rails-mcp-server --mode http

# Start in HTTP mode on a custom port
rails-mcp-server --mode http -p 8080
```

When running in HTTP mode, the server provides two endpoints:

- JSON-RPC endpoint: `http://localhost:<port>/mcp/messages`
- SSE endpoint: `http://localhost:<port>/mcp/sse`

This enables integration with web applications, dashboard tools, and other systems that need to communicate with the Rails MCP server.

## Upgrading from Earlier Versions

Upgrading to v1.1.0 should be straightforward for most users. The API remains backward compatible, so existing code should continue to work without modification. To upgrade:

```bash
gem install 'rails-mcp-server' # This installs the current version 1.1.0
```

## Under the Hood

I've streamlined the codebase significantly by refactoring to use FastMCP. The FastMCP gem provides a robust implementation of the MCP protocol, handling message encoding/decoding, connection management, and event dispatching.

I built the SSE implementation on top of Rack and integrated it seamlessly with FastMCP's event system. This allows for efficient real-time updates and event streaming while maintaining compatibility with the Model Context Protocol standard.

## Testing with MCP Inspector

The Rails MCP Server v1.1.0 works seamlessly with MCP Inspector, making it easier than ever to test and debug your MCP server:

```bash
# Install and run MCP Inspector with your Rails MCP Server
npm -g install @modelcontextprotocol/inspector

# Run the inspector and connect to the Rails MCP Server via STDIO or HTTP SSE
npx @modelcontextprotocol/inspector
```

## How I use the Rails MCP Server

I use the server with Claude Desktop from Anthropic. It does not yet support HTTP SSE; it can only communicate via STDIO. Adding HTTP SSE facilitates people using other clients to use the server easily, as using the server with Claude Desktop is not simple if you use a Ruby version manager.

Claude Desktop starts a process to run the server but with a _no login_ session, which means that your Ruby version manager is not initialized and macOS uses the bundled 2.6 Ruby version. There is no real fix for this situation, just a workaround. Please look at the [README](https://github.com/maquina-app/rails-mcp-server?tab=readme-ov-file#ruby-version-manager-users) to see how to make it work for **rbenv**; a similar solution is required for other Ruby managers.

When I start a session with Claude, my first prompt is:

```
Switch to project my_finances, don't analyze the project or any loaded files until you are told to.
```

I do this because the Sonnet model can start very creatively and begin analyzing all possible files in the project, consuming its quota.

I work on a feature per chat, so I load only the files that are related to the work that I want to do:

```
Load the following file or files, do not analyze or try to load dependencies unless you are told to.
```

Again, here I pass the list of files to load but I stop Sonnet from trying to analyze without knowing yet what I want to do. My next prompt is to explain what I want to do, and then I ask it to analyze the files and maybe load more if needed.

While working with Claude Desktop, it's easy to reach the chat quota. I'm prepared at the end to continue with the feature if it's not done yet. I use the following prompt:

```
Summarize this chat. Describe what is the goal and add any relevant information about what was done. Include the project name and the list with a brief description of any file loaded, generated or shared with you.
```

Then I copy the output and start a new chat with the following prompt:

```
Here is a summary of a previous chat. Switch to the project if a given name exists. Don't load any reference files until you are told to. Also, don't analyze the project or any loaded files until you are told to.
Just comprehend in a general way what was done before.

If you are told to generate data, always generate synthetic data unless you are told otherwise.
```

And continue with the cycle. Claude Desktop doesn't write to the disk; I always review the generated code and copy it manually. I modify the code when it makes sense and share it back with Claude.

## Conclusion

I believe this release of Rails MCP Server v1.1.0 represents a significant step forward in terms of code quality and feature set. The integration with FastMCP provides a more maintainable foundation, while the addition of SSE support expands the communication options available to applications using the server.

I encourage you to upgrade to this latest version and explore the new capabilities it offers. As always, I welcome feedback and contributions from the community.

Source code is available at [https://github.com/maquina-app/rails-mcp-server](https://github.com/maquina-app/rails-mcp-server)
