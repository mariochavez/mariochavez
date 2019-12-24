---
layout: orio-post
title: "I created the same app with Rails and Javascript"
date: 2019-12-23 12:00:00 -0600
published: December 23, 2019
categories: desarrollo
description:
image: vim.png
keywords: english, development, rails, javascript, webpack
author: Mario Alberto Chávez
---
# I created the same app with Rails and Javascript

A few days ago, I came into a post on Medium "[I created the exact same app in React and Svelte. Here are the differences](https://medium.com/javascript-in-plain-english/i-created-the-exact-same-app-in-react-and-svelte-here-are-the-differences-c0bd2cc9b3f8){:target="_blank"}", this post talks about side by side code comparison on writing a simple To Do application with both Javascript Framework.

Sunil Sandhu, the author of the post, is familiar with React by using it at work, and he wrote the post based on his exploration of Svelte and his experience with React.

It is an excellently written post with much useful information, so he tackled the work of creating a second post comparing Svelte and Vue "[I created the exact same app in Vue and Svelte. Here are the differences](https://medium.com/javascript-in-plain-english/i-created-the-exact-same-app-in-vue-and-svelte-here-are-the-differences-c649f8d4ce0a){:target="_blank"}".

While both posts have great information, I have always been vocal about why not try the old good Web foundation before jumping directly into a Javascript framework that takes over the application heart.

