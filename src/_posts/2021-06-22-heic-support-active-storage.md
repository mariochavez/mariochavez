---
layout: post
title: HEIC support for Active Storage
date: 2021-06-22 01:00:00 -0600
published: Junio 22, 2021
categories: desarrollo
description: Apple's HEIC format is not supported out of the box on Active Storage
keywords: rails, ruby, active storage, files, images, imagemagick, heic
image: /images/heic/iphone.jpg
---
Active Storage is the Ruby on Rails solution to work with file attachments on an application. It is not the only solution available, but it comes by default as part of the framework, so there is a chance that it is used on new projects.

Working with images is as easy as possible; creating variants to display images in different sizes might be the most common use case in a Rails Application. The [image_processing](https://github.com/janko/image_processing){:target="_blank"} gem is responsible for abstracting the complexity of creating an image variant, like resizing the image to be 300px on the longest side.

Underneath the image_processing gem, it uses [ImageMagick](https://imagemagick.org/script/index.php){:target="_blank"} or [Vips](https://libvips.github.io/libvips/){:target="_blank"} to handle image operations and transformations; by default, it uses the first, ImageMagick..

## HEIF and HEIC image formats.

High Efficiency Image File format or HEIF is a container for images and videos that requires half of the storage as JPEG with the same image quality. The HEIC format, which is a variation of HIEF and stands for High Efficiency Image Container, was introduced by Apple with the release of iOS 11 and macOS High Sierra The format is not widely adopted. For example, no browser can display a HEIC image, and only a few Android devices support it.to optimize the space of Apple’s devices.

The format is not widely adopted. For example, no browser can display a HEIC image, and only a few Android devices support it.

There is a [case where High School students failed a test](https://www.theverge.com/2020/5/20/21262302/ap-test-fail-iphone-photos-glitch-email-college-board-jpeg-heic){:target="_blank"} because their school systems didn’t support the HEIC format.

## Add Active Storage support for HEIC.

At [Creditar.io](https://creditar.io){:target="_blank"}, we are working on a service that allows customers to upload a photo of a Mexican ID, then the service validates the ID extracts its information. Everything was fine until we received our first HEIC file; our service could not do anything with the file.

A quick [DuckDuckGo](https://duckduckgo.com/){:target="_blank"} search about this told me what I already knew, no support out of the box for HEIC on Active Storage. Some work needs to be done to enable it. I came across this post, “[How to generate HEIC previews in Rails using ActiveStorage](https://hashtagjohnt.com/how-to-generage-heic-previews-in-rails-using-activestorage.html){:target="_blank"}”.

The post explains how to create an Active Storage Previewer that converts a HEIC image into a PNG or any other format. It uses Vips as image processing library and describes how to enable Vips support on Heroku.

ImageMagick is used at [Creditar.io](https://creditar.io){:target="_blank"}, and I didn’t want to switch to Vips. With the latest versions of ImageMagick, it can be compiled with HEIC support. If you are on macOS and use Homebrew to install dependencies, version 7.x comes with support for HEIC.

The changes in the previewer to work with ImageMagick are very simple.

```ruby
# app/previewers/heic_previewer.rb

class HeicPreviewer < ActiveStorage::Previewer
  CONTENT_TYPE = "image/heic"

  class << self
    def accept?(blob)
      blob.content_type == CONTENT_TYPE && minimagick_exists?
    end

    def minimagick_exists?
      return @minimagick_exists unless @minimagick_exists.blank?

      @minimagick_exists = defined?(ImageProcessing::MiniMagick)
      Rails.logger.error "#{self.class} :: MiniMagick is not installed" unless @minimagick_exists

      @minimagick_exists
    end
  end

  def preview(transformations)
    download_blob_to_tempfile do |input|
      io = ImageProcessing::MiniMagick.source(input).convert("png").call
      yield io: io, filename: "#{blob.filename.base}.png", content_type: "image/png"
    end
  end
end
```

The previewer needs to be registered with Active Storage via an initializer.

```ruby
# config/initializers/active_storage.rb
Rails.application.configure do
  config.active_storage.previewers << HeicPreviewer
  config.active_storage.variable_content_types << "image/heic"
  config.active_storage.variable_content_types << "image/heif"
end
```

And we must tell Active Storage that HEIC/HEIF content types are supported. The test for this previewer is as follows.

```ruby
# test/previewers/heic_previewer_test.rb
require "test_helper"

class HeicPreviewerTest < ActiveSupport::TestCase
  include ActiveStorageBlob

  CONTENT_TYPE = "image/heic"

  test "it previews a heic image" do
    skip "it does not run on CI due to missing support for HEIC" if ENV["CI"] == "true"

    blob = create_file_blob(filename: "heic-image-file.heic", content_type: CONTENT_TYPE)

    refute_nil blob
    assert HeicPreviewer.accept?(blob)

    HeicPreviewer.new(blob).preview({}) do |attachable|
      assert_equal "image/png", attachable[:content_type]
    end
  end
end
```

The `create_file_blog` method is a helper that I use to create an Active Storage blob object from a file. The test is simple; it tests that previewing or downloading a file get converted to PNG.

Running this test on GitHub’s CI was impossible because the ImageMagick version it provides comes without HEIC support. I tried to download and compile ImageMagick in the pipeline, but it takes too much time, so I decided to skip this test there. It works on my machine(tm), so what can go wrong, right?

To deploy these changes, Heroku needs a buildpack with an ImageMagick binary compiled with HEIC. There are a few of those in Heroku's marketplace, so I settle for [this one](https://elements.heroku.com/buildpacks/himamainc/heroku-buildpack-imagemagick-heif){:target="_blank"}. It needs to be installed before deploying the code changes. Installation is simple.

```ruby
$ heroku buildpacks:add [https://github.com/HiMamaInc/heroku-buildpack-imagemagick-heif](https://github.com/HiMamaInc/heroku-buildpack-imagemagick-heif) --index 1
```

After these changes in the code, customers can take a picture with their iPhone and send it to our service to validate their ID, no need to worry if they had HEIC enable on their phones. The service displays the thumbnail and sends a png version to the Python ML backend to be processed.
