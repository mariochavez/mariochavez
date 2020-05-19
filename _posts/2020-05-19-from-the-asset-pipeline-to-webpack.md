---
layout: orio-post
title: "From the Asset Pipeline to Webpack"
date: 2020-05-19 00:00:00 -0600
published: May 19, 2020
categories: desarrollo
description: Rails 5.2 and newer adds Webpack to support modern tools to work on newer frontend technologies.
image: webpack-post.jpg
keywords: english, development, rails, javascript, webpack, webpacker, ecma5
author: Mario Alberto Chávez
---
# From the Asset Pipeline to Webpack

In May 2011, DHH announced at Railsconf a new framework for Rails, The Asset Pipeline. It was also announced that SCSS and CoffeeScript, along with jQuery, were to become a default on every Rails application.

The recognition that Web Development changed since Rails was created, and that it was the time for Rails to promote to first-class citizen every aspect of building Web UIs.

<div class="blog-media">
  <img width="1200" height="800" src="{{ '/assets/img/dhh-tweet.png' | relative_url }}"
  class="attachment-orio-thumb-big size-orio-thumb-big wp-post-image" alt="API Blueprint"
  srcset="{{ 'dhh-tweet.png' | srcset }}" sizes="(max-width: 1200px) 100vw, 1200px" />
</div>

