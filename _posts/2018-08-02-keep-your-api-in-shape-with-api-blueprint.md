---
layout: orio-post
title: "Keep your API in shape with API Blueprint"
date: 2018-08-02 12:00:00 -0600
published: Auguts 2, 2018
categories: desarrollo
description: When you start a new API project with Rails, your first question might be, *"should I do it using GraphQL or go with good old REST API?"*
image: api-documentation.jpg
keywords: english, development, rails, javascript, rest, api, testing, minitest
author: Mario Alberto Chávez
---
# Keep your API in shape with API Blueprint

When you start a new API project with Rails, your first question might be, *"should I do it using GraphQL or go with good old REST API?"*

After much consideration, if you decide to go with a REST API, continue reading this post.

Now, before you begin to consider how to implement your API, your primary concern should be how to keep your API documentation up to date.

It is not an easy task for the development team to keep code in sync with documentation without going thru many hoops.

At a recent project, I was looking for a solution that could easily integrate with Rails and, at the same time, allows the team to document the API definition without considerations about the implementation details.

The first tool that I found was the [rspec_api_documentation](https://github.com/zipmark/rspec_api_documentation){:target="_blank"} gem, but it was incompatible with our project for two reasons: We use Minitest, and it requires you to write Specs with Ruby code to describe the API.

Then I remember that in a project for one of our clients at [michelada](http://michelada.io/){:target="_blank"}, Apiary was used as a communication tool to describe the API with the team.

# API Blueprint

<div class="blog-media">
  <img width="1200" height="800" src="{{ '/assets/img/api-documentation-2.png' | relative_url }}"
  class="attachment-orio-thumb-big size-orio-thumb-big wp-post-image" alt="API Blueprint"
  srcset="{{ 'api-documentation-2.png' | srcset }}" sizes="(max-width: 1200px) 100vw, 1200px" />
</div>

Apiary has an Open Source format called [API Blueprint](https://apiblueprint.org/){:target="_blank"}. It is a specification on top of Markdown that helps to describe a web API. This format focuses on creating documentation.

    FORMAT: 1A
    HOST: http://polls.apiblueprint.org/
    # Sample API
    Polls is a simple API allowing consumers to view polls and vote in them.
    ## Questions Collection [/questions]
    ### List All Questions [GET]
    + Response 200 (application/json)
            [
                {
                    "question": "Favourite programming language?",
                    "published_at": "2015-08-05T08:40:51.620Z",
                    "choices": [
                        {
                            "choice": "Swift",
                            "votes": 2048
                        }, {
                            "choice": "Python",
                            "votes": 1024
                        }, {
                            "choice": "Objective-C",
                            "votes": 512
                        }, {
                            "choice": "Ruby",
                            "votes": 256
                        }
                    ]
                }
            ]

With this [specification](https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md){:target="_blank"}, you can define how the API receives a request and what to expect as a response. The following example shows how Markdown and a special syntax [MSON](https://github.com/apiaryio/mson){:target="_blank"} works together to document an API endpoint. No implementation details are present.

**MSON** syntax allows you to describe **JSON** objects easily no matter how complicated your **JSON** object is. An object structure with **MSON** like the following:

    - address
        - street
        - city
        - state

Produces a **JSON** object like:

    {
        "address" : {
            "street": "",
            "city": "",
            "state": ""
        }
    }

The format is relatively simple to get up to speed quickly and write a complete set of API documentation. With the API Blueprint format is also possible to generate **JSON** Schema draft 4 from it. The schemas are useful to validate your API using Minitest.

# Generate good-looking documentation.

Let’s start with the low hang fruit of using API Blueprint to document our API. Here is the documentation for two API endpoints; they are our example for the rest of this post.

The API is simple, but it shows some benefits of **MSON** syntax, like the ability to reuse data structures. It also shows how to document a response that can have many different statuses.

[Aglio](https://github.com/danielgtaylor/aglio){:target="_blank"} is a tool that uses the API Blueprint format to render good-looking documentation from it. It has a few available themes that you can choose from, or even better; you can write your own.

In a Rails application, to install aglio use **Yarn**.

    $ bin/yarn add aglio

Aglio command needs at least two parameters, the input, where is the documentation file written with API Blueprint, and the output file for the HTML documentation.

    $ bin/yarn run aglio -i docs/api/documentation.md -o public/documentation.html

It produces the HTML documentation with aglio’s default theme. You can pass a set of --theme flags to choose a theme, color scheme, layout, and a few things more, check aglio’s documentation for details.

Start your Rails server and point your browser to **http://localhost:3000/documentation.html**. There you have a nicely documented API.

<div class="blog-media">
  <img width="1200" height="800" src="{{ '/assets/img/api-documentation-1.png' | relative_url }}"
  class="attachment-orio-thumb-big size-orio-thumb-big wp-post-image" alt="API Documentation"
  srcset="{{ 'api-documentation-1.png' | srcset }}" sizes="(max-width: 1200px) 100vw, 1200px" />
</div>

It is handy to have a rake task to refresh the HTML documentation anytime with the command **bin/rails api:documentation**. Create a file **lib/tasks/api.rake** and add the following lines:

    namespace :api do
      desc 'Build API documentation'
      task :documentation do
        input_file = 'docs/api/documentation.md'
        output_file = 'public/documentation.html'
        system(" bin/yarn run aglio -i #{input_file}  -o #{output_file}")
      end
    end

# Generating JSON Schemas

Now that you have nice looking documentation, it is time to generate [JSON Schemas](https://spacetelescope.github.io/understanding-json-schema/){:target="_blank"} from the same documentation file. The generated files, along with Minitest, help us to automate the verification that the server requests/response work as expected.

To generate the schema files from the API Blueprint file, we need a tool called [apib2json](https://github.com/o5/apib2json){:target="_blank"}. It produces a single **JSON** file for all schemas present in the documentation, this is fine. Still, for our needs, a single file does not work, so we need an additional step to split this file into multiple files, each one with a single schema representation.

Unfortunately, the way that apib2json works, it does not provide enough metadata to help us identify each generated schema to put it into a file. So you need a custom version of apib2json, which you can find at [https://github.com/mariochavez/apib2json/tree/additional-metadata](https://github.com/mariochavez/apib2json/tree/additional-metadata){:target="_blank"}.

To install it, use **Yarn**.

    $ bin/yarn add "https://github.com/mariochavez/apib2json.git#additional-metadata"

Then execute it to generate a single schema file. The command needs an input, which is the API Blueprint file, and an output file for the **JSON** schemas; the `--pretty` flag is for us to get a human-readable file.

    $ bin/yarn run apib2json --pretty -i docs/api/documentation.md  -o test/support/schemas/schemas.json

    {
      "[GET]/users{?cursor}": [
        {
          "meta": {
            "type": "response",
            "title": ""
          },
          "schema": {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
              "data": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "email": {
                      "type": "string",
                      "description": "User's email."
    ...

With the help of a second rake task, the generated file is divided into multiple files; each file will contain one request with a single response. A file **GET-Users-200.json** contains a request with a GET to Users endpoint with a 200 status response.

Create the file **lib/tasks/api.rake** and add the following code.

    desc "Generate JSON schemas"
      task :schemas do
        schemas_path = "test/support/schemas"
        input_file = "docs/api/documentation.md"
        output_file = "test/support/schemas/schemas.json"
        puts "Generating api schemas from #{input_file}"
        system("bin/yarn run apib2json --pretty -i #{input_file} -o #{output_file}")
        if File.exist?(output_file)
          file_path = Pathname.new(output_file)
          JSON.parse(file_path.read).each_pair do |group, actions|
            actions.each do |action|
              next if action.dig("meta", "type") != "response"
              verb = group.scan(/\[(.*)\]/).flatten.first
              name = "#{verb}-#{I18n.transliterate(action.dig('meta', 'group'))}(#{action.dig('meta', 'statusCode')})#{action.dig('meta', 'title')&.gsub(/ /, '-')}".
                sub(/\{.*\}/, "").gsub(/\(|\)/, "-").gsub(/^-|-$/, "")
              puts "Writing #{name}"
              File.open("#{schemas_path}/#{name}.json", "w") { |file| file.write(action.dig("schema").to_json) }
            end
          end
        end
        puts "Schemas are ready at #{schemas_path}"
      end

To execute the rake task, run the following command.

    $ bin/rails api:schemas
    Generating api schemas from docs/api/documentation.md
    yarn run v1.7.0
    $ node_modules/.bin/apib2json --pretty -i docs/api/documentation.md -o test/support/schemas/schemas.json
    Done in 0.31s.
    Writing GET-Users-200
    Writing POST-Users-201
    Writing POST-Users-422
    Schemas are ready at test/support/schemas

There you have it, one **JSON** schema file per request/response. The rest is quite simple, add the [json_matchers](https://github.com/thoughtbot/json_matchers){:target="_blank"} gem in your **Gemfile** and configure the **test_helper.rb** to load the gem.

    require 'json_matchers/minitest/assertions'
    JsonMatchers.schema_root = 'test/support/schemas'
    Minitest::Test.send(:include, JsonMatchers::Minitest::Assertions)

Then create an integration test for a `UsersController` and add the following tests. Each test will perform a request to the API and match the response accordingly to what you documented in the API Blueprint file.

    require 'test_helper'
    class UsersApiTest < ActionDispatch::IntegrationTest
      test 'Users List' do
        get '/users', headers: { Accept: 'application/vnd.api-test.v1+json' }
        assert_response :success
        assert_matches_json_schema response, 'GET-Users-200'
      end
      test 'Create new User successfully' do
        post '/users', headers: { Accept: 'application/vnd.api-test.v1+json' }, params: user_payload
        assert_response :created
        assert_matches_json_schema response, 'POST-Users-201'
      end
      test 'Fails to create new User' do
        post '/users', headers: { Accept: 'application/vnd.api-test.v1+json' },
                       params: user_payload(email: nil, first_name: nil)
        assert_response :unprocessable_entity
        assert_matches_json_schema response, 'POST-Users-422'
      end
      def user_payload(attrs = {})
        {
          email: 'user@mail.com',
          first_name: 'Jane',
          last_name: 'Doe'
        }.merge(attrs)
      end
    end

If there is a mismatch between the request and the documented response, the test will fail with detailed information on why the response differs from the **JSON** schema.

    #: failed schema #: "links" wasn't supplied. 
    ---
    expected
    {
    }
    to match schema "POST-Users-201": 
    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
    ...

# Conclusion

Keeping your API documentation and endpoints in sync can be a daunting task; writing schema files by hand are not fun at all, but hopefully, with the tools presented here, it will be easy for you and your team to keep everything up to date.

If you want to check a sample application with everything showed in this post to go [https://gitlab.com/mariochavez/testing-api-blueprint/tree/master](https://gitlab.com/mariochavez/testing-api-blueprint/tree/master){:target="_blank"}.
