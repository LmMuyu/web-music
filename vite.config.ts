import vite, { CSSOptions, loadEnv } from "vite";
import styleImport from "vite-plugin-style-import";
import rollupOptions from "./vite/rollupOptions";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import createAlias from "./vite/alias";
import vue from "@vitejs/plugin-vue";
import path from "path";
import os from "os";

// import { preloadStyleCss } from "./vite/plugins";

import type { ConfigEnv, UserConfig } from "vite";
import { readFileSync } from "fs";

const privatekey = readFileSync(path.join(process.cwd(), "/public/server_key.pem"), "utf-8");
const publiccer = readFileSync(path.join(process.cwd(), "/public/server.crt"), "utf-8");

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

const hostIp = os.networkInterfaces()["以太网"][1].address;

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
  const { VITE_PROXY, VITE_PORT, VITE_HOST, VITE_REQUEST_IP } = env;

  console.log(VITE_REQUEST_IP);

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
      createSvgIconsPlugin({
        iconDirs: [path.join(process.cwd(), "/src/assets/xgplayerstyle/.xgplayer/skin/assets")],
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
      host: "127.0.0.1",
      https: {
        key: privatekey,
        cert: publiccer,
      },
      proxy: {
        "^/music": {
          target: "https://music.163.com",
          changeOrigin: true,
          rewrite(path) {
            console.log(path);

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
      exclude: ["vue-demi"],
    },
  };
};
