---
layout: post
title: Upgrading Rails applications with an AI skill
date: 2025-11-12 00:00:00 -0500
published: November 12, 2025
categories: desarrollo
image: /images/rails-upgrade-skill/upgrade-rails-ia-skill.jpg
lang: en_US
description: Learn how the custom Rails Upgrade Assistant Skill, built on Anthropic's platform, automates the tedious process of merging configurations and detecting breaking changes when upgrading Ruby on Rails applications (v7.0 to v8.1). Includes details on its intelligent analysis and custom code preservation features.
keywords: Rails Upgrade Assistant, Rails Upgrade Skill, Ruby on Rails, Rails app:update, Anthropic Skills, AI development, LLM, Model Context Protocol, MCP, Rails 7, Rails 8, Code Migration, Custom Code Preservation
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Upgrading Rails applications with an AI skill",
    "description": "Learn how the custom Rails Upgrade Assistant Skill automates the tedious process of merging configurations and detecting breaking changes when upgrading Ruby on Rails applications (v7.0 to v8.1).",
    "image": "https://mariochavez.io/images/rails-upgrade-skill/upgrade-rails-ia-skill.jpg",
    "datePublished": "2025-11-12T10:00:00Z",
    "dateModified": "2025-11-12T10:00:00Z",
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
      "@id": "https://mariochavez.io/desarrollo/2025/11/12/upgrading-rails-ai-skill/"
    },
    "keywords": "Rails Upgrade Assistant, Anthropic Skills, AI development, Rails 7, Rails 8, Code Migration, Model Context Protocol",
    "articleSection": "Ruby on Rails",
    "programmingLanguage": "Ruby",
    "about": [
      {
        "@type": "SoftwareApplication",
        "name": "Rails Upgrade Assistant Skill",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Cross-platform"
      }
    ],
    "isAccessibleForFree": "True"
  }
---

What if you could use an AI skill to handle the most tedious, error-prone parts of a Ruby on Rails upgrade? As someone who's been in the Rails trenches since 2008, I've spent countless hours on this exact task.

In my time as a founder, contractor, and company owner, I've upgraded applications from nearly every era. The early days of 2.x, 3.x, and 4.x were battles against breaking API changes, specific and complex monkey patches, and gems that were abandoned over time.

Things got better after Rails 5.2, but one command still triggers a familiar headache: `rails app:update`.

The real challenge isn't the command itself. It's the high-stakes, manual process that follows: **meticulously merging your application's custom configurations** with the framework's new defaults. Even with great tools like <a href="https://railsdiff.org/" target="_blank" rel="noopener noreferrer">RailsDiff</a>, it's a slow, manual process where a single mistake can cause subtle, cascading bugs.

---

### The Spark of an Idea

I've been thinking about how to improve this process for a while. When Anthropic first announced the Model Context Protocol (MCP), I saw a post on X (formerly Twitter) asking if AI could finally solve this exact config-merging nightmare. The idea struck a chord, but I was swamped with work.

A few weeks ago, that idea resurfaced. A client's application on Rails 7.1 was approaching its end-of-life (EOL) date, and I was staring down another upgrade. But this time, something was different: Anthropic had just launched **Skills**.

As I was planning the upgrade, I was open to considering if one of these new **Skills** could be the solution. I realized a "skill" wasn't just a general-purpose AI; it was a specialized, tool-driven capability. Could this be the key to _finally_ automating the most painful part of a Rails upgrade?

I had to find out.

---

## Introducing the `rails-upgrade-skill`

The result of that experiment is the **Rails Upgrade Assistant Skill** (or `rails-upgrade-skill` in its repository). This is a specialized **AI skill** that uses Claude's intelligence to guide the entire upgrade process.

It’s built using official Rails CHANGELOGs to intelligently plan your upgrade path for any version from **Rails 7.0 through 8.1.1**.

**What makes this skill an _intelligent_ upgrade assistant?**

- **Intelligent Analysis:** It calls the Rails MCP Server to read **your actual project files**, understand **your customizations**, and provide personalized guidance—not generic advice.

- **Custom Code Preservation:** It automatically detects custom configurations and provides specific warnings (e.g., about custom SSL middleware or autoload paths) with clear instructions on how to migrate them safely, ensuring your code logic isn't lost.

- **Sequential Enforcement:** It prevents the dangerous practice of skipping versions. If you ask for a multi-hop upgrade (e.g., 7.0 to 8.1), it automatically plans the correct sequential path (7.0 → 7.1 → 7.2 → 8.0 → 8.1) and guides you through each hop separately.


