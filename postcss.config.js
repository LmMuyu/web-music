const postcssOption = {
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": { utf8: false },
    "postcss-cssnext": {},
    "postcss-preset-env": {
      autoprefixer: true,
    },
    "postcss-px-to-viewport": {
      viewportWidth: 1336,
      viewportHeight: 635,
      unitPrecision: 2,
      viewportUnit: "rem",
      selectorBlackList: [".ignore", ".hairlines"],
      mediaQuery: false,
      include: /\/src/,
    },
    cssnano: {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false,
    },
    tailwindcss: {},
  },
};

module.exports = postcssOption;
