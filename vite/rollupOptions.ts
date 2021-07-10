import { RollupOptions } from "rollup";

const rollupOptions: RollupOptions = {
  output: {
    manualChunks: {
      "element-plus": ["element-plus"],
    },
  },
};

export default rollupOptions;
