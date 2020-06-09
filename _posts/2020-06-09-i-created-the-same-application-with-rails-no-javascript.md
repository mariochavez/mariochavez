---
layout: orio-post
title: "I created the same app with Rails and no Javascript"
date: 2020-06-09 00:01:00 -0600
published: June 09, 2020
categories: desarrollo
description: A few weeks ago, I found a tweet from Chris McCord, the creator of Phoenix Framework for Elixir, where he was showcasing a new functionality coming with Phoenix 1.5, he wrote a small Twitter clone without Javascript, it was beautiful.
image: rails-todo-no-js.png
keywords: english, development, rails, javascript, webpack, actioncable, cableready, stimulusjs
author: Mario Alberto Chávez
---
Last year I wrote a blog post, "[I created the same application with Rails and Javascript](https://mariochavez.io/desarrollo/2019/12/23/i-created-the-same-app-with-rails-and-javascript.html){:target="_blank"}", following a trend of posts where the author [Sunil Sandhu](https://medium.com/@sunilsandhu){:target="_blank"} did the same comparing a few frontend Javascript libraries.

My approach in that blog post was using Rails to render all HTML and then using a bit of Javascript with [Stimulus](https://stimulusjs.org){:target="_blank"} to recreate the same application behavior.

A few weeks ago, I found a tweet from [Chris McCord](https://twitter.com/chris_mccord/status/1252997316103081984){:target="_blank"}, the creator of Phoenix Framework for Elixir, where he was showcasing a new functionality coming with Phoenix 1.5, he wrote a small Twitter clone without Javascript, it was beautiful.

<div class="blog-media">
  <img width="1200" height="800" src="{{ '/assets/img/chris-mccord.png' | relative_url }}"
  class="attachment-orio-thumb-big size-orio-thumb-big wp-post-image" alt="Chis McCord Tweet"
  srcset="{{ 'chris-mccord.png' | srcset }}" sizes="(max-width: 1200px) 100vw, 1200px" />
</div>

Later, I found a [video](https://twitter.com/mario_chavez/status/1256263180722081792){:target="_blank"} from [Hopsoft](https://twitter.com/hopsoft){:target="_blank"} where he did the same with Ruby on Rails using his libraries [CableReady](https://cableready.stimulusreflex.com){:target="_blank"} and [StimulusReflex](https://docs.stimulusreflex.com){:target="_blank"}, no Javascript, just Ruby using Rails' ActionCable to broadcast DOM changes, it was fantastic.
<div class="blog-media">
  <img width="1200" height="800" src="{{ '/assets/img/mario-chavez.png' | relative_url }}"
  class="attachment-orio-thumb-big size-orio-thumb-big wp-post-image" alt="Mario Chávez Tweet"
  srcset="{{ 'mario-chavez.png' | srcset }}" sizes="(max-width: 1200px) 100vw, 1200px" />
</div>

So I decided to give another try to the same application by removing the Javascript that I wrote for it. The starting code for this post is at [https://github.com/mariochavez/rails-todo-2019](https://github.com/mariochavez/rails-todo-2019){:target="_blank"}.

## Setup ActionCable

In the original application the Rails application was created without [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html){:target="_blank"} support; it is needed for CableReady to work.

First, make sure that `config/application.rb` has the following line uncommented.

```ruby
require "action_cable/engine"
```

Create the file `config/cable.yml` and add the following content.

```yaml
development:
  adapter: async

test:
  adapter: async

production:
  adapter: redis
  url: redis://127.0.0.1:6381
  channel_prefix: todos_production
```

Using `async` in this case, save us from the need to have a Redis instance running on Development and Test. Still, add the Redis library to your `Gemfile`.

```ruby
gem "redis", "~> 4.2"
```

ActionCable works with a Javascript side, so we need to install the libraries with Yarn.

```bash
$ yarn add @rails/actioncable
```

Finally, generate an ActionCable channel with the following command and require the channels in your `app/javascript/pack/application.js`

```bash
$ bin/rails g channel todo
```

```jsx
# app/javascript/pack/application.js
import "channels"
```

At this point, ActionCable is ready for us to use.

## Remove Javascript code

This step is quite simple, remove the two Stimulus controllers from the previous version of this application.

```bash
$ rm app/javascript/controllers/todo_controller.js app/javascript/controllers/todo_delete_controller.js
```

The application does not work anymore after removing these files — Cleanup the Rails templates from all the data attributes required by the deleted Stimulus controllers.

```html
# app/views/todos/_todo.html.erb

<div id="<%= dom_id(todo) %>" class="ToDoItem">
  <p class="ToDoItem-Text"><%= todo.name %></p>
  <%= button_to "-", todo_path(todo.id),
      method: :delete,
      remote: true,
      class: "ToDoItem-Delete"
     %>
</div>
```

In this template, you need the `Todo#id` attribute; the `dom_id` method creates an id like `todo_1` for you.

```html
# app/views/todos/index.html.erb

<div class="ToDo">
  <%= image_tag asset_pack_path("media/images/logo.png"), class: "Logo", alt: "Rails logo" %>
  <h1 class="ToDo-Header">Rails To Do</h1>
  <div class="ToDo-Container">
    <div id="todo-list" class="ToDo-Content">
      <%= render @todos %>
    </div>
 
    <div class="ToDoInput">
      <%= form_with model: @todo, local: false do |form| %>
        <%= form.text_field :name %>
        <%= form.submit "+", class: "ToDo-Add" %>
      <% end %>
    </div>
  </div>
</div>
```

This template needs the id for the Todos list container. Here how it looks after removing all data attributes.

## Reimplement functionality without Javascript

It is the time to install CableReady in your application.

```bash
$ bundle add cable_ready
$ yarn add cable_ready
```

With CableReady installed, we need to setup ActionCable's channel for it. First, setup the Javascript channel to require the CableReady library and update the `received` method to call CableReady if data transmitted via ActionCable is CableReady data.

```jsx
# app/javascript/channels/todo_channel.js

import consumer from "./consumer"
import CableReady from "cable_ready"

consumer.subscriptions.create("TodoChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    if (data.cableReady) CableReady.perform(data.operations)
  }
});
```

Next, open the `TodoChannel` class and set the stream name to *"todos"*.

```ruby
# app/channels/todo_channel.rb

class TodoChannel < ApplicationCable::Channel
  def subscribed
    stream_from "todos"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
```

First, reimplement the delete functionality for Todos. This one is quite simple; when the user clicks on the delete button, an ajax call is made via Rails UJS and received by `TodosController#destroy` action. Here you tell CableReady what operations to perform back to the DOM and broadcast them via ActionCable.

```ruby
# app/controllers/todos_controller.rb

def destroy
  todo = Todo.find_by(id: params[:id])
  todo.destroy

  cable_ready[TODOS_CHANNEL].remove(selector: "##{ActionView::RecordIdentifier.dom_id(todo)}")
  cable_ready.broadcast

  render plain: "", status: :no_content
end
```

The *remove* operation needs the id of the Todoto remove, and then the operation is broadcast to the browser. The Todo is removed not only in your browser but if we have other browsers or tabs open with the application, the Todo is removed across all of them. Here is what CableReady send via ActionCable.

```jsx
{"identifier":"{\"channel\":\"TodoChannel\"}","message":{"cableReady":true,"operations":{"remove":[{"selector":"#todo_14"}]}}}
```

To create a new Todo, you need more than one operation to be broadcasted, CableReady allows you to batch operations very easy.

```ruby
# app/controllers/todos_controller.rb

def create
  todo = Todo.new(todo_params)

  if todo.save
    cable_ready[TODOS_CHANNEL].insert_adjacent_html(
      selector: "#todo-list",
      position: "afterbegin",
      html: render_to_string(partial: "todos/todo", locals: {todo: todo}, formats: [:html])
    )
    cable_ready[TODOS_CHANNEL].set_value(
      selector: "#todo_name",
      value: ""
    )
    cable_ready[TODOS_CHANNEL].remove(
      selector: ".error"
    )
    cable_ready.broadcast

    return render(plain: "", status: :created)
  end

  cable_ready[TODOS_CHANNEL].insert_adjacent_html(
    selector: "#todo_name",
    position: "afterend",
    html: "<p class='error'>#{todo.errors[:name].first}</p>"
  )
  cable_ready.broadcast

  render json: {errors: todo.errors.to_h}, status: :unprocessable_entity
end
```

The form to create a new Todo in our UI sends a remote form call via Rails UJS; this call is dispatched to `TodosController#create` action, which validates and saves the received Todo. If the Todo is saved, then it performs 3 CableReady operations.

1. The `insert_adjacent_html` operation renders a partial HTML for the new Todo and is inserted at the top of the todos list container identified by `#todo-list`.
2. Clears the value for Todo's input in the form by using the `set_value` method.
3. If there is any error from previous actions, it clears the error with the `remove` method.

If validation fails and the Todo is not saved, an error is added via the `insert_adjacent_html` method.

You are done; after these changes, the application should behave as before. You manage to remove all written Javascript for this application while keeping the same functionality.

## Final words

First of all, it is clear that you are using Javascript but not Javascript code that you need to maintain. Under the hood, ActionCable and CableReady provide Javascript functionality to interact with the Browser.

Writing applications this way, opens the world a new kind of Rails applications that are reactive, connected, and that takes advantage of Server Side Rendering, Caching, and minimal frontend Javascript. I am eager to see the first Rails applications build this way.
