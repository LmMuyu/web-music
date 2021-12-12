import { CSSOptions, loadEnv } from "vite";
import styleImport from "vite-plugin-style-import";
import rollupOptions from "./vite/rollupOptions";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import createAlias from "./vite/alias";
import { preloadStyleCss } from "./vite/plugins";

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
  ["src/", "/src"],
  ["comps/", "src/components"],
  ["view/", "src/view"],
  ["utils/", "src/utils"],
  ["api/", "src/api"],
  ["layout/", "src/layout"],
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
      proxy: {
        "^/music": {
          target: "https://music.163.com",
          changeOrigin: true,
          rewrite(path) {
            path = path.replace(/^\/music/, "");
            return path;
          },
        },
      },
    },
  };
};
