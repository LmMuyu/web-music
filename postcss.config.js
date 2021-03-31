const postcssOption = {
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": { utf8: false },
    "postcss-preset-env": {
      autoprefixer: true,
    },
    tailwindcss: {},
  },
};

module.exports = postcssOption;