It was a step forward, but people complained about SCSS and CoffeeScript becoming the default on every project. The plan was in place, and on August 31st, 2011 [version 3.1 was released](http://guides.rubyonrails.org/3_1_release_notes.html){:target="_blank"}.

In the Rails world, the frontend development was done with HTML/CSS and jQuery plugins, but the UI complexity and Javascript spaghetti code needed a different solution, this how frontend libraries started to arise, being one of the first [Backbone.js](http://backbonejs.org){:target="_blank"} 

Managing, invalidating, and serving assets was a difficult task, and [the Asset Pipeline](http://guides.rubyonrails.org/asset_pipeline.html){:target="_blank"} came with the promise to make it easy. Front-end development continued moving forward; eventually, Backbone.js died, and jQuery was not enough anymore.

[Node.js](https://nodejs.org/en/){:target="_blank"}, [NPM](https://www.npmjs.com), and ECMA 5 stepped in and rapidly influenced how to do frontend development. Single-page applications became a thing, and this had a direct effect in the Rails world where it was no longer easy just to download a Javascript file, put it in the vendor folder, and expect it to work.

[Sprockets](https://github.com/rails/sprockets){:target="_blank"}, the heart of the Asset Pipeline, tried to keep up, but somehow, it fell short. I saw different solutions that included Gulp, Grunt, and Bower as a way to keep doing modern Web frontend development, and there was no joy on any of it.

Finally, to address this situation, on April 27th, 2017 [Rails 5.1](https://sipsandbits.com/2017/03/09/whats-new-in-rails-51/){:target="_blank"} was released, it included Yarn to manage Javascript dependencies and support for [Webpack](https://webpack.js.org) with sensitive defaults and integration on Rails itself via [Webpacker](https://github.com/rails/webpacker).

Rails provide a tool that is familiar to frontend developers and eases the adoption of new Javascript libraries. Still, compatibility needs to be kept for projects that use the Asset Pipeline, so it was not removed. You can use Webpacker and the Asset Pipeline seamlessly. It may take a few more versions before the Asset Pipeline becomes deprecated.

## Starting with Webpack.
If you are creating a new Rails application starting with Webpack is easy.

```
$ rails new sample_app
```

For a new Rails project on version 6.0, Webpack is set up by default. If you need a Javascript library like React, Angular, Elm, Vuejs, or Stimulusjs, you can specify it with an option.

```
$ rails new sample_app --webpack=react
```

If you want to disable the Asset Pipeline, add the following flag to the new command.

```
$ rails new sample_app --skip-sprockets
```

Be aware that the `app/assets` folder is created even when this flag is set, so you might need to remove it manually.

```
app/assets
├── config
├── images
└── stylesheets
```

Rails configure Webpack to work seamlessly with the development, test, and production environment. The Webpacker gem is responsible for this integration. If you need to tweak or change Webpack's configuration, configuration files can be found at the `/config` folder.

```
config/webpacker.yml
config/webpack
├── development.js
├── environment.js
├── production.js
└── test.js
```

All frontend assets are organized around packs. A pack is a bundle for all required assets, like public application assets or the administration assets. A pack is an entry point that declares all the assets for each pack; a pack can share assets between them. Pack definitions live inside `/app/javascript/packs` folder. The default pack is application.js.

Now you can create a folder for images, stylesheets, or any other asset that needs to be served with Webpack.

```
app/javascript
├── controllers
├── images
├── packs
└── stylesheets
    └── modules
```
Just be sure to require the assets in their corresponding packs, or Webpack will not load them.

Also, you need to ensure that all your views layouts are using Webpacker helpers to load the packs.

```
<%= javascript_pack_tag "application" %>
<%= stylesheet_pack_tag "application" %>
```

Running the Rails server, in development mode, and visiting a page start a Webpack process to compile the required packs delaying the response from the server. Compiling assets this way is simple but slow. 

A faster approach is running a separate Webpack process; just run the Webpack development server.

```
$ bin/webpack-dev-server
```

A benefit of having a separate process for Webpack is that it makes compilation fast, and also it auto-reload the current page if changes on assets are detected. A simple solution to start the Rails and Webpack servers on their separate process is to create a `Procfile` and use a tool like [Overmind](https://github.com/DarthSim/overmind){:target="_blank"} to start them.

```
server: bin/rails server
assets: bin/webpack-dev-server
```

```
$ overmind start
server | Started with pid 9681...
assets | Started with pid 9682...
warning package.json: No license field
assets | ℹ ｢wds｣: Project is running at http://localhost:3036/
assets | ℹ ｢wds｣: webpack output is served from /packs/
assets | ℹ ｢wds｣: Content not from webpack is served from /../public/packs
assets | ℹ ｢wds｣: 404s will fallback to /index.html
server | => Booting Puma
server | => Rails 6.0.2.2 application starting in development
server | => Run `rails server --help` for more startup options
server | Puma starting in single mode...
server | * Version 4.3.3 (ruby 2.6.5-p114), codename: Mysterious Traveller
server | * Min threads: 5, max threads: 5
server | * Environment: development
server | * Listening on tcp://127.0.0.1:3036
server | * Listening on tcp://[::1]:3036
...
```

## Moving from the Asset Pipeline to Webpack
Everything described in the previous section applies to new Rails applications, but what about an existing application? If your application is not a Rails 6.0 o better, you might need to install Webpack manually.

Before continuing, I want to make it clear that if your Javascript does not follow the [Node.js Modules](https://nodejs.org/api/modules.html){:target="_blank"} [pattern](https://darrenderidder.github.io/talks/ModulePatterns/#/) you need to figure out how to change your code to make it Webpack friendly.

Rails applications older than version 6.0 might not have Webpack integration installed; to install it first, add the Webpacker gem to your Gemfile and run Bundler. Now generate Webpack configuration files by running the following command.

```
$ bin/rails g webpacker:install
```

If you need to add support for a frontend Javascript library like Rect or Stimulus, run the Webpacker generator.

```
$ bin/rails g webpacker:install:react
```
OR
```
$ bin/rails g webpacker:install:stimulus
```

The `application.js` pack is modified to include everything you need to start working with the installed Javascript library.

With Webpack in place, you can start moving your assets from the Asset Pipeline folders to the new `app/javascript` folder. Let us start with images. Move your images to `app/javascript/images` in there. You can organize the images into sub-folders, for example, images for the public frontend and images for the private backend or just leave all of them there.

In the `application.js` file, you can import images one by one as follow.

```
import '../images/image1.png';
import '../images/image2.png';
...
import '../images/imageN.png';
```

Or you can take advantage of Webpacker's `require.context` and import all of them at once.

```
require.context('../images', true);
```

The second param tells Webpacker to scan subdirectories inside `app/javascript/images`. You can also be more selective and pass the third parameter as a regular expression to import just the matched images. To use an image in a Rails view, you need to make use of the `asset_pack_tag` helper. 

```
<%= image_pack_tag("image1.png") %>
```

But if you need the image URL, then use the `asset_pack_url`.

```
<%= asset_pack_tag("image1.png") %>
```

If you need to reference an image from a stylesheet file, then use the `url` function with the relative path to the image.

```
background-image: url("../images/image1.png");
```

Moving the Stylesheets is not different than moving the images into Webpacker. Just move the files into `app/javascript/stylesheets`. You need to require all your stylesheet files one by one or all at once using `require.context` function.

```
require("../stylesheets/application.css");
require("../stylesheets/module/navbar.css");

// Or all at once
require.context('../stylesheets', true);
```
If you are using SASS, it is best to require the entry file and then within SASS import your stylesheets.

```
require("../stylesheets/application.scss");
```

Then in your `application.scss` import your stylesheets as you normally do.

```
import 'layout.css';
...
import 'buttons.css';
```

From your SASS file, you can import Stylesheets from installed Javascript libraries and take advantage of SASS variables or functions they provide.

```
@import '~bulma/bulma';
...
@import "~notyf/notyf.min";
```

Just remember to use Yarn to install any dependency that is managed by Webpack. For example, to install [Bulma](https://bulma.io/){:target="_blank"} CSS library, run the following command. 

```
$ yarn add bulma
```

Moving your Javascript files could be a little more complicated, it depends on their complexity, but the approach is the same. Move all files to `app/javascript/scripts`, and with Yarn, add all the libraries your code depends.

Here is an example of adding Javascript dependencies to a project.

```
$ bin/yarn add  jquery turbolinks @rails/ujs @rails/activestorage
```

Each library has different requirements on how they need to be imported and started because of this always read their README file to ensure you are using them correctly.

```
import Rails from 'rails-ujs';
import Turbolinks from 'turbolinks';
import * as ActiveStorage from 'activestorage';

Rails.start()
Turbolinks.start()
ActiveStorage.start()
```

In most cases, jQuery needs to be available globally and accessible with `$` and `jQuery`. To accomplish this, open the `config/webpack/environment.js` file and add the following lines just above `module.exports = environment`.

```
const webpack = require('webpack');
environment.plugins.append('Provide', new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
}))
```

If you find that your Javascript code fails to be compiled by Webpacker due to a missing variable, you may need to add additional `import` on top of the file that fails to compile.

At this point, Webpack should compile your assets successfully; if that is the case, then you are ready to remove the Asset Pipeline if not the additional debug is required.

To disable the Asset Pipeline in your application, remove references to `config.assets` in `config/environments/production.rb` and `config/environments/development.rb`. Also, remove the `config/initializer/assets.rb` file and finally remove coffee-rails, sass-rails, and uglifier gems from your Gemfile. 

The file `config/application.rb` needs a change to not require all Rails frameworks, remove this line `require "rails/all"`, and expand the frameworks list where `"sprockets/railtie"` is commented.

```
require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
# require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"
```

As the last step, remove the `app/assets` folder. Now your application uses Webpack to manage your application assets.

## Conclusion
If you are reading this, it means that your application is running with Webpack, congratulations! Your team now has modern tools to work on your frontend.

