---
layout: post
title: Ruby Next to keep compatibility with older Rubies
date: 2023-05-15 12:00:00 -0600
published: Mayo 19, 2023
categories: desarrollo
description: Ruby Next is a nice tool for those that enjoy working with newer Ruby versions but needs to keep compatibility with older Rubies.
keywords: llm, openai, chatgpt, code generation, chroma, vector database, embeddings, ruby, next, compatibility
image: /images/ruby_next/ruby_next.jpg
lang: en_US
---

Today I have released a new version of the [chroma-db](https://rubygems.org/gems/chroma-db){:target="_blank"} gem, version 0.3.0.

It was motivated due to an issue in the repository about [Data not being available](https://github.com/mariochavez/chroma/issues/8){:target="_blank} and the ask to relax the Ruby version requirement, which was 3.2.

When I wrote the library, I used the syntax from Ruby 3.2 so having it to work with earlier versions required a rewrite to make it compatible. I was not amused by having to rewrite parts of the gem, luckily I remembered seen [Ruby Next](https://github.com/ruby-next/ruby-next){:target="_blank"} a while ago from Evil Martians. So, I went to give it a try.

Ruby Next is a transpiler for the Ruby language. It can take a Ruby file using newer syntax and automatically generate one or more files that are compatible with earlier versions of Ruby. Since I was looking to be compatible down to Ruby 2.6, Ruby Next generated files for 2.6 and 3.1 version. These files cover all syntax changes in between Ruby versions.

Having the transpiled versions, Ruby Next takes care of loading the correct file depending on your Ruby version and replacing the original code using a Ruby [refinement](https://rubyapi.org/3.2/o/refinement){:target="_blank"}.

This sounded promising for my case with this gem. I focused on the section called "Integrating into a gem development" section of the README file.

First, the dependencies were added to the gemspec file of chroma-db.

```
if ENV["RELEASING_GEM"].nil? && File.directory?(File.join(__dir__, ".git"))
    spec.add_runtime_dependency "ruby-next", ">= 0.15.0"
  else
    spec.add_dependency "ruby-next-core", ">= 0.15.0"
  end

  spec.add_development_dependency "ruby-next", ">= 0.15.0"
```
Also, I make sure that generated files are packed into the gem but ignored by git.

```ruby
spec.files = Dir.chdir(__dir__) do
    `git ls-files -z`.split("\x0").reject do |f|
      (File.expand_path(f) == __FILE__) || f.start_with?(*%w[bin/ test/ spec/ features/ notebook/ .git .circleci appveyor .standard.yml .rubocop.yml .solargraph.yml])
end + Dir.glob("lib/.rbnext/**/*")
   
```

Next, I changed the entry point  `lib/chroma-db.rb` of the gem to load Ruby Next and to set up the loading of transpiled files accordingly to the Ruby version at runtime.

```ruby
require "ruby-next"
require "ruby-next/language/setup"
RubyNext::Language.setup_gem_load_path(transpile: true)
```
**Note: This needs to happen before you require your gem files. Also, this gem does not work with `requiere_relative`, so you need to use `require` instead.**

Now to every file that uses the new Ruby's syntax, I added the line to load the refinement.

```ruby
using RubyNext
```

At this point, the gem is almost ready to become compatible with earlier versions of Ruby, but first you have to generate the transpiled Ruby code. I opened the `Rakefile` and added a task for this:

```ruby
desc "Run Ruby Next nextify"
task :nextify do
  sh "bundle exec ruby-next nextify -V"
end
```

Also, I created a _rc_ file called `.rbnextrc` to configure Ruby Next.

```yaml
nextify: |
  ./lib
  --min-version=2.6
  --edge
  --proposed
```

Running the rake task `rake nextify` generates the transpiled version of our code into `lib/.rbnext` folder. It contains folders for different versions of Ruby and replicated inside the folder structure of our gem files that needs transpilation to become compatible. Don't forget to add to your `.gitgnore` file, the `lib/.rbnext` folder.

The final changes are related to being able to run your test suite with different Rubies. Open the `test_helper.rb` or `spec_helper.rb` and the following code just before the helper loads your gems files.

```ruby
ENV["RUBY_NEXT_TRANSPILE_MODE"] = "rewrite"
ENV["RUBY_NEXT_EDGE"] = "1"
ENV["RUBY_NEXT_PROPOSED"] = "1"
require "ruby-next/language/runtime" unless ENV["CI"]
```
Make sure that you can run your tests locally. To be 100% sure that your gem is now compatible with other Rubies, run your CI with a matrix of Ruby versions and be sure that `CI=true` environment variable is set and also that the rake task to generate the transpiled code runs before your tests.

In the case of chroma-db I was using Ruby's 3.2 [Data](https://rubyapi.org/3.2/o/s?q=Data){:target="_blank"} class which is not supported by Ruby Next at this time, so I had to make a manual change to use a [Struct](https://rubyapi.org/3.2/o/struct){:target="_blank"} instead.

Overall, I'm happy that Ruby Next worked for me on this gem, this means that I can be used with earlier versions of Ruby for those that can't use the latest version, but also I keep the joy of using newer syntax.

By the way, the issue was reported by the team working on [langchainrb](https://github.com/andreibondarev/langchainrb){:target="_blank"}


