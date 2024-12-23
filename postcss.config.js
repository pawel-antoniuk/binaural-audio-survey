export default {
  plugins: {
    'tailwindcss': {},
    'postcss-preset-env': {},
    'postcss-nested': {},
    'autoprefixer': {},
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false
  }
}