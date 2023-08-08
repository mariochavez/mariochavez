---
layout: post
title: Maquina, the engine for Rails
date: 2023-08-08 00:00:00 -0600
published: Agosto 8, 2023
categories: desarrollo
description:  Maquina, Ruby on Rails engine for rapid modern web development.
keywords: ruby on rails, development, web applications, ruby
image: /images/maquina/maquina.jpg
lang: en
---

I have been working with Ruby on Rails since 2009, providing software development or consulting to companies with diverse needs. Some of those companies were startups with greenfield projects, and others were companies that needed help with brownfield projects. Over this time, I have also had the opportunity to train people for those companies or the consulting firms where I worked.

Since I discovered Ruby on Rails in 2008, I have been impressed not with what it has to offer but with what prevented me from making a decision. Some people call this "magic", but it is not magic at all. After all, you can always go to the source and learn what is going on.

Working on as many Ruby on Rails projects as I have, I started to see almost every project repeating things that need to be implemented—authentication flow, authorization, preferences or profile sections, templates for transactional emails, etc.

A few years ago, I started to extract this repetitive work into a reusable Rails Engine, looking for a way to drop the engine into an application and, with little effort, have all that functionality ready to use.

Also, I noticed that many Rails controllers were pretty simple. They conform to the Restful definition and operate on one resource. Being inspired by José Valim's inherited_resources and responders gems, the engine has a Resourceful module that you include in a controller, and it implements all the seven Restful actions with the proper format response and flash messages.

<div class="w-full">
  <figure>
    <img src="/images/maquina/maquina-1.png" class="m-auto" style="width: 640px" alt="Maquina" />
    <figcaption class="text-center">Index page for a Rails application using Maquina. Search and pagination. Phlex component renders the table.</figcaption>
  </figure>
</div>

The engine also uses Ruby on Rails view inheritance to provide default views for index, new, and edit actions. If you need a different view, it is as easy as adding your view and avoiding the inheritance.

Over the years, I extracted common functionality into this engine from real-life applications. I used this engine to create new applications where my only focus was to code the business functionality.

<div class="w-full">
  <figure>
    <img src="/images/maquina/maquina-2.png" class="m-auto" style="width: 640px" alt="Maquina" />
    <figcaption class="text-center">Rails form rendered with Phlex and TailwindCSS.</figcaption>
  </figure>
</div>

Then a couple of years ago, I discovered TailwindCSS and Rails got Hotwire and Stimulus; this got me into migrating patterns to use frames and specialized Stimulus controllers to continue using the library with modern Web applications. This is the way I used to build a few applications at my latest startup.


```ruby
# frozen_string_literal: true

class VideosController < Maquina::ApplicationController
  before_action :authenticate!

  resourceful(
    resource_class: Video,
    form_attributes: [
      {title: {
        type: :input, 
        control_html: {class: "col-span-1 sm:col-span-6"}, 
        input_html: {class: "w-full input"}}},
      {image: {
        type: :file, 
        control_html: {data: {file_max_size_value: 5_242_880}, class: "col-span-1 sm:col-span-6 file"}, 
        input_html: {direct_upload: true, accept: "image/png,image/jpeg,image/jpg"}}},
      {permalink: {
        type: :input, 
        control_html: {class: "col-span-1 sm:col-span-6"}, 
        input_html: {class: "w-full input"}}},
      {serie_id: {
        type: :select, 
        control_html: {class: "col-span-1 sm:col-span-6"}, 
        input_html: {values: :load_series, class: "select w-full sm:w-1/2"}}},
      {public: {
        type: :checkbox, 
        control_html: {class: "relative flex gap-x-3 col-span-1 sm:col-span-6"}, 
        input_html: {class: "checkbox"}}},
      {tags_text: {
        type: :input, 
        control_html: {class: "col-span-1 sm:col-span-6"}, 
        input_html: {class: "input w-full sm:w-1/2"}}},
      {video_url: {
        type: :input, 
        control_html: {class: "col-span-1 sm:col-span-6"}, 
        input_html: {class: "input w-full"}}},
      {content: {
        type: :action_text, 
        control_html: {data: {controller: "trix-extensions"}, class: "col-span-1 sm:col-span-6"}, 
        input_html: {class: "action-text h-[80vh] lg:h-[60vh]"}}}],
    list_attributes: [:title, :public, :tags_text, :created_at],
    policy_class: VideoPolicy
  )

  private

  def load_series
    Serie.all.pluck(:name, :id)
  end

  # Only allow list of trusted parameters through.
  def secure_params
    params.require(:video).permit(form_attributes.keys)
  end
end
```
<p class="m-0 text-gray-500 text-center">Sample Rails controller using the resourceful module</p>

Earlier this year, I created a new Rails Engine using the previous knowledge but with a blank slate to clean up the code, take advantage of Hotwire and Stimulus and write most of the UI code with components using Phlex. This is how Maquina was born.

<div class="embed-container">
  <iframe src="https://player.vimeo.com/video/852754826" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>

The progress is still going on with the new engine, but I got to the point where I'm starting a new application using it. Once all functionality is migrated from the old engine, Maquina will have the following:

- Multitenant support with a relationship of organization - membership - user. Where an organization may have a plan, think about building apps with multiple payment tiers.
- Authentication system using Rails has_password with password recovery, password expiration and prevention of password reusing for a user, block and unblock accounts, and user invitation.
- Default email setup and template for transactional emails.
- Authorization with ActionPolicy.
- Settings and profile section for users or organization configuration.
- All text the application uses comes from i18n files organized by models, views, forms, and flashes.
- Form building using components with Phlex. It uses Tailwind CSS for styling with color variables to set the theme.
- Hotwire patterns for form validations, page fragment updates, popup modals, and in-app notifications. Many of these with complementary Stimulus controllers.

Maquina will provide almost everything for a quick start on a new Rails application. It also has the flexibility that if you need to override functionality, you will be free to do it, and if you need to work outside the engine defaults, you can do it. Everything is just Ruby and Ruby on Rails code.

In a further blog post, I'll discuss what it means for a controller to include the Resourceful module and the code availability of Maquina.
