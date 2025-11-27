---
layout: post
title: "Rails Upgrades with AI: A Real-World Success Story"
date: 2025-11-27 00:00:00 -0600
published: November 27, 2025
categories: desarrollo
image: /images/rails-upgrades-ai/rails-upgrade.jpg
lang: en_US
description: "How a client's EMR application was moved from EOL Rails 7.1 to Rails 8 in days using the Rails Upgrade Skill for Anthropic's Claude."
keywords: Rails 8, Ruby on Rails, Upgrade, AI, Claude, MCP, Legacy Code, Refactoring, Automated Upgrades, Maquina
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Rails Upgrades with AI: A Real-World Success Story",
    "description": "How a client's EMR application was moved from EOL Rails 7.1 to Rails 8 in days using the Rails Upgrade Skill for Anthropic's Claude.",
    "image": [
      "https://mariochavez.io/images/rails-upgrades-ai/rails-upgrade.jpg"
    ],
    "datePublished": "2025-11-27T12:00:00Z",
    "dateModified": "2025-11-27T12:00:00Z",
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
      "@id": "https://mariochavez.io/desarrollo/2025/11/27/rails-upgrades-with-ai/"
    },
    "keywords": "Rails 8, Ruby on Rails, Upgrade, AI, Claude",
    "articleSection": "Software Development",
    "programmingLanguage": ["Ruby"],
    "about": [
      {
        "@type": "SoftwareApplication",
        "name": "Rails Upgrade Skill",
        "applicationCategory": "DeveloperTool",
        "operatingSystem": "Web"
      }
    ],
    "isAccessibleForFree": "True"
  }
---

A few weeks ago, I introduced the **Rails Upgrade Skill** for Anthropic's Claude. You can check out the repository here: [https://github.com/maquina-app/rails-upgrade-skill](https://github.com/maquina-app/rails-upgrade-skill).

Yesterday, a client's Ruby on Rails application—focused on EMR (Electronic Medical Records)—was successfully **deployed to Rails 8** with only a minor, quickly resolved issue! Just a week prior, this same application was running on the End-of-Life (EOL) version, **Rails 7.1**.

![Image: Upgrade to 7.2 summary report](/images/rails-upgrades-ai/summary-report.png)

Using the **Rails Upgrade Skill**, I was able to manage this rapid transition. The process involved first upgrading the application to **Rails 7.2** and deploying it to production, and then, days later, performing the jump to **Rails 8**.

To be honest, the changes to the existing codebase were minor:

* A few broken **specs**.
* One **gem** that hadn't been updated for recent Rails versions.
* Two small issues that were not caught by the test suite but were easily fixed *before* they became real-world problems.

Currently, I even have a Work-In-Progress (WIP) Pull Request for the **Rails 8.1** version of this application. It's blocked only because the **Mongoid** gem doesn't yet support the latest released gems in Rails 8.1, but the core upgrade code is ready in the repository. Once again, the skill performed most of the work; we're just waiting for the gem to be released to continue the upgrade.

### The Real Power of the Skill 💡

The skill doesn't just provide a high-level analysis; it gives **clear, actionable guidance** on the changes between versions. This includes:

![Image: Files changes report](/images/rails-upgrades-ai/files-update-report.png)

* **Step-by-step actions** with a tailored script to check for breaking changes.
* Precise instructions for **creating a branch** and **running necessary commands**.
* Exactly **what files to modify** and the **rationale** behind each change.

Crucially, it makes merging **configuration-specific changes** much easier—a task that is often painful when using the `rails app:update` command.
