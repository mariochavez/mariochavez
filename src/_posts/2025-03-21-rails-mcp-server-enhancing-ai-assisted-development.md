---
layout: post
title: Rails MCP Server - Enhancing AI-Assisted Development
date: 2025-03-21 12:00:00 -0600
published: March 21, 2025
categories: desarrollo
description: Discover how the Rails MCP Server creates a bridge between Claude AI and your Rails projects, improving code quality and developer workflow while maintaining control over your Neovim-based development process.
keywords: Rails MCP Server, Model Context Protocol, Ruby on Rails, Claude AI, AI-assisted development, Neovim workflow, Rails tooling
lang: en_US
image: /images/rails-mcp-server/rails-mcp-server.jpg
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://mariochavez.io/desarrollo/2025/03/21/rails-mcp-server"
    },
    "headline": "Rails MCP Server - Enhancing AI-Assisted Development",
    "description": "Discover how the Rails MCP Server creates a bridge between Claude AI and your Rails projects, improving code quality and developer workflow while maintaining control over your Neovim-based development process.",
    "author": {
      "@type": "Person",
      "name": "Mario Alberto Chávez Cárdenas"
    },
    "datePublished": "2025-03-21",
    "publisher": {
      "@type": "Organization",
      "name": "Mario Alberto Chávez Cárdenas",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mariochavez.io/logo.png"
      }
    },
    "articleBody": "AI has changed the way we write and deploy code to production. LLMs are getting better and better at understanding and also at generating code. The Rails MCP Server represents a significant step forward in how Ruby on Rails developers can interact with AI assistants like Claude while maintaining their preferred development environment.",
    "keywords": [
      "Rails MCP Server",
      "Model Context Protocol",
      "Ruby on Rails",
      "Claude AI",
      "AI-assisted development",
      "Neovim workflow",
      "Rails tooling",
      "MCP"
    ],
    "articleSection": "Desarrollo",
    "inLanguage": "en-US",
    "programmingLanguage": "Ruby",
    "proficiencyLevel": "Intermediate",
    "image": [
      {
        "@type": "ImageObject",
        "url": "https://mariochavez.io/images/rails-mcp-server/rails-mcp-server.jpg",
        "width": 1200,
        "height": 630,
        "caption": "Rails MCP Server with Claude AI"
      }
    ],
    "about": {
      "@type": "SoftwareApplication",
      "name": "Rails MCP Server",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Cross-platform",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    }
  }
---

AI has changed the way we write and deploy code to production. LLMs are getting better and better at understanding and also at generating code. It started with chats, where you can make questions and share code, then evolved to suggest auto-completion inside the editor and later the inclusion of chats in the same editor.

Nowadays we have editors that are created specifically to understand the code base and write code with just prompts, and a button to accept the changes and update the code base.

But, there is a shortcoming when working with AI, mainly because of the bias of the LLMs that are better at generating code for the JavaScript ecosystem, and not that good with code in almost every other programming language.

Still, AI is great for generating boilerplate code or for green field projects. Moreover, the possibility to extend LLM model knowledge with techniques and protocols that help with the time to deploy, adding significant value, even if it requires more iterations to help the LLM get the correct context.

In my case, I can't take advantage of the new IDEs that integrate AI into their core; I don't use IDEs, I use Neovim. There are tools to make Neovim work like those IDEs, but still, that is something that I don't want to do.

With my way of work, I prefer to use Claude Desktop with the Sonnets models. My workflow is simple; I create projects with a prompt that provides general instructions for the model, something like:

> You are an expert Ruby on Rails developer. Help me to write professional and well-crafted code; don't explain it unless required. You are familiar with TailwindCSS, Turbo Rails, Hotwire, and Stimulus. Also, don't write tests unless you are required. All tests should be with minitest in unit test style.

Then, in the knowledge base of the project, I add documentation and texts that provide context in greater detail, along with code style, what to do, and what not to do.

Once my projects are configured, then I can start doing some work. I mainly work on brownfield projects with large code bases, so sharing the whole code base is not an option. Before I start the task at hand, I collect fragments of code that can be relevant to what I need to accomplish.

I even have a bash script that can copy the full content of a file along with the file path. The AI generates new code or changes with my instructions since the AI can't write directly to my files, this allows me to review the code and assess if it will work as expected and if the code style is consistent with my code base.

If I spot something that I can write better or might produce an error, I don't ask the AI to fix it. I just copy what makes sense to Neovim, update the code, and copy it back to the AI so it can have the latest version. I work this way because I don't Vibe code. I need to keep some quality in the code, and I also need to fully understand what is happening because that code powers companies and their customers.

This workflow works great so far, but when I learned about the Model Context Protocol or MCP, I wondered how I might be able to use it to improve how I share code with Claude Desktop. So, I embarked on a quest to create a Rails MCP server; actually, Claude Desktop wrote about 80% of it.

## What the Rails MCP Server can do?

The Rails MCP Server provides a set of tools that allow Claude to interact directly with my Rails projects. This enables a more seamless workflow when I need AI assistance with my codebase. Here are the capabilities:

### Project Navigation

