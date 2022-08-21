import { RollupOptions } from "rollup";
import { terser } from "rollup-plugin-terser";

const rollupOptions: RollupOptions = {
  output: {
    format: "es",
    manualChunks(id) {
      if (id.includes("node_modules")) {
        return id.toString().split("node_modules/")[1].split("/")[0].toString();
      }
    },
    chunkFileNames: "assets/js/[name]-[hash].js",
    entryFileNames: "[name]-[hash].js",
    assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
  },
  plugins: [
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      output: {
        comments: true,
      },
    }),
  ],
  treeshake: true,
};

export default rollupOptions;
