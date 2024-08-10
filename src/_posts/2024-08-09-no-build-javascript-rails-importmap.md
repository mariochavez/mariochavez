---
layout: post
title: No build for Javascript libraries with Rails and Importmap
date: 2024-08-09 12:00:00 -0600
published: Agosoto 09, 2024
categories: desarrollo
description: Learn how to simplify JavaScript management in Ruby on Rails using Importmaps. Discover local pinning, CDN integration, and Stimulus controller implementation with Chart.js 
keywords: Ruby on Rails Importmaps, Modern Rails development, Chart.js with Rails, CDN pinning Rails
image: /images/no-build/no-build.jpg
lang: en_US
ld_schema: >
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://mariochavez.io/desarrollo/2024/08/09/no-build-javascript-rails-importmap/"
    },
    "headline": "No build for Javascript libraries with Rails and Importmap",
    "datePublished": "2024-08-09",
    "dateModified": "2024-08-09",
    "author": {
      "@type": "Person",
      "name": "Mario Alberto Chávez Cárdenas"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mario Alberto Chávez Cárdenas",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mariochavez.io/logo.png"
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://mariochavez.io/images/no-build/no-build.jpg",
      "height": 630,
      "width": 1200
    },
    "description": "Learn how to use Importmap in Ruby on Rails for managing JavaScript libraries without a build step, including troubleshooting tips for integrating third-party libraries like Chart.js.",
    "articleBody": "As a web developer working with Ruby on Rails, you're always looking for ways to streamline your workflow and make your applications more efficient. Enter Importmap - a powerful feature that simplifies how you manage JavaScript libraries in your Rails projects. In this post, we'll dive into what Importmap is, how it works, and how you can use it for your projects.",
    "keywords": [
      "Ruby on Rails",
      "Importmap",
      "JavaScript",
      "Chart.js",
      "No build",
      "Web development"
    ],
    "articleSection": "Desarrollo",
    "inLanguage": "en-US",
    "isAccessibleForFree": "True",
    "hasPart": [
      {
        "@type": "WebPageElement",
        "isAccessibleForFree": "True",
        "cssSelector": ".prose"
      }
    ],
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "article h1",
        "article h2",
        "article p"
      ]
    },
    "mentions": [
      {
        "@type": "SoftwareApplication",
        "name": "Ruby on Rails",
        "operatingSystem": "All"
      },
      {
        "@type": "SoftwareApplication",
        "name": "Chart.js",
        "operatingSystem": "All"
      } 
    ]
  }
---

As a web developer working with Ruby on Rails, you're always looking for ways to streamline your workflow and make your applications more efficient. Enter Importmap - a powerful feature that simplifies how you manage JavaScript libraries in your Rails projects. In this post, we'll dive into what Importmap is, how it works, and how you can use it for your projects.

## What is Importmap?

Importmap is a way to map JavaScript module names to their actual locations. They allow you to use `import` statements in your JavaScript code without needing a bundler like Webpack or Rollup. This means you can use modern JavaScript modules directly in the browser, making your development process simpler and faster.

## How does Importmap work?

1. **Mapping**: Importmaps create a mapping between a module name and its location.
2. **Browser Support**: Modern browsers use this mapping to load modules when they encounter `import` statements.
3. **Rails Integration**: Rails 7+ includes built-in support for Importmap, making it easy to use in your projects.
4. **Local Pinning**: By default, Rails pins libraries locally, copying the code to your project into the `vendor/javascript` folder. While this might feel similar to how JavaScript libraries were vendored in older Rails projects, Importmap provides a modern tool for managing dependencies and versions.

## Practical tips for using Importmap in Rails

### 1. Setting up Importmap

For a new Rails application, Importmap is set up by default. If you want to add it to an existing application, then follow these steps.

To get started with Importmap in your Rails project, add this to your Gemfile:

```ruby
gem "importmap-rails"
```

Then run:

```
bundle install
bin/rails importmap:install
```

This sets up the necessary files and configurations.

### 2. Adding JavaScript libraries

To add a library, use the `pin` option with `bin/importmap` command. Let's use Chart.js as an example:

```bash
> bin/importmap pin chart.js
Pinning "chart.js" to vendor/javascript/chart.js.js via download from https://ga.jspm.io/npm:chart.js@4.4.3/dist/chart.js
Pinning "@kurkle/color" to vendor/javascript/@kurkle/color.js via download from https://ga.jspm.io/npm:@kurkle/color@0.3.2/dist/color.esm.js
```

This command performs the following steps::

1. Download Chart.js and its dependencies.
2. Place the files in the `vendor/javascript` directory.
3. Update the `config/importmap.rb` file with the correct local paths.

This is the contents of `vendor/javascript` directory.

```bash
> ls vendor/javascript
8.5k  9 Aug 12:53 -N  @kurkle--color.js
186k  9 Aug 12:53 -N  chart.js.js
```

The `config/importmap.rb` looks as follows with the pinned libraries.

```ruby
pin 'chart.js' # @4.4.3
pin '@kurkle/color', to: '@kurkle--color.js' # @0.3.2
```

Now, let's create a Stimulus controller to use Chart.js. First, make sure you have Stimulus installed in your Rails application. Then, create a new file `app/javascript/controllers/chart_controller.js`:

```javascript
import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default class extends Controller {
  static targets = ['canvas']

  connect() {
    const ctx = this.canvasTarget.getContext('2d')
    this.chart = new Chart(ctx, {
  type: 'line',
  data: {
   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
   datasets: [{
    label: 'Sample Data',
    data: [65, 59, 80, 81, 56, 55],
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderWidth: 2
   }]
  },
  options: {
   scales: {
    y: {
     beginAtZero: true
    }
   }
  }
 })
  }

  disconnect() {
    this.chart.destroy()
  }
}
```

