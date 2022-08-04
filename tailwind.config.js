module.exports = {
  content: ["./src/**/*.{liquid,md,html,yml,erb}", "./frontend/javascript/**/*.js", "./data/**/*.yml"],
  theme: {
    extend: {
      height: {
        124: "32rem"
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.red.600'),
              '&:hover': {
                textDecoration: 'underline',
              }
            },
          }
        },
        lg: {
          css: {
            a: {
              color: theme('colors.red.600'),
              '&:hover': {
                textDecoration: 'underline',
              }
            },
          }
        },
      }),
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