I can easily switch between different Rails projects using the `switch_project` tool. This is particularly useful when I'm working on multiple applications and need Claude's assistance with different codebases throughout my workday.

The Rails MCP Server follows the XDG Base Directory Specification for configuration files:

- On macOS: `$XDG_CONFIG_HOME/rails-mcp` or `~/.config/rails-mcp` if XDG_CONFIG_HOME is not set
- On Windows: `%APPDATA%\rails-mcp`

The server automatically creates these directories and an empty `projects.yml` file on the first run. To configure my projects, I edit the `projects.yml` file to include my Rails projects:

```yaml
store: "~/projects/store"
blog: "~/projects/rails-blog"
```

Each key in the YAML file is a project name (used with the `switch_project` tool), and each value is the path to the project directory.

Example prompts I use:

- "Can you switch to the 'store' project so we can explore it?"
- "I'd like to analyze my 'blog' application. Please switch to that project first."

### Project Overview

With the `get_project_info` tool, Claude can provide me with a comprehensive overview of my Rails application, including its version, directory structure, and configuration. This gives Claude the necessary context to understand my application's architecture before diving into specific tasks.

Example prompts I use:

- "Now that we're in the blog project, can you give me an overview of the project structure and Rails version?"
- "Tell me about this Rails application. What version is it running and how is it organized?"

### File Exploration

The `list_files` tool allows Claude to scan my project directories and locate specific files. I can filter by directory path or file pattern, making it easy to find what I need.

Example prompts I use:

- "Can you list all the model files in this project?"
- "Show me all the controller files in the app/controllers directory."
- "List all the JavaScript files in the app/javascript directory."

### Code Examination

Using the `get_file` tool, Claude can retrieve the complete content of any file in my project with syntax highlighting. This eliminates my need to manually copy and paste code snippets, streamlining my workflow.

Example prompts I use:

- "Can you show me the content of the User model file?"
- "I need to see what's in app/controllers/products_controller.rb. Can you retrieve that file?"
- "Please show me the application.rb file so I can check the configuration settings."

### Route Analysis

The `get_routes` tool provides access to all HTTP routes defined in my Rails application. Claude can analyze the routing structure to help me understand API endpoints, URL patterns, and controller actions.

Example prompts I use:

- "Can you show me all the routes defined in this application?"
- "I need to understand the API endpoints available in this project. Can you list the routes?"
- "Show me the routing configuration for this Rails app so I can see how the URLs are structured."

### Model Inspection

With the `get_models` tool, Claude can examine my Active Record models in detail. It can list all models or provide comprehensive information about a specific model, including its schema, associations, and code implementation.

Example prompts I use:

- "Can you list all the models in this Rails project?"
- "I'd like to understand the User model in detail. Can you show me its schema, associations, and code?"
- "Show me the Product model's definition, including its relationships with other models."

### Schema Investigation

The `get_schema` tool allows Claude to access my database schema information. It can show the complete database structure or focus on a specific table, displaying columns, data types, constraints, and relationships.

Example prompts I use:

- "Can you show me the complete database schema for this Rails application?"
- "I'd like to see the structure of the users table. Can you retrieve that schema information?"
- "Show me the columns and their data types in the products table."

The Rails MCP Server doesn't just save me time—it enhances Claude's understanding of my codebase, leading to more accurate and relevant assistance. Whether I'm troubleshooting an issue, implementing a new feature, or refactoring existing code, Claude can now access the context it needs to provide helpful suggestions tailored to my specific project.

## Installation

Installing the Rails MCP Server is straightforward. I start by installing the gem:

```bash
gem install rails-mcp-server
```

After installation, the `rails-mcp-server` and `rails-mcp-setup-claude` executables are available in my PATH.

## Claude Desktop Integration

I run the setup script which automatically configures Claude Desktop and sets up the proper XDG-compliant directory structure:

```bash
rails-mcp-setup-claude
```

The script:

- Creates the appropriate config directory for my platform
- Creates an empty `projects.yml` file if it doesn't exist
- Updates my Claude Desktop configuration

After running the script, I restart Claude Desktop to apply the changes.

### Ruby Version Manager Users

Claude Desktop launches the MCP server using my system's default Ruby environment, bypassing version manager initialization (e.g., rbenv, RVM). The MCP server needs to use the same Ruby version where it was installed, as MCP server startup failures can occur when using an incompatible Ruby version.

Since I use a Ruby version manager (rbenv), I create a symbolic link to my Ruby shim to ensure the correct version is used:

```bash
sudo ln -s /home/mario/.rbenv/shims/ruby /usr/local/bin/ruby
```

I replace the path with my actual path for the Ruby shim.

## Final Thoughts

If you want access to the source code, here is the link <https://github.com/maquina-app/rails-mcp-server>

The Rails MCP Server is a significant step forward in how I interact with AI assistants like Claude as a Ruby on Rails developer. I've learned that AI outputs are only as good as the context I provide—when Claude has access to the right files and project structures, the quality and accuracy of its suggestions improve dramatically. Instead of manually copying snippets or trying to explain complex relationships between models, I can simply ask Claude to examine the relevant files directly, maintaining control over my development process while enhancing my existing Neovim workflow with contextually aware AI assistance.
