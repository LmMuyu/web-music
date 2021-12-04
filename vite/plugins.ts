import { PluginOption } from "vite";
import axios from "axios";

export function preloadStyleCss(): PluginOption {
  
  function asyncPreLoad(preloadLinkPath: RegExpMatchArray) {
    return new Promise((resolve) => {
      const transformHtmtResult = preloadLinkPath
        .map(async (strLink) => await axios.get(strLink.match(/href="(.+)"/)[1]))
        .reduce((pre, next) => {
          (async function () {
            const data = (await next).data;
            console.log(data);
          })();

          return (pre += "");
        }, "");

      if (!transformHtmtResult) {
        return resolve("");
      }

      console.log(transformHtmtResult);
      resolve(transformHtmtResult);
    });
  }

  return {
    name: "vite-plugin-preloadStyleCss",
    async transformIndexHtml(html) {
      const reg = /<link\s+rel="\s*preload\s*" as="\s*style\s*" href="(.+)">/g;
      const preloadLinkPath = html.match(reg);

      await asyncPreLoad(preloadLinkPath);
      console.log("html");

      return html;
    },
  };
}
