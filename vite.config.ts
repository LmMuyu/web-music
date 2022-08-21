import { loadEnv } from "vite";
import { ElementPlusResolve, createStyleImportPlugin } from "vite-plugin-style-import";
import rollupOptions from "./vite/rollupOptions";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import createAlias from "./vite/alias";
import vue from "@vitejs/plugin-vue";
import { readFileSync } from "fs";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import externalGlobals from "rollup-plugin-external-globals";

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
  ["assets/", "src/assets"],
]);

function buildElementPlus(mode: string) {
  const isPro = mode === "production";
  const element = isPro
    ? [
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ]
    : [
        createStyleImportPlugin({
          resolves: [ElementPlusResolve()],
        }),
      ];

  return element;
}

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const { VITE_PORT, VITE_HOST } = env;

  const basePath = mode === "produrtion" ? "/dist" : "/";

  return {
    base: basePath,
    plugins: [
      vue(),
      vueJsx({
        transformOn: true,
        optimize: true,
        enableObjectSlots: false,
      }),

      createSvgIconsPlugin({
        iconDirs: [
          path.join(__dirname, "/src/assets"),
          path.join(process.cwd(), "/src/assets/.xgplayer/skin/assets"),
        ],
      }),
      ...buildElementPlus(mode),
   
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
      minify: "esbuild",
      terserOptions: {
        compress: {
          drop_console: true, //清除console
          drop_debugger: true, //清除debugger
        },
        output: {
          comments: true, //c
        },
      },
      // sourcemap: true,
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
            return path;
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ["vue-demi", "vue"],
      entries: ["vue", "vue-demi"],
    },
  };
};
