---
layout: post
title: Building AI applications with Ruby
date: 2023-07-12 00:00:00 -0600
published: Julio 12, 2023
categories: desarrollo
description: Aoororachain, is an opinionated way to build AI applications with Open-Source tools and Ruby.
keywords: rails, ruby, ai, llm, chroma
image: /images/build-ai-ruby/build-ai-ruby.png
lang: en
---

When ChatGPT came in popularity earlier this year I wasn't that excited, actually I refrained myself from jumping in to it. Mainly because most of the day-to-day work I do is related to Fintechs and confidential data.

Then in April, this year, the [LLaMA](https://www.theverge.com/2023/3/8/23629362/meta-ai-language-model-llama-leak-online-misuse) model was leaked into the Internet and things started to move quickly into the possibility of having private models. Tools like [llama.cpp](https://github.com/ggerganov/llama.cpp) emerged but still, there was an impossibility to be able to use it in commercial applications.

Still, I started to follow the development of the Open-Source models. It was moving very fast, at times it was difficult to catch up. When the first models with commercial license appeared, it was the time for me to try to run a model locally.

Almost all documentation and tools were writing in and for Python. So, I had to learn a new set of tools. The first time that I successfully run a model in my Mac Mini M2 Pro was existing but disappointed at the same time, it was unbearably slow.

I continued learning, building tools with Ruby, and trying smaller models. Then lama.cpp released support for Apple's Metal Performance Shaders (MPS) and a 7 billion parameters model like [Vicuna](https://lmsys.org/) was fast enough for my Mac Mini M2 Pro.

Also, I realized that for the applications that I had in mind, I didn't need bigger models.

So, today I'm releasing a tool, [Aoororachain](https://github.com/mariochavez/aoororachain) that allows you to create AI Applications with Ruby.

Before explaining what is **Aoororachain** let me list the tools that I created over the time and that makes **Aoororachain** an opinionated tool.

- [Chroma](https://github.com/mariochavez/chroma) gem. It is a client for Vector Database [Chroma](https://www.trychroma.com/).
- [LLM Server](https://github.com/mariochavez/llm_server). It is a Rack API application that wraps llama.cpp binary for running LLM models.
- [LLM Client](https://github.com/mariochavez/llm_client). A Ruby client for the LLM Server API.

**Aoororachain** as I said before, is an opinionated way to build AI applications with Open-Source tools.

For example, if you want to query your own documents, it helps you to create embeddings of them and store the vectors in the Chroma database. To create the embeddings, it uses a _glue_ with Python for different embedding models.

Instead of going with a code example here, I ask you to look at the README file and the two Jupyter Notebooks that are part of the project for more information on how to use it.

<div class="flex flex-col sm:flex-row space-x-4">
  <figure>
    <a href="https://github.com/mariochavez/aoororachain/tree/main/notebooks">
      <img class="block object-contain" src="/images/build-ai-ruby/load-data.png" />
    </a>
    <figcaption class="text-center">Jupyter notbook to load data.</figcaption>
  </figure>
  <figure>
    <a href="https://github.com/mariochavez/aoororachain/tree/main/notebooks">
      <img class="block object-contain" src="/images/build-ai-ruby/retrieval-data.png" />
    </a>
    <figcaption class="text-center">Jupyter notbook to query data.</figcaption>
  </figure>
</div>

But I’ll close this post with videos of three different applications using **Aoororachain**.

The first application is a chat, where you can query Ruby 3.2 documentation and get responses and examples. Unfortunately, Ruby’s documentation lacks of explanation details, and I’m not saying this as a critic of all the people that work on it, but for some topics the LLM was unable to make sense of it.

<div class="embed-container">
  <iframe src="https://player.vimeo.com/video/844402445" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>

The second application, is a chat where you can query the Mexico’s Fintech law.

<div class="embed-container">
  <iframe src="https://player.vimeo.com/video/844394368" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>

The last application is a support chat for a fictitious Fintech company, where clients can ask for information about their credits, like next payment date, payments information, summaries, and what could happen if they fall behind with their payments.

<div class="embed-container">
  <iframe src="https://player.vimeo.com/video/844398254" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>

**NOTE: All videos are accelerated while waiting for a response. The wait time was about 30 seconds with a 13 billion parameters model.**

If you are looking to try AI in a private environment, I hope that these tools can be useful for you. If you try them and find a bug or find a way to improve them, please send a pull request.
