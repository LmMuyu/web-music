import { loadEnv } from "vite";
import { ElementPlusResolve, createStyleImportPlugin } from "vite-plugin-style-import";
import rollupOptions from "./vite/rollupOptions";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import createAlias from "./vite/alias";
import vue from "@vitejs/plugin-vue";
import { readFileSync } from "fs";
import path from "path";

import type { ConfigEnv, UserConfig } from "vite";

const privatekey = readFileSync(path.join(process.cwd(), "/public/server_key.pem"), "utf-8");
const publiccer = readFileSync(path.join(process.cwd(), "/public/server.crt"), "utf-8");

const aliasList = createAlias([
  ["src/", "/src"],
  ["comps/", "src/components"],
  ["view/", "src/view"],
  ["utils/", "src/utils"],
  ["api/", "src/api"],
  ["layout/", "src/layout"],
  ["vue", "vue/dist/vue.esm-bundler.js"],
]);

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const { VITE_PORT, VITE_HOST } = env;

  return {
    plugins: [
      vue(),
      vueJsx({
        transformOn: true,
        optimize: true,
        enableObjectSlots: false,
      }),
      // styleImport({
      //   libs: [
      //     {
      //       libraryName: "element-plus",
      //       resolveStyle(name) {
      //         return `element-plus/theme-chalk/${name}.css`;
      //       },
      //       resolveComponent(name) {
      //         return `element-plus/lib/components/${name}`;
      //       },
      //     },
      //   ],
      // }),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.join(__dirname, "/src/assets")],
      }),
    ],
    css: {
      preprocessorOptions: {
        css: {
          additionalData: ['@import "./src/css/normalize.css";'],
        },
        scss: {
          additionalData: ['@import "./src/index.scss";'],
        },
      },
    },
    resolve: {
      alias: [...aliasList],
    },
    build: {
      rollupOptions,
    },
    server: {
      port: Number(VITE_PORT),
      host: VITE_HOST,
      https: {
        key: privatekey,
        cert: publiccer,
      },
      proxy: {
        "^/music": {
          target: "https://music.163.com",
          changeOrigin: true,
          rewrite(path) {
            path = path.replace(/^\/music/, "");
            return path;
          },
        },
        "^/puclouddisk/": {
          target: "https://netease-cloud-music-api-chi-ashy.vercel.app",
          changeOrigin: true,
          rewrite(path) {
            console.log(path);

            // console.log(path);
            return path;
          },
        },
      },
    },

    optimizeDeps: {
      exclude: ["vue-demi"],
    },
  };
};
