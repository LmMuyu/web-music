import { isRef, ref, watchEffect, unref } from "@vue/runtime-dom";
import axios from "axios";

import type { Ref } from "vue";

type INFO = { width: number; height: number };

export async function useThemeColor(path: string, imageInfo: INFO) {
  if (!path) return;

  function themeColor(src: string, imageInfo: INFO) {
    return new Promise(async (resolve, reject) => {
      const newsrc = await axios({
        url: src + `?param=${imageInfo.width}y${imageInfo.height}`,
        method: "GET",
        responseType: "blob",
      });

      const img = new Image();
      URL.revokeObjectURL(img.src);
      img.src = URL.createObjectURL(newsrc.data);

      img.onload = function () {
        const colorList = getImgData(img);
        resolve(colorList);
      };

      img.onerror = function (err) {
        reject(err);
      };
    });
  }

  function getImgData(img) {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;

    const ctx2d = canvas.getContext("2d");

    ctx2d.drawImage(img, 0, 0);

    const ImageData = ctx2d.getImageData(0, 0, 500, 500).data;
    return ImageData;
  }

  function colorArr(data) {
    const colorObj = {};
    let rgbStr = "";

    for (let i = 0; i < data.length; i += 4) {
      rgbStr += data[i];
      rgbStr += " " + data[i + 1];
      rgbStr += " " + data[i + 2];
      rgbStr += " " + data[i + 3];

      if (rgbStr.indexOf(undefined) !== -1 || data[i + 3] === 0) {
        rgbStr = "";
        continue;
      }

      if (colorObj[rgbStr]) {
        ++colorObj[rgbStr];
      } else {
        colorObj[rgbStr] = 1;
      }

      rgbStr = "";
    }

    return colorObj;
  }

  function getColor(data) {
    const dataList = [];

    for (const key in data) {
      dataList.push({
        color: key,
        count: data[key],
      });
    }

    const sortList = dataList.sort((a, b) => {
      return b.count - a.count;
    });

    return sortList[0].color.split(" ").join(",");
  }

  const res = await themeColor(path, imageInfo); //获取数据
  const data = colorArr(res); //处理数据
  const color = getColor(data); //得到主题颜色

  return color;
}

export function returnThemmColor(src: string | Ref<string>, imageInfo: INFO) {
  if (!unref(src) || imageInfo.height == 0 || imageInfo.width == 0) return {};

  const url = isRef(src) ? src : ref(src);
  const styleColor = ref("");
  const store = {};

  const stopEffect = watchEffect(async () => {
    if (store[url.value]) return (styleColor.value = store[url.value]);

    console.log(Date.now());

    const res = await useThemeColor(url.value, imageInfo);

    !store[url.value] && (store[url.value] = `rgb(${res})`);

    styleColor.value = `rgb(${res})`;
  });

  return {
    stopEffect,
    styleColor,
    setsrcpipe: url,
  };
}
