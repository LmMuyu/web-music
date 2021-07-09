import { ProxyOptions } from "vite";

const httpRE = /https:\/\//;
type ProxyTargetList = Record<
  string,
  ProxyOptions & { rewrite: (path: string) => string }
>;

type proxyItem = [string, string];
type proxyList = proxyItem[];

export function createProxy(proxy: proxyList) {
  const proxyObj: ProxyTargetList = {};

  for (const [prefix, target] of proxy) {
    if (proxyObj.hasOwnProperty(prefix)) {
      continue;
    }

    const isHttps = httpRE.test(target);

    proxyObj[prefix] = {
      target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${path}`), ""),
      ws: true,
      ...(isHttps ? { secure: true } : {}),
    };
  }

  return proxyObj;
}
