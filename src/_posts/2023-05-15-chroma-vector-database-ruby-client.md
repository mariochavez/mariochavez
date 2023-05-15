---
layout: post
title: Chroma Vector Database Ruby client
date: 2023-05-15 12:00:00 -0600
published: Mayo 15, 2023
categories: desarrollo
description: Today I'm releasing a gem called chroma-db which is a Ruby client for Chroma Vector Database.
keywords: llm, openai, chatgpt, code generation, chroma, vector database, embeddings
image: /images/chroma-db/chroma-client.jpg
lang: en_US
---

Chroma Vector Database Ruby client.

Today I'm releasing a gem called [chroma-db](https://github.com/mariochavez/chroma){:target="_blank"} which is a Ruby client for [Chroma Vector Database](https://www.trychroma.com){:target="_blank"}.

Chroma defines itself as "the AI-native open-source embedding database". The interest in Vector Databases increased with the popularity of LLMs, these types of databases became the context memory for them.

My desire to start playing around with LLMs, especially the ones that you can run on your own, let me to the place to start writing tools for the Ruby language.

## The server
To install Chroma locally, it requires a Python environment. There are many ways to install Python on your system. Choose the one that works better for you.

Here I'll use [miniconda](https://docs.conda.io/en/latest/miniconda.html){:target="_blank} installed via [HomeBrew](https://brew.sh/){:target="_blank"} on macOS.

```
$ brew install miniconda
$ conda activate chroma
```

Once the environment is ready, in my case, instead of installing Chroma via pip command I choose to clone the repo with a specific tag.

```
$ git clone --depth 1 --branch 0.3.22  git@github.com:chroma-core/chroma.git
```

To start the server, go to Chroma cloned directory and use docker to create the image and start the service with Docker Compose.

```
$ docker-compose up -d --build
```

This command starts the server at http://localhost:8000 but also starts the [Clickhouse](https://clickhouse.com/){:target="_blank"} which is used by Chroma to persists embeddings, metadata, and documents.

## The client
With the server up and running, the next step is to install the client, and then you are ready.

To install the client, just run

```
$ gem install chroma-db
```

Or add it to your Gemfile with

```
$ bundle add chroma-db
```

Here is an example of a few operations with Chroma.

```ruby
require "logger"

# Requiere Chroma Ruby client.
require "chroma-db"

# Configure Chroma's host. Here you can specify your own host.
Chroma.connect_host = "http://localhost:8000"
Chroma.logger = Logger.new($stdout)
Chroma.log_level = Chroma::LEVEL_ERROR

# Check current Chrome server version
version = Chroma::Resources::Database.version
puts version

# Create a new collection
collection = Chroma::Resources::Collection.create(collection_name, {lang: "ruby", gem: "chroma-db"})

# Add embeddings
embeddings = [
  Chroma::Resources::Embedding.new(id: "1", embedding: [1.3, 2.6, 3.1], metadata: {client: "chroma-rb"}, document: "ruby"),
  Chroma::Resources::Embedding.new(id: "2", embedding: [3.7, 2.8, 0.9], metadata: {client: "chroma-rb"}, document: "rails")
]
collection.add(embeddings)
```
### Jupyter notebook
To explore a more complete example, chroma-db repository includes [Jupyter notebook](https://github.com/mariochavez/chroma/blob/main/notebook/Chroma%20Gem.ipynb){:target="_blank"}. To use the notebook, install the following Python dependencies and install the [IRuby](https://github.com/SciRuby/iruby){:target="_blank"} kernel.

<figure><img src="/images/chroma-db/notebook-1.jpg" /><figcaption class="p-2 text-center">Jupyter notebook</figcaption></figure>

```
$ pip install jupyterlab notebook ipywidgets
$ gem install iruby
$ iruby register --force
```

<figure><img src="/images/chroma-db/notebook-2.jpg" /><figcaption class="p-2 text-center">Jupyter notebook</figcaption></figure>

## Final
The work of LLMs is very popular now days, tooling in the Python and JavaScript world is moving very fast. Ruby has always been excluded from ML or NLP technology.

There is an opportunity for Ruby tools in the "chain" areas to connect and integrate services around the LLMs. If you feel the same, please contribute to improving this client and to create other tools that we can use in our Ruby world. 