Now you can use this Stimulus controller in your Rails view. For example, in `app/views/home/index.html.erb`:

```erb
<div data-controller="chart">
  <canvas data-chart-target="canvas" width="400" height="200"></canvas>
</div>
```

This setup allows you to easily create charts in your Rails application using Chart.js through a Stimulus controller. The chart data can be dynamically passed from your Rails backend to the frontend using Stimulus values.

But if you try to load the page, the graph is not displayed. After looking at the developer tools in the browser, you will find the following error:

```
Failed to register controller: chart (controllers/chart_controller)
  TypeError: Importing a module script failed.
```

The error is not helpful, but it gives you a clue that there is a problem with the dependencies in the Stimulus `chart_controller`. Looking at the network tab in the browser tools, you find out that there is a missing file.

```
URL: http://localhost:3000/_/6La3kzg5.js
Status: 404 Not Found
Source: Network
```

Looking at the code of the file `vendor/javascript/chart.js.js`, almost at the beginning of the file, you find the following reference:

```javascript
import{r as t,c ...
... as Jt}from"../_/6La3kzg5.js" ...
```

It seems like [jspm.io](https://jspm.org) adds a dependency which Importmap is unable to identify and download with the rest of the files. This is a known issue documented in the Importmap repository, as [Download all the files associated with a package from a CDN](https://github.com/rails/importmap-rails/pull/235).

### 3. Pinning from CDNs

While Importmap pins libraries locally by default, it also allows you to pin from a CDN instead. Using this method, the library is served directly from the CDN instead of our Rails application.

To try to find a solution, change the pins in the `config/importmap.rb` file to point to the CDN:

```ruby
# Using JSPM.io (default)
pin 'chart.js', to: 'https://ga.jspm.io/npm:chart.js@4.3.0/dist/chart.js'
pin '@kurkle/color', to: 'https://ga.jspm.io/npm:@kurkle/color@0.3.2/dist/color.esm.js'
```

After making the change, reload the page. Now the graph is there, loading the libraries from the CDN solved the issue of missing references. If you are ok with this approach, then you can stop here.

If your goal is to serve and cache the libraries without a dependency on external CDN, then continue to the next section.

### 4. Customizing local pinning

With the option to choose a CDN from which to vendor JavaScript libraries, you should try another CDN, like [JSDeliver](www.jsdelivr.com). Each CDN bundles dependencies differently, so you might get lucky trying another option.

Remove all files from `vendor/javascript` and remove the pins to Chart.js and @kurkle/color from `config/importmap.rb`. The Importmap's pin command accepts option `-f` to specify a specific CDN different from JSpm.io.

The first try to pin Chart.js fails with an error.

```bash
> bin/importmap pin chart.js -f jsdelivr
Pinning "chart.js" to vendor/javascript/chart.js.js via download from https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.js
/.rbenv/versions/3.3.4/lib/ruby/3.3.0/net/http.rb:1603:in `initialize': Failed to open TCP connection to cdn.jsdelivr.net:443 (execution expired) (Net::OpenTimeout)
```

For the second try, add the library @kurkle/color to the pin command:

```bash
> bin/importmap pin chart.js @kurkle/color  -f jsdelivr
Pinning "@kurkle/color" to vendor/javascript/@kurkle/color.js via download from https://cdn.jsdelivr.net/npm/@kurkle/color@0.3.2/dist/color.esm.js
Pinning "chart.js" to vendor/javascript/chart.js.js via download from https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.js
```

This time it succeeded, the new files are placed in `vendor/javascript` and the file `config/importmap.rb` contains the pins. Reloading the page in your application shows that you have the same error as before, the missing file name is different but still the same result.

It is time to try something different. Remove the files from `vendor/javascript` one more time. Navigate to that directory and open your browser to <https://www.jsdelivr.com/>. Search for Chart.js and from the code block copy the URL and download the library using curl. Also, search for @kurkle/color and download it.

```bash
> curl -o chart.js.js 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/+esm'
> curl -o @kurkle--color.js 'https://cdn.jsdelivr.net/npm/@kurkle/color@0.3.2/+esm'
```

Once again, reload your application page. One more time you will get an error in the browser developer tools, but this time the error is different. It says that @kurkle/color failed to be loaded.

```
[Error] Failed to load resource: the server responded with a status of 404 (Not Found) http://localhost:3000/npm/@kurkle/color@0.3.2/+esm
[Error] Failed to register controller: chart (controllers/chart_controller) – TypeError: Importing a module script failed.
TypeError: Importing a module script failed.
 error
```

The reference to `npm/@kurkle/color@0.3.2/+esm` appears at the beginning of chart.js.js file. You need to replace this reference for the @kurkle/color that you have pinned in `config/importmap.rb`. Use `sed` command to replace the value as follows:

```bash
sed -i '' 's|/npm/@kurkle/color@0.3.2/+esm|@kurkle/color|g' chart.js.js
```

After this change, reload the application page. Now the graph is rendered and there are no errors related to missing references.

Not in all cases when pinning libraries from a CDN you will have this problem, but if there is a case, now you know how to diagnose and try to fix it. I would expect that newer versions of Importmap will have a feature to understand and resolve hidden references that libraries might have.

## Conclusion

Importmap in Ruby on Rails offers a streamlined approach to managing JavaScript libraries like Chart.js. By simplifying your workflow, leveraging the power of modern browsers, and providing local access to your dependencies, you can focus more on creating functionality and less on configuration. Give Importmap a try in your next Rails project and experience the benefits for yourself!

Remember, while Importmap is powerful and the default local pinning provides good version control, you still have the flexibility to use various CDNs when needed. Consider your specific needs and performance requirements when deciding on your Importmap strategy.
