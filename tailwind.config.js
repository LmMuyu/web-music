module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundColor: (theme) => ({
      ...theme("colors"),
      wpbgColor: "#f5f5f5",
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
