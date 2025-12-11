---
layout: post
title: "Rails MCP Server: Context-Efficient Tool Architecture"
date: 2025-12-10 00:00:00 -0600 
published: December 10, 2025
categories: desarrollo
lang: en_US
description: "Learn how Rails MCP Server's new architecture reduces context consumption by 67% through progressive tool discovery, Rails introspection, and Prism static analysis."
image: /images/rails-mcp-context-efficient/rails-mcp-context-efficient.png
keywords: Ruby on Rails, MCP Server, AI, Context Window, Prism Static Analysis, Rails Introspection, Progressive Discovery, Claude, GitHub Copilot, Claude Code, Tool Architecture
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Rails MCP Server: Context-Efficient Tool Architecture",
    "description": "Learn how Rails MCP Server's new architecture reduces context consumption by 67% through progressive tool discovery, Rails introspection, and Prism static analysis.",
    "image": [
      "https://mariochavez.io/images/rails-mcp-context-efficient/rails-mcp-context-efficient.png"
    ],
    "datePublished": "2025-12-10T12:00:00Z",
    "dateModified": "2025-12-10T12:00:00Z",
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
      "@id": "https://mariochavez.io/desarrollo/2025/11/26/rails-mcp-context-efficient-tool-architecture/"
    },
    "keywords": "Ruby on Rails, MCP, AI, Static Analysis, Context Efficiency, GitHub Copilot",
    "articleSection": "Software Development",
    "programmingLanguage": ["Ruby"],
    "about": [
      {
        "@type": "SoftwareApplication",
        "name": "Rails MCP Server",
        "applicationCategory": "DeveloperTool",
        "operatingSystem": "macOS, Linux"
      }
    ],
    "isAccessibleForFree": "True"
  }
---

Learn how Rails MCP Server's new architecture reduces context consumption through progressive tool discovery, Rails introspection, and Prism static analysis.

## Table of Contents

