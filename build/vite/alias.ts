import path from "path";
import { Alias } from "vite";

function getPath(dir: string) {
  return path.join(__dirname, ".", dir);
}

export default function createAlias(path: [string, string][]): Alias[] {
  return path.map(([alias, src]) => {
    if (!alias.startsWith("/") && !alias.endsWith("/")) {
      return {
        find: alias,
        replacement: src,
      };
    }

    return {
      find: alias,
      replacement: getPath(src) + "/",
    };
  });
}
