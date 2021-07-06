module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundColor: (theme) => {
      return {
        ...theme("colors"),
        wpbgColor: "#f5f5f5",
        wybgColor: "#8a060b",
      };
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
