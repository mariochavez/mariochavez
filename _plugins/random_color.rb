module Jekyll
  module RandomColor
    def color
      ["#000000", "#673c34", "#d59682", "#e5e5e5", "#2228bb"].sample
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomColor)
