import axios from "axios";

export async function useThemeColor(path: string) {
  if (!path) return;

  function themeColor(src: string, width: number = 500, height: number = 500) {
    return new Promise(async (resolve, reject) => {
      const newsrc = await axios({
        url: src,
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

    const color = sortList[0].color.split(" ").join(",");

    return color;
  }

  const res = await themeColor(path);

  const data = colorArr(res);
  const color = getColor(data);

  return color;
}
