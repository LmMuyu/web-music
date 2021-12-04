import path from "path";
import { Alias } from "vite";

function getPath(dirPath: string) {
  return path.join(process.cwd(), dirPath);
}

const strategy = {
  startsWith(path: string) {
    return path.startsWith("/");
  },
  endsWith(path: string) {
    return path.endsWith("/");
  },
};

function checkWith(path: string) {
  let curPath = path;

  Object.keys(strategy).map((key) => {
    const testRes = strategy[key](path);

    if (!testRes) {
      curPath = key === "startsWith" ? "/" + path : path + "/";
    }
  });

  return curPath;
}

export default function createAlias(paths: [string, string][]): Alias[] {
  return paths.map(([alias, path]) => {
    const reg = /\.js$/;

    if (reg.test(path)) {
      return {
        find: alias,
        replacement: path,
      };
    }

    const newPath = checkWith(path);

    return {
      find: alias,
      replacement: getPath(newPath),
    };
  });
}
