module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.html', './src/**/*.md'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
