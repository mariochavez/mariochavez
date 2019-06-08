module Jekyll
  module ResponsiveImage
    SIZES = [1200, 300, 768, 1024, 180, 940, 320, 640, 960]
    SMALL_SIZES = [1200, 960, 640]
    RELATIVE_URL = "/assets/img/"

    def srcset(image)
      SIZES.map do |size|
        prefix = size != 1200 ? "#{size}-" : ""
        "#{relative_url(RELATIVE_URL)}#{prefix}#{image} #{size}w"
      end.join(", ")
    end

    def srcset_small(image)
      SMALL_SIZES.map do |size|
        prefix = size != 1200 ? "#{size}-" : ""
        "#{relative_url(RELATIVE_URL)}#{prefix}#{image} #{size}w"
      end.join(", ")
    end
  end
end

Liquid::Template.register_filter(Jekyll::ResponsiveImage)
