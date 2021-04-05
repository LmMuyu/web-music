import type { RouteRecordRaw } from "vue-router";
import path from "path";

export default async function createRoute(
  pathList: string[],
  routes: RouteRecordRaw[]
) {
  const pathListLen = pathList.length;
  let routeResList: RouteRecordRaw[] = [];

  try {
    for (let i = 0; i < pathListLen; i++) {
      const pathName = pathList[i];

      //判断这个路由存不存在，有就跳过他的创建
      if (hasRoute(pathName, routes)) {
        continue;
      }

      routeResList.push(await routeRecordRaw(pathName));
    }
  } catch (err) {
    console.log(err);
  }

  return routeResList;
}

function routeRecordRaw(path: string): Promise<RouteRecordRaw> {
  return new Promise((resolve) => {
    const route = {
      path: `/${path}`,
      name: pathName(path),
      children: [],
      component: () => import(filePath(path)),
    };

    resolve(route);
  });
}

function pathName(path: string) {
  return path.replace(/\w/, (s) => s.toUpperCase());
}

function filePath(fileName: string) {
  const root = process.cwd();
  const filepath = path.join(root, "/view", `/${fileName}`) + ".vue";
  console.log(filepath);

  if (!!filepath) {
    throw new Error(`${filePath}:文件找不到。`);
  }

  return filepath;
}

function hasRoute(pathName: string, routes: RouteRecordRaw[]) {
  const routeList = [...routes];

  for (const path of routeList) {
    const routeItem = routeList.shift();

    if (routeItem?.path === pathName) {
      return true;
    }

    routeItem?.children?.forEach((routeItem: any) =>
      routeList.unshift(routeItem)
    );
  }

  return false;
}
