import {
  ElementPlusResolve,
  createStyleImportPlugin,
} from "vite-plugin-style-import";
import path from "path";
import { loadEnv } from "vite";
import { readFileSync } from "fs";
import vue from "@vitejs/plugin-vue";
import createAlias from "./vite/alias";
import vueJsx from "@vitejs/plugin-vue-jsx";
import rollupOptions from "./vite/rollupOptions";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import type { ConfigEnv, UserConfig } from "vite";

const privatekey = readFileSync(
  path.join(process.cwd(), "/public/server_key.pem"),
  "utf-8"
);
const publiccer = readFileSync(
  path.join(process.cwd(), "/public/server.crt"),
  "utf-8"
);

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
  const _DEV_ = mode === "produrtion" ? false : true;

  return {
    base: "/",
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
    },
    server: {
      // port: Number(VITE_PORT),
      // host: VITE_HOST,
      // https: {
      //   key: privatekey,
      //   cert: publiccer,
      // },
      hmr: true,
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
        "/cloud": {
          target: "http://cloud-music.pl-fe.cn/",
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/^\/cloud/, "");
          },
        },
      },
    },
    optimizeDeps: {
      ...(_DEV_
        ? {
            exclude: ["vue-demi", "vue"],
            entries: ["vue", "vue-demi"],
          }
        : {}),
    },
  };
};
