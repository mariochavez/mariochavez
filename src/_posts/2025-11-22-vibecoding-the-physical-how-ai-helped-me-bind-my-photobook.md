---
layout: post
title: "Vibecoding the Physical: How AI Helped Me Bind My Photobook"
date: 2025-11-22 00:00:00 -0600
published: November 22, 2025
categories: desarrollo
image: /images/vibecoding-photobook/vibecoding.jpg
lang: en_US
description: "An engineer and artist's journey using AI 'vibecoding' to build a React prototype for photobook binding, then converting it into a robust Ruby on Rails application to bridge the gap between digital tools and physical art."
keywords: Vibecoding, Claude Sonnet, Ruby on Rails, React, Photobook Binding, ActiveStorage, AI prototyping, Software Engineering, Art and Tech, Rapid Prototyping
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Vibecoding the Physical: How AI Helped Me Bind My Photobook",
    "description": "An engineer and artist's journey using AI 'vibecoding' to build a React prototype for photobook binding, then converting it into a robust Ruby on Rails application.",
    "image": [
      "https://mariochavez.io/images/vibecoding-photobook/vibecoding.jpg"
    ],
    "datePublished": "2025-11-22T12:00:00Z",
    "dateModified": "2025-11-22T12:00:00Z",
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
      "@id": "https://mariochavez.io/desarrollo/2025/11/22/vibecoding-the-physical/"
    },
    "keywords": "Vibecoding, Claude, Ruby on Rails, React, Photobook, AI prototyping",
    "articleSection": "Software Development",
    "programmingLanguage": ["Ruby", "JavaScript"],
    "about": [
      {
        "@type": "SoftwareApplication",
        "name": "Photobook Signature Calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web"
      }
    ],
    "isAccessibleForFree": "True"
  }
---

Sometimes, I reach for Claude Desktop just to "vibecode." I start with a spark—a very simple idea—and I iterate, building complexity layer by layer. Usually, I don't even specify the tech stack. By default, Sonnet tends to choose React.

Here’s the catch: my knowledge of React is basic. I can’t strictly tell if the code is idiomatic or "correct." I can only treat the app as a black box—testing it to see if it works as expected. I leave the architectural decisions to the model and focus purely on the outcome.

But this time, the outcome was personal.

## The Artist’s Need

Besides being a Software Engineer, I am a Visual Artist and contemporary photographer. Since 2022, I’ve been working on a long-term project that is finally becoming my first photobook.

Recently, my book editor and designer sent me a draft PDF. It looked great on screen, but a photobook is a physical object. I needed to "feel" the book before giving feedback. Electronic documents don't have weight; they don't have page turns.

I have the knowledge to print at home on a consumer printer. I also know the process required to take a linear PDF and rearrange the pages into "signatures" (groups of folded sheets) for traditional binding. But doing this manually is tedious and error-prone. One calculation mistake, one wrong paper flip, and the page order is ruined.

![Image: Understanding Signature Binding documentation section](/images/vibecoding-photobook/claude-1.png)

## The AI Solution

I needed a tool, not a math lesson. I opened Claude and pitched the idea: a **"Photobook Signature and Printing Layout Calculator."**

![Image: Signatures visualization](/images/vibecoding-photobook/claude-2.png)

I wanted to upload my PDF and have the tool calculate:

1. How many signatures do I need for binding?
2. How to rearrange (impose) the pages for printing?
3. How to optimize paper usage based on my printer's specific paper size?

After about 10 iterations, Sonnet nailed it. It built a fully client-side React application. It visualizes the grid, handles the imposition math, and even generates a visual guide for printing.

Because I was "vibecoding," I didn't stop at the code. I asked Claude to generate a comprehensive user manual for me (the Photographer) and a technical architecture document for "Future Me" (the Developer).

![Image: Printing layout](/images/vibecoding-photobook/claude-3.png)

## The Engineer’s Return

This is where the process gets interesting. The React app worked, but as an engineer, I felt a bit detached from the "how." I wanted to ground the project in a stack I actually mastered.

So, I asked for a **Spike**:

> "Can you make a spike and convert this application to Rails? Don't worry about the full application; assume that it is there and you are only creating the needed files... Think harder about what can be pushed to the backend with ActiveStorage, and what needs to happen in the front end with ERB, Tailwind, Hotwire, and Stimulus."

The vibe shifted. Sonnet didn't get the Rails architecture perfect on the first try, but because I know Rails deeply, I could spot the flaws immediately. I knew where the N+1 queries would hide, how to better utilize ActiveStorage, or where a specific Gem would be more efficient than custom logic.

![Image: The Ruby on Rails spike](/images/vibecoding-photobook/claude-5.png)

## The Takeaway

I have found this to be a powerful workflow for testing ideas:

1. **Vibecode in the unknown:** Let AI build the prototype in a stack it prefers (like React). Focus purely on the user experience and solving the pain point.
2. **Spike into the known:** Once the logic is proven, ask AI to port it to my core stack (Rails).
3. **Refine with expertise:** Use my engineering seniority to polish the code that I now fully understand.

The result? I have a tool that solves my artistic problem, and it saved me from the manual process to get the layout right. Now, I can go back to my book editing software and rearrange pages to the suggested layout, then finally print my draft book.
