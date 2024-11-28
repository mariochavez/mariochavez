---
layout: post
title: Nobuild with Rails and Importmap
date: 2024-11-28 12:00:00 -0600
published: Noviembre 28, 2024
categories: desarrollo
description: Learn how to use Importmap in Ruby on Rails to manage JavaScript dependencies without bundling. Covers web standards, Rails integration, gems compatibility, and suggested practices.
keywords: Ruby on Rails, JavaScript, Importmap, ES Modules, Propshaft, NoBuild
lang: en_US
image: /images/no-build-importmap/nobuild-with-rails.jpg
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://mariochavez.io/desarrollo/2024/11/28/nobuild-with-rails-and-importmap"
    },
    "headline"": "Nobuild with Rails and Importmap",
    "description": "Learn how to use Importmap in Ruby on Rails to manage JavaScript dependencies without bundling. Covers web standards, Rails integration, gems compatibility, and suggested practices.",
    "author": {
      "@type": "Person",
      name: "Mario Alberto Chávez Cárdenas"
    },
    "datePublished": "2024-11-28",
    "publisher": {
      "@type": "Organization",
      "name": "Mario Alberto Chávez Cárdenas",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mariochavez.io/logo.png"
      }
    },
    "articleBody": "The latest versions of Ruby on Rails have focused on simplicity across different aspects of the framework, accompanied by the promise to return to the "one-man framework" (where a single developer can effectively build and maintain an entire application). .",
    "keywords": [
      "Ruby on Rails",
      "Importmap",
      "JavaScript",
      "ES modules",
      "NoBuild",
      "Propshaft",
      "Web development"
    ],
    "articleSection": "Desarrollo",
    "inLanguage": "en-US",
    "image": [
      {
        "@type": "ImageObject",
        "url": "https://mariochavez.io/images/no-build-importmap/nobuild-with-rails.jpg",
        "width": 1200,
        "height": 630,
        "caption": "Importmap in Ruby on Rails"
      },
      {
        "@type": "ImageObject", 
        "url": "https://mariochavez.io/images/no-build-importmap/heroimage-home.png",
        "width": 800,
        "height": 450,
        "caption": "heroImage website example"
      },
      {
        "@type": "ImageObject",
        "url": "https://mariochavez.io/images/no-build-importmap/tools.png", 
        "width": 800,
        "height": 450,
        "caption": "Web developer tools showing HTTP/2 performance"
      }
    ],
  }
---

The latest versions of Ruby on Rails have focused on simplicity across different aspects of the framework, accompanied by the promise to return to the "one-man framework" (where a single developer can effectively build and maintain an entire application).

Importmap Rails library is based on the principle that modern web browsers have caught up with the ECMAScript specification and can interpret ES Modules (ESM). As a web standard, Importmap allows you to control how JavaScript modules are resolved in the browser and manage dependencies and versions without the need to transpile or bundle the code sent to the browser.

## How the Importmap Web Standard Works

It all starts with a `script` tag of type `importmap` defined in your application's main layout or web page. Inside this tag, a JSON object defines aliases and their corresponding paths to the source code.

```html
<script type="importmap">
  {
    "imports": {
      "application": "/assets/application.js",
      "local-time": "https://cdn.jsdelivr.net/npm/local-time@3.0.2/app/assets/javascripts/local-time.es2017-esm.min.js",
      "utils": "/assets/utils.js"
    }
  }
</script>
```

In the same map, you can mix library paths pointing to a CDN or using local resources. To use libraries from this map, reference the alias name.

```javascript
<!-- Below the importmap script -->
<script type="module">import "application"</script>
```

And in your _application.js_, import needed dependencies:

```javascript
// application.js

import LocalTime from "local-time";
LocalTime.start();

import "utils";
```

Importmap support is present in browsers Chrome 89+, Safari 16.4+, Firefox 108+, and Edge 89+. For older browsers, include a polyfill:

```html
<script
  async
  src="https://ga.jspm.io/npm:es-module-shims@1.10.1/dist/es-module-shims.js"
></script>
```

## How Importmap Works in Ruby on Rails

