import { CSSOptions, loadEnv } from "vite";
//https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md
import styleImport from "vite-plugin-style-import";
import rollupOptions from "./vite/rollupOptions";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import createAlias from "./vite/alias";

import type { ConfigEnv, UserConfig } from "vite";

const cssOptions: CSSOptions = {
  preprocessorOptions: {
    css: {
      additionalData: ['@import "./src/css/normalize.css";'],
    },
    scss: {
      additionalData: ['@import "./src/index.scss";'],
    },
  },
};

const aliasList = createAlias([
  ["/@/", "src"],
  ["/comps/", "src/components"],
  ["/view/", "src/view"],
  ["/utils/", "src/utils"],
  ["/api/", "src/api"],
  ["/layout/", "src/layout"],
  ["vue", "vue/dist/vue.esm-bundler.js"],
]);

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);
  const { VITE_PROXY, VITE_PORT, VITE_HOST } = env;

  return {
    plugins: [
      vue(),
      vueJsx({
        transformOn: true,
        optimize: true,
        enableObjectSlots: false,
      }),
      styleImport({
        libs: [
          {
            libraryName: "element-plus",
            resolveStyle(name) {
              return `element-plus/theme-chalk/${name}.css`;
            },
            resolveComponent(name) {
              return `element-plus/lib/components/${name}`;
            },
          },
        ],
      }),
    ],
    css: cssOptions,
    resolve: {
      alias: [...aliasList],
    },
    build: {
      rollupOptions,
    },
    server: {
      port: Number(VITE_PORT),
      open: true,
      proxy: {
        "/mvplay": {
          target: "http://vodkgeyttp8.vod.126.net",
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/\/mvplay/, "");
          },
        },
      },
    },
  };
};
