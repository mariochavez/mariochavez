module Jekyll
  module RandomColor
    def color(input)
      random = ["#000000", "#673c34", "#d59682", "#bababa", "#e8c0ce", "#2228bb"].sample
      "#{input} #{random}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomColor)