Importmap functionality in Ruby on Rails follows the same standard described above and offers an easy way to create maps and version files. Using a web application named **heroImage** as an example (source code available on [Github](https://github.com/mariochavez/inspiration)), let's explore the implementation.

![heroImage website](/images/no-build-importmap/heroimage-home.png)

When you create a new Rails 8 application, the **importmap-rails** gem is added and installed by default. A file _config/importmap.rb_ is created where you can _pin_ the JavaScript code needed in your application.

```ruby
pin "application"

pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"

pin_all_from "app/javascript/controllers", under: "controllers", preload: false
```

The `pin` keyword takes up to three arguments. The first one is required, as it is the alias of the JavaScript code. `pin "application"` is a shortcut for file _application.js_ with alias _application_:

```ruby
pin "application", to: "application.js"
```

When alias and file names differ, use the keyword `to:`:

```ruby
pin "@hotwired/turbo-rails", to: "turbo.min.js"
```

The `pin_all_from` keyword helps reference multiple files at once. The first argument is the path where the JavaScript files are located, and the `under:` argument prefixes the alias for each file. The generated alias uses the _under_ prefix and the file name, like `controllers/alert-controller` for `alert_controller.js` file.

To visualize the Importmap JSON file, execute:

```bash
bin/importmap json

{
  "imports": {
    "@hotwired/turbo-rails": "//127.0.0.1:4700/assets/turbo.min-fae85750.js",
    "@hotwired/stimulus": "//127.0.0.1:4700/assets/stimulus.min-4b1e420e.js",
    "@hotwired/stimulus-loading": "//127.0.0.1:4700/assets/stimulus-loading-1fc53fe7.js",
    "application": "//127.0.0.1:4700/assets/application-b1902c45.js",
    "controllers/application": "//127.0.0.1:4700/assets/controllers/application-fab0f35b.js",
    "controllers": "//127.0.0.1:4700/assets/controllers/index-c3f5d3c4.js",
    "controllers/alert_controller": "//127.0.0.1:4700/assets/controllers/alert_controller-caf203bf.js",
    "controllers/file_controller": "//127.0.0.1:4700/assets/controllers/file_controller-5da5fdc5.js",
    "controllers/notifications_controller": "//127.0.0.1:4700/assets/controllers/notifications_controller-88e2cc65.js",
    "controllers/service_worker_controller": "//127.0.0.1:4700/assets/controllers/service_worker_controller-ad4a24d3.js",
    "controllers/share_controller": "//127.0.0.1:4700/assets/controllers/share_controller-fe28ed00.js"
  }
}
```

Rails resolves all JavaScript through the [Propshaft](https://github.com/rails/propshaft) gem, which resolves the physical path of the JavaScript code, maps to the _/assets_ web path, and adds the digest to each file for better caching and invalidations.

Propshaft discovers physical paths from the asset's configuration:

```ruby
Rails.application.config.assets.paths
```

Ensure your files exist in any of the registered paths or add your own path to be discovered by Propshaft and Importmap.

Importmap in Rails allows you to specify how the browser should load JavaScript files. There are two options: `preload` (default) and no preload. Preload tells the browser to download files as soon as possible. Importmap generates a link tag with `rel="modulepreload"`:

```html
<link
  rel="modulepreload"
  href="https://heroimage.co/assets/turbo.min-fae85750.js"
/>
<link
  rel="modulepreload"
  href="https://heroimage.co/assets/stimulus-loading-1fc53fe7.js"
/>
<link
  rel="modulepreload"
  href="https://heroimage.co/assets/stimulus-loading-1fc53fe7.js"
/>
<link
  rel="modulepreload"
  href="https://heroimage.co/assets/application-b1902c45.js"
/>
```

If you set the `preload` argument to `false`, the link tag is not generated and the browser downloads the file when needed.

With Rails' Importmap, you can also _pin_ JavaScript code from a CDN using the `to:` argument for the URL:

```ruby
pin "local-time", to: "https://cdn.jsdelivr.net/npm/local-time@3.0.2/app/assets/javascripts/local-time.es2017-esm.min.js"
```

The Importmap includes a CLI to **pin** or **unpin** JavaScript code into _config/importmap.rb_ file. It also includes commands to update, audit, and inspect versions:

```bash
bin/importmap --help
Commands:
  importmap audit              # Run a security audit
  importmap help [COMMAND]     # Describe available commands or one specific command
  importmap json               # Show the full importmap in json
  importmap outdated           # Check for outdated packages
  importmap packages           # Print out packages with version numbers
  importmap pin [*PACKAGES]    # Pin new packages
  importmap unpin [*PACKAGES]  # Unpin existing packages
  importmap update             # Update outdated package pins
```

When using the _pin_ command for a JavaScript package, instead of setting the `to:` argument to the CDN, Importmap resolves package dependencies and downloads the package and dependencies to _vendor/javascript_, allowing the Rails application to serve those files:

```bash
bin/importmap pin local-time
Pinning "local-time" to vendor/javascript/local-time.js via download from https://ga.jspm.io/npm:local-time@3.0.2/app/assets/javascripts/local-time.es2017-esm.js
```

```ruby
# config/importmap.rb
...
pin "local-time" # @3.0.2
```

This approach works well when your package has simple dependencies or well-defined dependencies in the JavaScript package. If that's not the case, it becomes challenging to use with Importmap vendoring the code at _vendor/javascript_. It might work with the URL and manual dependency addition, or you can [tweak the vendored code](https://mariochavez.io/desarrollo/2024/08/09/no-build-javascript-rails-importmap/) to make it work.

## How to Work with Rails Gems - Engines - and Importmap?

There are two approaches to creating Ruby on Rails gems compatible with Importmap. The first approach allows your gem to provide JavaScript code, which you can choose to pin in the Importmap configuration. This is how the **turbo-rails** and **stimulus-rails** gems are implemented.

Place your JavaScript code in the _app/assets/javascripts_ folder of your gem. You may need an additional process that minifies the JavaScript files and generates JavaScript map files. Then, inside the `Engine` class, define an `initializer` hook to declare your JavaScript code with Propshaft:

```ruby
module MyEngine
  class Engine < ::Rails::Engine
    # Additional code
    PRECOMPILE_ASSETS = %w( my_javascript.js my_javascript.min.js my_javascript.min.js.map ).freeze

    initializer "my_engine.assets" do
      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.precompile += PRECOMPILE_ASSETS
      end
    end
  end
end
```

The second option uses an Importmap configuration file. If your engine has its layout template and the views are isolated from the host application, and the engine doesn't need to share the JavaScript code with the host application, you can create an Importmap configuration file at _config/importmap.rb_, set your pins, place your JavaScript code at _app/javascript_, and configure the engine with an initializer.

Open your `engine.rb` Ruby file and add the Importmap configuration file and a sweeper:

```ruby
initializer "my-engine.importmap", after: "importmap" do |app|
  MyEngine.importmap.draw(root.join("config/importmap.rb"))
  MyEngine.importmap.cache_sweeper(watches: root.join("app/javascript"))

  ActiveSupport.on_load(:action_controller_base) do
    before_action { MyEngine.importmap.cache_sweeper.execute_if_updated }
  end
end
```

Specify the Importmap to use in your engine's layout template:

```html
<%= javascript_importmap_tags "application", importmap: MyEngine.importmap %>
```

For sharing JavaScript code with the host application, like Stimulus controllers, create a partial Importmap configuration file and set the engine to merge it with the main one in the host application.

Create an Importmap configuration file at _config/importmap.rb_ and add the JavaScript pins to share with the host application. If you have dependencies for external packages, add those via a generator or installer to the host application:

```ruby
pin_all_from File.expand_path("../app/assets/javascripts/controllers", __dir__), under: "controllers", preload: false
```

Open your `engine.rb` file and add an initializer:

```ruby
initializer "maquina.importmap", before: "importmap" do |app|
  app.config.importmap.paths << Engine.root.join("config/importmap.rb")
end
```

## What are the Advantages of Using Importmap?

From a Ruby on Rails developer perspective, the main advantage of using Importmap is the freedom from requiring a JavaScript runtime-like node and freedom from the _node_modules_ dependency.

Additionally, you don't need an additional process in development mode to transpile and minify the JavaScript code. You rely on web standards to serve the code to the browser. Deploying your Rails application behind a reverse proxy offers several benefits. First, if you enable the HTTP/2 protocol, your browser can fetch multiple files with a single HTTP connection, and downloading many small JavaScript files won't impact performance.

![Web tools](/images/no-build-importmap/tools.png)

Enabling your proxy to use gzip or brotli compression ensures you are sending very small files while maintaining readability when using browser developer tools. If you change one file, you only need to invalidate that specific file, which the browser will download. The browser knows that a file was modified because of the fingerprint that Propshaft adds to all files.

Using a reverse proxy like [Thruster](https://github.com/basecamp/thruster) along with Puma offloads the assets serving from the Rails application. Thruster can cache assets and serve them when a client requests a file.

## When Not to Use Importmap

There are cases where you should avoid using Importmap in a Rails application. If you are building a SPA application with React, Vue, or any other similar tool, there is a high likelihood you are writing your code with TypeScript. In this case, you should stick with the bundling strategy.

Additionally, if you need to support older browsers, bundling with code transpilation is a better option.
