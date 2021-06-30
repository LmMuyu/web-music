import { computed } from "@vue/runtime-core";

interface ListInfo {
  id: number;
  coverImg: string;
  name: string;
  updateFrequency: string;
}

export function preloading(childrenData: ListInfo[]) {
  return computed(() => {
    const list: ListInfo[] = [];

    childrenData.map((value: any) => {
      const img = new Image();
      img.src = value.coverImgUrl;
      img.onload = function () {
        list.push({
          id: value.id,
          coverImg: JSON.stringify(img),
          name: value.name,
          updateFrequency: value.updateFrequency,
        });
      };
    });

    return list;
  });
}