So I decided to use his same approach and wrote this post about using HTML, SASS, and [StimulusJs](https://stimulusjs.org){:target="_blank"} with a Rails backend.

## The Rails project

For this project backend needs, there is no need for all the Rails frameworks. Fortunately, a project can be customized since creating to include what is need it. The **rails** command gives many options to what includes and what left out.

    $ rails --help
    $ Usage:
      rails new APP_PATH [options]

    Options:
          [--skip-namespace], [--no-skip-namespace]              # Skip namespace (affects only isolated applications)
      -r, [--ruby=PATH]                                          # Path to the Ruby binary of your choice
                                                                 # Default: /Users/marioch/.rbenv/versions/2.6.3/bin/ruby
      -m, [--template=TEMPLATE]                                  # Path to some application template (can be a filesystem path or URL)
      -d, [--database=DATABASE]                                  # Preconfigure for selected database (options: mysql/postgresql/sqlite3/oracle/frontbase/ibm_db/sqlserver/jdbcmysql/jdbcsqlite3/jdbcpostgresql/jdbc)
                                                                 # Default: sqlite3
          [--skip-gemfile], [--no-skip-gemfile]                  # Don't create a Gemfile
      -G, [--skip-git], [--no-skip-git]                          # Skip .gitignore file
          [--skip-keeps], [--no-skip-keeps]                      # Skip source control .keep files
      -M, [--skip-action-mailer], [--no-skip-action-mailer]      # Skip Action Mailer files
          [--skip-action-mailbox], [--no-skip-action-mailbox]    # Skip Action Mailbox gem
          [--skip-action-text], [--no-skip-action-text]          # Skip Action Text gem
      -O, [--skip-active-record], [--no-skip-active-record]      # Skip Active Record files
          [--skip-active-storage], [--no-skip-active-storage]    # Skip Active Storage files
      -P, [--skip-puma], [--no-skip-puma]                        # Skip Puma related files
      -C, [--skip-action-cable], [--no-skip-action-cable]        # Skip Action Cable files
      -S, [--skip-sprockets], [--no-skip-sprockets]              # Skip Sprockets files
          [--skip-spring], [--no-skip-spring]                    # Don't install Spring application preloader
          [--skip-listen], [--no-skip-listen]                    # Don't generate configuration that depends on the listen gem
      -J, [--skip-javascript], [--no-skip-javascript]            # Skip JavaScript files
          [--skip-turbolinks], [--no-skip-turbolinks]            # Skip turbolinks gem
      -T, [--skip-test], [--no-skip-test]                        # Skip test files
          [--skip-system-test], [--no-skip-system-test]          # Skip system test files
          [--skip-bootsnap], [--no-skip-bootsnap]                # Skip bootsnap gem
          [--dev], [--no-dev]                                    # Setup the application with Gemfile pointing to your Rails checkout
          [--edge], [--no-edge]                                  # Setup the application with Gemfile pointing to Rails repository
          [--rc=RC]                                              # Path to file containing extra configuration options for rails command
          [--no-rc], [--no-no-rc]                                # Skip loading of extra configuration options from .railsrc file
          [--api], [--no-api]                                    # Preconfigure smaller stack for API only apps
      -B, [--skip-bundle], [--no-skip-bundle]                    # Don't run bundle install
      --webpacker, [--webpack=WEBPACK]                           # Preconfigure Webpack with a particular framework (options: react, vue, angular, elm, stimulus)
          [--skip-webpack-install], [--no-skip-webpack-install]  # Don't run Webpack install

    ...

By looking at the command usage information, a decision can be made based on project needs. By running the rails command with the following flags, the bootstrap process is cutting out many dependencies.

    $ rails new frontend -M --skip-action-mailbox --skip-action-text --skip-active-storage --skip-action-cable --skip-sprockets --skip-javascript

[Webpack](https://webpack.js.org){:target="_blank"} will help in this project to handle assets like SASS, Javascript, and images. To install it, open the **Gemfile** and add the [Webpacker](https://github.com/rails/webpacker){:target="_blank"} gem. It is a wrapper for Webpack that helps with Rails integration.

    # Gemfile

    ...
    gem "webpacker", "~> 4.0"
    ...

Run the **bundle** command and then configure Webpack and install StimulusJs in the project.

    $ bundle
    $ bin/rails webpacker:install
    $ bin/rails webpacker:install:stimulus

The project bootstrap is done and ready for you to focus on the functionality of this application.

## Backend side

First, this application needs a `Todo` model with a `Name` attribute to stored To Dos data. The simple step to create the model is to take advantage of Rails generators for this.

    $ bin/rails g model todo name
    invoke  active_record
          create    db/migrate/20191219201444_create_todos.rb
          create    app/models/todo.rb
          invoke    test_unit
          create      test/models/todo_test.rb
          create      test/fixtures/todos.yml

A few files were created along with our model. For now, focus on **db/migrate/20191219201444_create_todos.rb** file; it is a database migration. Every time a database migration is created, you need to sure that it has database constraints required for a model; in this case, the name can not be **null**.

    class CreateTodos < ActiveRecord::Migration[6.0]
      def change
        create_table :todos do |t|
          t.string :name, null: false

          t.timestamps
        end
      end
    end

With changes in place, it is time to migrate the database.

    $ bin/rails db:migrate

In the Ruby world, it is common to write automated tests, so why not write a few for the `Todo` model. Open the test file **test/models/todo_test.rb** and add the following tests.

    require "test_helper"

    class TodoTest < ActiveSupport::TestCase
      test "is valid" do
        subject = Todo.new todo_params

        assert subject.valid?
      end

      test "is invalid" do
        subject = Todo.new todo_params(name: "")

        refute subject.valid?
        refute_empty subject.errors[:name]
      end

      def todo_params(attributes = {})
        {name: "Test todo"}.merge(attributes)
      end
    end

The tests are simple; they make sure the mode model is valid when all attributes meet requirements and invalid when not. To run the tests execute the following command.

    $ bin/rails test
    # Running:

    F

    Failure:
    TodoTest#test_is_invalid [/Users/marioch/Development/personal/frontend/test/models/todo_test.rb:13]:
    Expected true to not be truthy.


    rails test test/models/todo_test.rb:10

    .

    Finished in 0.194414s, 10.2873 runs/s, 10.2873 assertions/s.
    2 runs, 2 assertions, 1 failures, 0 errors, 0 skips

The runner reports failed tests; it is expected because the model under test is not validating any attributes requirements. The fix is straightforward, open the file **app/models/todo.rb** and add the following validations.

    class Todo < ApplicationRecord
      validates :name, presence: true
    end

Rerun the tests after the change, and now the runner reports that everything is ok.

    $ bin/rails test
    # Running:

    ..

    Finished in 0.116393s, 17.1832 runs/s, 34.3663 assertions/s.
    2 runs, 4 assertions, 0 failures, 0 errors, 0 skips

The last part of the Backend needs a controller, the `TodosController`. This time the controller will be created manually and not with the help of Rails generators, it must have three actions **Index**, **Create**, and **Destroy**.

Let us start with the routes of the application, open the file **config/routes.rb**, and add the following rules for `TodosController` actions.

    Rails.application.routes.draw do
      resources :todos, only: [:index, :create, :destroy]

      root to: "todos#index"
    end

Since automated tests are being written for this project, test data is required for us to write `TodosController` tests. A fixture is just that, test data available in tests only. To add a To Do fixture, open the file **test/fixtures/todos.yml** and add the following record, simple, right?

    todo:
      name: "Fixture todo"

Now create the file **test/controllers/todos_controller_test.rb**, this file is used to write tests for `TodosController`. It is important to notice that tests for controllers only cares about the input and the response, nothing else.

    require "test_helper"

    class TodosControllerTest < ActionDispatch::IntegrationTest
      test "GET /todos" do
        get todos_path

        assert_response :success
      end

      test "POST /todos (success)" do
        post todos_path, params: {todo: {name: "Test todo"}}, as: :json

        assert_response :created

        json_response = JSON.parse(response.body, symbolize_names: true)
        assert json_response.dig(:id).present?
        assert json_response.dig(:html).present?
      end

      test "POST /todos (failure)" do
        post todos_path, params: {todo: {name: ""}}, as: :json

        assert_response :unprocessable_entity

        json_response = JSON.parse(response.body, symbolize_names: true)
        assert json_response.dig(:errors, :name).present?
      end

      test "DELETE /todos/:id" do
        todo = todos(:todo)
        delete todo_path(todo), as: :json

        assert_response :no_content
      end
    end

A run on the tests report all controller tests with an error; it is because the `TodosController` does not exist.

    $ bin/rails test
    # Running:

    E

    Error:
    TodosControllerTest#test_POST_/todos_(failure):
    ActionController::RoutingError: uninitialized constant TodosController
    Did you mean?  TodosControllerTest
        test/controllers/todos_controller_test.rb:20:in `block in <class:TodosControllerTest>'


    rails test test/controllers/todos_controller_test.rb:19

    ...

    E

    Error:
    TodosControllerTest#test_GET_/todos:
    ActionController::RoutingError: uninitialized constant TodosController
    Did you mean?  TodosControllerTest
        test/controllers/todos_controller_test.rb:5:in `block in <class:TodosControllerTest>'
    .

It is time to add the `TodosController`. Create a file **app/controllers/todos_controller.rb** and add the code for all actions. Notice that Index action responds with HTML, Create with a JSON response, and Destroy with no content.

    class TodosController < ApplicationController
      def index
        @todos = Todo.order(created_at: :desc)
        @todo = Todo.new
      end

      def create
        todo = Todo.new(todo_params)

        if todo.save
          todo_html = render_to_string(partial: "todos/todo", locals: {todo: todo}, formats: [:html])
          return render(json: {id: todo.id, html: todo_html}, status: :created)
        end

        render json: {errors: todo.errors.to_h}, status: :unprocessable_entity
      end

      def destroy
        todo = Todo.find_by(id: params[:id])
        todo.destroy

        render plain: "", status: :no_content
      end

      private

      def todo_params
        params.require(:todo).permit(:name)
      end
    end

Let us try the tests again; much better, everything is green except for one test. The failing test indicates that Index action could not found an HTML template to render; it is ok for now; this template is added in the next section.

    $ bin/rails test

    # Running:

    E

    Error:
    TodosControllerTest#test_GET_/todos:
    ActionController::MissingExactTemplate: TodosController#index is missing a template for request formats: text/html
        test/controllers/todos_controller_test.rb:5:in `block in <class:TodosControllerTest>'


    rails test test/controllers/todos_controller_test.rb:4

    ......


## The Frontend side

The project is ready for us to work on the frontend. Since it uses Webpack, it is the right time to start the Webpack server and the Rails server; each one needs to run in its terminal session.

    $ bin/webpack-dev-server
    ----
    $ bin/rails s -p 3400

From the original [React project](https://github.com/sunil-sandhu/react-todo-2019){:target="_blank"}, a few assets will be reused. To start, copy the contents of **App.css**, **components/ToDo.css**, and **components/ToDoItem.css** into a single file in our project, this file is **app/javascript/stylesheets/application.scss**.

**rails-ujs** library is a Javascript library from Rails that helps in what Rails community calls "Unobtrusive Javascript", it makes Ajax call made by Rails helpers transparent. To install it, use **Yarn**.

    $ bin/yarn add @rails-ujs

Also, a new logo for this project must be placed at **app/javascript/images** and imported along with the **application.scss** file into the **app/javascript/packs/application.js** for Webpack to manage those files for us. Here also **rails-ujs** gets initialized.

    require("@rails/ujs").start()

    import "../stylesheets/application.scss"
    import "../images/logo.png"

    import "controllers"

For Rails to use the bundle files from Webpack, the Rails application HTML layout needs to be updated to use Webpack's files. Open the file **app/views/layout/application.html.erb** and add the Webpack helpers to it.

    <!DOCTYPE html>
    <html>
      <head>
        <title>Rails To Do</title>
        <%= csrf_meta_tags %>
        <%= csp_meta_tag %>

        <%= javascript_pack_tag "application" %>
        <%= stylesheet_pack_tag "application" %>

      </head>

      <body>
        <%= yield %>
      </body>
    </html>

From the React components, **ToDoItem.js** and **ToDo.js** let us copy the HTML template part into two Rails template **app/views/todos/_todo.html.erb** and **app/views/todos/index.html.erb** respectively but with few modifications. First, the React specific code must be replaced with Rails code.

    <div class="ToDoItem" data-controller="todo-delete" data-target="todo-delete.item">
      <p class="ToDoItem-Text"><%= todo.name %></p>
      <%= button_to "-", todo_path(todo.id),
          method: :delete,
          remote: true,
          form: { data: { action: "ajax:success->todo-delete#successResult ajax:error->todo-delete#errorResult" } },
          class: "ToDoItem-Delete"
         %>
    </div>

StimulusJS will use those attributes to interact and connect with the HTML DOM.

`data-controller` tells StimulusJS, which Javascript component (controller) to activate when that attribute is present in the DOM. `data-target` is a way to reference DOM nodes inside the StimulusJS controller, and `data-action` is the way to dispatch DOM events to the StimulusJS controller.

Right now, without a StimulusJS controller, those data attributes are kind of useless, but we are planning for the time when the controllers are in place.

Now let us do the same for React component `ToDo.js`, the HTML template code needs to be copied to **/app/views/todos/index.html.erb**, here is the modified version of it.

    <div class="ToDo">
      <%= image_tag asset_pack_path("media/images/logo.png"), class: "Logo", alt: "Rails logo" %>
      <h1 class="ToDo-Header">Rails To Do</h1>
      <div class="ToDo-Container" data-controller="todo">
        <div class="ToDo-Content" data-target="todo.todos">
          <%= render @todos %>
        </div>

        <div class="ToDoInput">
          <%= form_with model: @todo, local: false,
            data: { action: "ajax:beforeSend->todo#validateSubmit ajax:error->todo#errorResult ajax:success->todo#successResult" } do |form| %>
            <%= form.text_field :name, data: { target: "todo.field" } %>
            <%= form.submit "+", class: "ToDo-Add" %>
          <% end %>
        </div>
      </div>
    </div>

Before we continue, let us make a little detour here. Remember the failing test for `TodosController` due to a missing template? The template is now in place, so the test should not be failing anymore, rerun the tests and see it by yourself.

    $ bin/rails test

    # Running:

    ........

    Finished in 0.355593s, 22.4976 runs/s, 36.5586 assertions/s.
    8 runs, 11 assertions, 0 failures, 0 errors, 0 skips

It is time to add Javascript to the project. Let us start with the controller that helps to delete a To Do item. The file is **app/javascript/controllers/todo_delete_controller.js**

    import { Controller } from "stimulus"

    export default class extends Controller {
      static targets = ["item"]

      errorResult(event) {
        console.log(event.detail)
      }

      successResult(event) {
        event.preventDefault()
        this.itemTarget.remove()
      }
    }

The next controller is the one that takes care of adding new To Do item. The file is **app/javascript/controllers/todo_controller.js**

    import { Controller } from "stimulus"

    export default class extends Controller {
      static targets = ["todos", "field"]

      errorResult(event) {
        console.log("error", event.detail)
      }

      successResult(event) {
        const response = event.detail[0]
        const todoHTML = document.createRange().createContextualFragment(response.html)

        this.todosTarget.prepend(todoHTML)
        this.fieldTarget.value = ""
      }

      validateSubmit(event) {
        if (this.fieldTarget.value === "") {
          event.preventDefault()
        }
      }
    }

It has two functions, `validatesSubmit`, which is called on form submit, and validates the input to now allow empty To Do. The second one, `successResult` is called after the Ajax request is made, and it takes care to place the To Do HTML fragment in the DOM. The HTML To Do fragment is part of the server response.

The project is done. If you want to try it out, add a couple of seed records into **db/seeds.rb** file.

    Todo.create(name: "clean the house")
    Todo.create(name: "buy milk")

And seed the database with the following command.

    $ bin/rails db:seed

Now point your browser to [http://localhost:3400](http://localhost:3400/){:target="_blank"} and try the application.
<div class="blog-media">
  <img width="1200" height="800" src="{{ '/assets/img/rails-todo.png' | relative_url }}"
  class="attachment-orio-thumb-big size-orio-thumb-big wp-post-image" alt="Rails To Do"
  srcset="{{ 'rails-todo.png' | srcset }}" sizes="(max-width: 1200px) 100vw, 1200px" />
</div>

The application is similar in terms of UI interaction, but in addition, it has a Backend that is not present in the original React application. It also has automated tests for models and controllers, and we can do a little better by adding a System Test. This kind of test automates the browser to "use" the application in specific scenarios.

To add a System test, create the file **test/system/todos_test.rb** and add the following content.

    require "application_system_test_case"

    class TodosTest < ApplicationSystemTestCase
      test "visit todos" do
        todos_count = Todo.count
        visit root_url

        assert_selector "h1", text: "Rails To Do".upcase
        assert_selector ".ToDoItem", count: todos_count
      end

      test "try to add an empty todo" do
        todos_count = Todo.count
        visit root_url

        fill_in "todo_name", with: ""
        click_button "+"

        assert_selector ".ToDoItem", count: todos_count
      end

      test "add a todo" do
        todo = "Add Tests"
        todos_count = Todo.count
        visit root_url

        fill_in "todo_name", with: todo
        click_button "+"

        assert_selector ".ToDoItem", count: todos_count + 1
        assert_selector ".ToDoItem", text: todo
      end

      test "delete a todo" do
        todo = todos(:todo)
        todos_count = Todo.count

        visit root_url
        todo_element = page.find ".ToDoItem", text: todo.name
        remove_button = todo_element.find ".ToDoItem-Delete"
        remove_button.click

        assert_selector ".ToDoItem", count: todos_count - 1
        refute_selector ".ToDoItem", text: todo.name
      end
    end

To run the System test, you need to have the Chrome browser installed. Run the test using the following command.

    $ bin/rails test:system

    # Running:

    Capybara starting Puma...
    * Version 4.3.1 , codename: Mysterious Traveller
    * Min threads: 0, max threads: 4
    * Listening on tcp://127.0.0.1:51968
    Capybara starting Puma...
    * Version 4.3.1 , codename: Mysterious Traveller
    * Min threads: 0, max threads: 4
    * Listening on tcp://127.0.0.1:51971
    ....

    Finished in 5.133107s, 0.7793 runs/s, 1.3637 assertions/s.
    4 runs, 7 assertions, 0 failures, 0 errors, 0 skips

## Final words

What I would like you to take from replicating this example is that sometimes there is no need to go all the way in with a separated frontend like React, Vue, or Svelte.

By using the HTML standard, the maturity of your framework, and a tool like StimulusJS you can archive the same "snappy" functionality without the mess of Javascript code from the time before frameworks.

Both libraries, rails-ujs and StimulusJS were developed within the Rails community, but the truth is that they do not depend on Rails, both can be used with any other backend/HTML template system.

You can find the sample code at [https://github.com/mariochavez/rails-todo-2019](https://github.com/mariochavez/rails-todo-2019){:target="_blank"}