### Make It Your Own

This skill is currently **opinionated and tightly coupled to my personal workflow**. It's built to work with two other tools I've made:

1. <a href="https://github.com/maquina-app/rails-mcp-server" target="_blank" rel="noopener noreferrer">Rails MCP Server</a>: Used to gather deep information about your Rails application (like version, file contents, routes).
    
2. <a href="https://github.com/maquina-app/nvim-mcp-server" target="_blank" rel="noopener noreferrer">Neovim MCP Server</a>: Used to allow Claude to apply the identified changes directly to your files in Neovim (the **Interactive Mode**).
    

But this is the beauty of Skills. You don't have to use my stack. I invite you to **fork the repo** and edit the `SKILL.md` file. You can instruct the skill on how _you_ want it to get project information or apply changes, tailoring it to your own editor and workflow.

---

## How to Use the Skill: A Step-by-Step Guide

Here’s how it works in my setup.

### 1. Installation

First, clone the repository and run the build script:

```bash
> git clone [https://github.com/maquina-app/rails-upgrade-skill.git](https://github.com/maquina-app/rails-upgrade-skill.git)
> cd rails-upgrade-skill
> bin/build
```

This command zips the skill into a `/build` folder. Next, open your Claude Desktop app, go to **Settings > Capabilities**, and scroll down to **Skills**. You can upload the `build/rails-upgrade-skill.zip` file there.

![Install the skill](/images/rails-upgrade-skill/claude-settings.png)

### 2. Set Your Project Context

In a new chat, you need to tell Claude which project you're working on. If you're using my Rails MCP Server, the command is:

> Switch to my_app project and show me the project information

This activates your Rails application's context and allows the skill to gather its details.

![Switch to your application context](/images/rails-upgrade-skill/rails-app-information.png)


### 3. Activate the Upgrade Skill

Once the context is set, you can invoke the AI skill with a simple prompt:

> Help me upgrade my Rails application to next available version

The skill takes over and kicks off a three-step process, which can be done in two modes:

- **Mode 1 (Report-Only):** Claude provides the comprehensive report, and you apply changes manually. This is recommended for your first time.

- **Mode 2 (Interactive):** Claude guides you and offers to apply changes directly to your open files in Neovim.


![Activate the skill](/images/rails-upgrade-skill/generate-breaking-changes-script.png)

### 4. The Three-Phase Process

**Step 1: Detect Deprecations**

The skill generates a bash script for you. You copy and run this script in your application's root directory. It scans your application for deprecation patterns and breaking changes, saving findings to a .txt file, which you then paste back into Claude.

![Run the script](/images/rails-upgrade-skill/run-the-script.png)

**Step 2: Generate a Comprehensive Report**

This is the core value. Using the project analysis and the deprecation findings, the skill generates a detailed report. It breaks down changes by priority (HIGH, MEDIUM, LOW) and component (ActiveRecord, ActionMailer, etc.).

Crucially, it **intelligently merges the new Rails defaults with your existing custom settings** and provides **OLD vs. NEW code examples** with explanation.

![The comprehensive report](/images/rails-upgrade-skill/the-report.png)

**Step 3: Apply the Changes (The app:update Report)**

The final report summarizes all files needing changes. If you are using the Interactive Mode with the Neovim MCP server, you can review the proposed changes and then tell Claude:

> All files are ready on nvim buffers, update them all

Claude will then apply all the approved changes directly to your open files.

![The app:update report](/images/rails-upgrade-skill/the-app-update-report.png)

---

## The Final Mile: After the Skill

This AI skill handles the most complex parts of the upgrade, getting you 90% of the way there. You still need to follow the standard Rails procedure:

First, update your gems:

```bash
> bundle update
```

Next, run the `rails app:update` command. Run it with **confidence**. When the command flags conflicts in config files, you can usually **skip** overwriting them, knowing the logic has already been intelligently merged by the skill. You then let the command proceed to create _new_ files, like initializers and migrations.

```bash
> rails app:update
```

And the last, most crucial step: **run your test suite** and test the application manually.

---

## Final Thoughts

I've already used this skill to upgrade a client application and several of my own projects, turning hours of tedious work into a process that takes just a few minutes of interaction time.

This, for me, represents the true power of AI in development: combining deep, specialized domain knowledge (the nuances of a Rails upgrade) with new tools like Anthropic Skills.

Please, **give the <a href="https://github.com/maquina-app/rails-upgrade-skill" target="_blank" rel="noopener noreferrer">rails-upgrade-skill</a> a try**. Fork it, adapt it to your own workflow, and let me know what you think.