- [The Context Budget Problem](#the-context-budget-problem)
- [Progressive Tool Discovery](#progressive-tool-discovery)
- [Rails Introspection: Beyond Regex Parsing](#rails-introspection-beyond-regex-parsing)
- [Prism Static Analysis](#prism-static-analysis)
- [Detail Levels and Filtering](#detail-levels-and-filtering)
- [Sandboxed Ruby Execution](#sandboxed-ruby-execution)
- [Improved Discovery UX](#improved-discovery-ux)
- [Interactive Configuration Tool](#interactive-configuration-tool)
- [How I Use the New Architecture](#how-i-use-the-new-architecture)
- [Upgrading to the New Version](#upgrading-to-the-new-version)
- [Looking Forward](#looking-forward)

## The Context Budget Problem

Last week I came across an [Anthropic blog post](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) that fundamentally changed how I think about MCP server design. The insight was simple but profound: every tool you register with an MCP server gets sent to Claude at the start of each session.

With the Rails MCP Server's previous 12 tools, that meant roughly 2,400 tokens consumed before asking a single question. On large Rails codebases where I'm already sharing multiple files and documentation, this context overhead matters. I've hit conversation limits mid-feature more times than I'd like to admit.

The Anthropic post suggested a different approach: progressive disclosure. Instead of loading all tool definitions upfront, let the AI discover them when relevant. This resonated with how I already work—I don't need Claude to know about route analysis when I'm focused on model validations.

## Progressive Tool Discovery

The most significant change in this release is the reduction from 12 registered tools to just 4. The other tools didn't disappear—they became internal analyzers that Claude discovers on-demand.

**The four registered tools:**

| Tool | Purpose |
|------|---------|
| `switch_project` | Select which Rails project to analyze |
| `search_tools` | Discover available analyzers by keyword or category |
| `execute_tool` | Run any analyzer by name |
| `execute_ruby` | Sandboxed Ruby execution for complex queries |

The previous tools like `analyze_models`, `get_routes`, and `get_schema` are now internal analyzers. Claude finds them through `search_tools` and invokes them through `execute_tool`. This pattern reduces the initial context footprint by roughly 67%.

When I start a session now, Claude only knows about these four capabilities. If I ask about database structure, Claude can search for relevant tools:

```

search\_tools(query: "database schema")

```

This returns information about `get_schema` without having loaded all nine analyzers upfront. Claude then invokes it:

```

execute\_tool(tool\_name: "get\_schema", params: { table\_name: "users" })

````

The workflow feels natural—Claude discovers what it needs when it needs it.

## Rails Introspection: Beyond Regex Parsing

While refactoring the tool architecture, I realized something uncomfortable: the previous implementation relied heavily on regex parsing. Patterns like `has_many\s+:(\w+)` worked most of the time, but missed edge cases—associations with options, multi-line declarations, dynamic associations.

This release replaces regex parsing with proper Rails introspection. When you analyze a model now, the server actually asks Rails about it:

```ruby
Model.reflect_on_all_associations  # All associations with options
Model.validators                    # All validations with conditions
Model.defined_enums                 # Enum definitions and values
Model.columns_hash                  # Column details from the database
````

For routes, instead of parsing the text output of `rails routes`, the server accesses route objects directly:

```ruby
Rails.application.routes.routes.map do |route|
  {
    verb: route.verb,
    path: route.path.spec.to_s,
    controller: route.defaults[:controller],
    action: route.defaults[:action],
    constraints: route.constraints
  }
end
```

For controllers, I now use `action_methods` instead of scanning for `def` statements, and `_process_action_callbacks` to find before/after actions accurately.

The difference in accuracy is significant. Associations with `through:`, `class_name:`, or `foreign_key:` options are now captured correctly. Validations show their conditions. Callbacks include their `only:` and `except:` filters.

## Prism Static Analysis

Rails introspection tells you what exists at runtime, but sometimes you need to understand the code structure itself. For this, I added Prism static analysis.

Prism is Ruby's new parser that ships with Ruby 3.3+. It provides a clean AST that I can traverse to extract:

  - Callbacks and their method references
  - Scope definitions
  - Included concerns and modules
  - Method definitions with line numbers
  - Instance variables assigned per action

The `analysis_type` parameter lets you choose what you need:

```
execute_tool(
  tool_name: "analyze_models",
  params: {
    model_name: "User",
    analysis_type: "full"  # "introspection", "static", or "full"
  }
)
```

With `analysis_type: "full"`, Claude gets both the runtime reflection data and the static code analysis. With `analysis_type: "static"`, it gets just the AST-derived information—useful when you want to understand code structure without loading the Rails environment.

## Detail Levels and Filtering

Another insight from the Anthropic post: intermediate results consume tokens too. When you ask about routes, do you really need the complete output of all 200 routes with constraints and defaults?

Every analyzer now supports a `detail_level` parameter:

  - `names` — Minimal output, just identifiers
  - `summary` — Names plus brief descriptions
  - `full` — Complete information (the previous default)

For routes specifically, I added filtering:

```
execute_tool(
  tool_name: "get_routes",
  params: {
    controller: "api/v1/users",
    verb: "GET",
    detail_level: "summary"
  }
)
```

Instead of 200 routes, Claude might get 5. The token savings compound across a conversation.

For models and schemas, batch operations reduce round-trips:

```
execute_tool(
  tool_name: "analyze_models",
  params: {
    model_names: ["User", "Post", "Comment"],
    detail_level: "associations"
  }
)
```

One call, three models, associations only. No source code, no validations, no columns—just the relationships Claude needs for the current task.

## Sandboxed Ruby Execution

The most powerful addition is `execute_ruby`. Sometimes the predefined analyzers aren't enough—you need a custom query that doesn't fit the standard patterns.

```
execute_ruby(code: <<~RUBY)
  User.joins(:posts)
      .group("users.id")
      .having("COUNT(posts.id) > 10")
      .pluck(:email)
RUBY
```

This runs in a sandboxed environment with strict security controls:

  - **No file writes** — Cannot create, modify, or delete files
  - **No system calls** — `system()`, backticks, and `exec` are blocked
  - **No network access** — Cannot make HTTP requests or open sockets
  - **No sensitive file reads** — `.env`, credentials, and `.gitignore`'d files are protected
  - **Project-scoped** — Cannot access files outside the project directory
  - **Timeout protected** — Maximum 60 seconds execution

The sandbox provides helper methods for common operations:

```ruby
read_file("app/models/user.rb")     # Safe file reading
file_exists?("config/database.yml") # Existence check (false for sensitive files)
list_files("app/models/**/*.rb")    # Glob with filtering
project_root                        # Project path constant
```

I use this for complex queries that would otherwise require multiple tool calls or for analysis patterns specific to my projects.

## Improved Discovery UX

After testing the new architecture with real conversations, I noticed AI agents sometimes struggled with the initial learning curve. Which tool reads files? What helpers are available in `execute_ruby`? The progressive discovery approach works well once you know the patterns, but getting started needed to be smoother.

### Quick Start Guide

Now when you switch projects, you get an immediate orientation:

```
Switched to project: my_finances at path: /Users/mario/projects/my_finances

Quick Start:
• Get project overview:  execute_tool("project_info")
• Read a file:           execute_ruby("puts read_file('config/routes.rb')")
• Find files:            execute_ruby("puts Dir.glob('app/models/*.rb').join('\n')")
• Analyze models:        execute_tool("analyze_models", { model_name: "User" })
• Get routes:            execute_tool("get_routes")
• Get schema:            execute_tool("get_schema", { table_name: "users" })
• Search available tools: search_tools()

Helpers in execute_ruby: read_file(path), file_exists?(path), list_files(pattern), project_root
Note: Always use `puts` in execute_ruby to see output.
```

This eliminates the cold-start problem. Claude immediately knows the most common patterns without searching for them.

### The `puts` Problem

One subtle issue kept appearing: `execute_ruby` would return "Code executed successfully (no output)" when users forgot to wrap expressions in `puts`. Now the no-output message includes helpful hints:

```
Code executed successfully (no output).

Hint: Use `puts` to see results, e.g.:
  puts read_file('config/routes.rb')
  puts User.count
  puts Dir.glob('app/models/*.rb')
```

Small friction points like this matter more than I initially realized. Every confused moment is context wasted on troubleshooting instead of actual work.

### AI Agent Guide

For teams using this with custom AI setups, I created a comprehensive guide at `docs/AGENT.md` covering:

  - Tool selection decision trees
  - Common pitfalls and how to avoid them
  - Error handling and fallback strategies
  - Integration patterns with other MCP servers (like [Neovim MCP](https://github.com/maquina-app/nvim-mcp-server))

The guide is written for AI consumption—structured, explicit, with clear examples for each scenario.

## Interactive Configuration Tool

Managing MCP server configuration used to involve editing YAML files and JSON configs manually. With multiple Rails projects, documentation guides, and Claude Desktop integration, this became tedious. So I built `rails-mcp-config`—an interactive terminal UI for all configuration tasks.

### Getting Started

```bash
rails-mcp-config
```

The tool presents a clean menu organized by frequency of use:

```
┌──────────────────────────────────────────────────┐
│  Rails MCP Server - Configuration                │
╰──────────────────────────────────────────────────╯

Projects
  List projects
  Add project
  Add current directory (my-rails-app)
  Edit project
  Remove project
  Validate all projects
────────────────────
Guides
  Download guides
  Import custom guides
  Manage custom guides
────────────────────
Setup
  Claude Desktop integration
  Open config file
────────────────────
Exit
```

### Project Management

Adding a project is now a guided process. If you run the tool from within a Rails project directory, it offers to add that directory with one confirmation:

```
Directory: ~/projects/my-rails-app

Project name: [my-rails-app]
✓ Added project 'my-rails-app' -> ~/projects/my-rails-app
```

The tool validates paths, checks for Gemfiles, and uses home-relative paths (`~/projects/...`) for portability.

### Documentation Guides

Downloading Rails, Turbo, Stimulus, and Kamal guides is now visual:

```
Select guides to download:
  [x] rails (✓ downloaded)
  [x] turbo (not downloaded)
  [ ] stimulus (not downloaded)
  [ ] kamal (not downloaded)

⠸ Fetching files...
✓ rails: 2 downloaded, 45 skipped
✓ turbo: 12 downloaded, 0 skipped
```

You can also import your own markdown documentation and manage custom guides through the same interface.

### Claude Desktop Integration

The most useful feature for new users is automatic Claude Desktop configuration. The tool:

1.  Detects your existing Claude Desktop config
2.  Shows current MCP server settings if configured
3.  Offers to add or update the Rails MCP Server configuration
4.  Automatically finds the correct Ruby and server executable paths
5.  Creates timestamped backups before any changes
6.  Supports both STDIO (recommended) and HTTP modes

<!-- end list -->

```
✓ Claude Desktop config file found
✓ Rails MCP Server is configured

Current configuration:
  command: /Users/mario/.rubies/ruby-3.3.0/bin/ruby
  args: /Users/mario/.gem/ruby/3.3.0/bin/rails-mcp-server

What would you like to do?
  View full config
  Update Rails MCP Server config
  Back to menu
```

For HTTP mode with `mcp-remote`, the tool detects `npx` and guides you through the URL configuration.

### Enhanced Terminal UI

The tool uses [Gum](https://github.com/charmbracelet/gum) when available for a polished experience with styled prompts, spinners, and tables. Without Gum, it falls back to a functional basic terminal interface—no dependencies required.

```bash
# Optional: Install Gum for enhanced UI
brew install gum        # macOS
sudo apt install gum    # Debian/Ubuntu
```

The legacy command-line tools (`rails-mcp-setup-claude`, `rails-mcp-server-download-resources`) still work for scripting and backward compatibility, but for interactive use, `rails-mcp-config` is now the recommended approach.

## How I Use the New Architecture

My workflow has evolved with these changes. When I start a session:

```
Switch to project my_finances.
```

I immediately see the Quick Start guide, so Claude knows the patterns without any additional discovery.

When I need to explore unfamiliar territory:

```
Search for tools related to controllers and views.
```

Claude finds `analyze_controller_views` and explains what it can do. Then:

```
Analyze the UsersController with full introspection and static analysis.
```

For focused work where I know what I need:

```
Get the schema for the transactions table, just the columns and indexes.
```

The `detail_level: "summary"` is implicit in "just the columns"—Claude understands the intent and uses minimal output.

For complex questions that span multiple concerns:

```
execute_ruby(code: <<~RUBY)
  # Find models with callbacks that touch the database
  Dir.glob("app/models/**/*.rb").select do |file|
    content = File.read(file)
    content.match?(/after_save|after_create|after_update/) &&
    content.match?(/\.save|\.update|\.create/)
  end
RUBY
```

This kind of query would be tedious with the standard tools but trivial with direct Ruby execution.

## Upgrading to the New Version

The upgrade is straightforward:

```bash
gem install rails-mcp-server
```

After installation, run the interactive configuration tool to set up or verify your configuration:

```bash
rails-mcp-config
```

This will help you:

  - Add your Rails projects
  - Download documentation guides
  - Configure Claude Desktop integration (with automatic path detection)

The new architecture is backward compatible in terms of functionality—everything the previous version could do, this version can do. The interface changed from direct tool calls to discovery and execution, but Claude adapts naturally.

If you prefer manual configuration or scripting, the legacy commands still work:

```bash
rails-mcp-setup-claude              # Configure Claude Desktop
rails-mcp-server-download-resources rails   # Download guides
```

For Prism static analysis to work, your Rails projects need Ruby 3.3+ or the Prism gem installed. If Prism isn't available, the server gracefully falls back to introspection-only analysis.

## Looking Forward

While version 1.4.0 focused on context optimization, my current exploration for 1.4.1 is focused on **agent portability**.

I am working on a `--single-project` flag to support ephemeral environments like the **GitHub Copilot Agent**. These agents run in temporary GitHub Actions environments where no `projects.yml` exists and no global configuration can be persisted. The new flag will allow the server to skip loading `projects.yml`, treat the current directory as the sole project, and auto-switch to it immediately on startup.

This same feature unlocks support for **Claude Code**. Because Claude Code uses worktrees where each session is a separate working directory. By leveraging STDIO mode with the `--single-project` flag, each worktree can spawn its own isolated MCP server instance without port conflicts. This also allows the `.mcp.json` configuration to be committed directly to version control, making the setup reproducible for the entire team.

The combination of reduced tool registration, Rails introspection, Prism analysis, and these upcoming compatibility features makes the Rails MCP Server not just smarter, but more adaptable to the rapidly evolving ecosystem of AI agents.

Source code is available at [https://github.com/maquina-app/rails-mcp-server](https://github.com/maquina-app/rails-mcp-server)

## Related Posts

  - [Rails MCP Server: Enhanced Documentation Access](https://mariochavez.io/desarrollo/rails/ai-tools/development-workflow/2025/06/03/rails-mcp-server-enhanced-documentation-access/)
  - [Rails MCP Server with HTTP Server-Sent Events support](https://mariochavez.io/desarrollo/2025/04/20/rails-mcp-server-with-sse/)
  - [Rails MCP Server - Enhancing AI-Assisted Development](https://mariochavez.io/desarrollo/2025/03/21/rails-mcp-server-enhancing-ai-assisted-development/)
