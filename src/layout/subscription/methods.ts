import { computed, Ref } from "vue";

const footerInfo = (props: any) => {
  const info = [
    {
      name: "linke",
      event: {
        emit: true,
        emit_name: "linke",
      },
      icon: "icondianzan1",
      count: props?.event?.info?.likedCount || props?.likedCount || 0, //点赞
    },
    {
      name: "comment",
      event: {
        emit: true,
        emit_name: "comment",
      },
      count: props?.event?.info?.commentCount || props?.commentCount || 0, //评论
    },
    {
      name: "forward",
      event: {
        emit: true,
        emit_name: "comment",
      },
      count: props?.event?.insiteForwardCount || props?.insiteForwardCount || 0, //转发
    },
  ];

  //规格x.x.x.x
  function setData(name: string, path: string, data: any) {
    const pathArr = path.split(".");
    const returnInfoObj = info.find((v) => v.name === name);

    let parentObj = returnInfoObj;
    let nextObj = returnInfoObj;

    pathArr.map((key, index) => {
      nextObj = nextObj[key];
      if (nextObj === undefined || !pathArr[index + 1]) {
        parentObj[key] = data;
        return;
      }

      parentObj = nextObj[key];
    });
  }

  return {
    info,
    setData,
  };
};

export const computed_footerInfo = computed(() => {
  return function (props: any) {
    const { info, setData } = footerInfo(props);
    setData("linke", "icon", ["icondianzan1", "iconzan"]);

    return info;
  };
});

export const comment_footerInfo = computed(() => {
  return function (props: any) {
    const { info, setData } = footerInfo(props);
    setData("comment", "icon", "iconpinglun");
    return info;
  };
});

export function linkeEvent(
  linkedCounts: Ref<number>,
  isLatestLinke: Ref<boolean>
) {
  return function (res: any) {
    const islinke = JSON.parse(res.config.data)["t"];
    console.log(res);

    if (islinke === 1 && res.data.code === 200) {
      linkedCounts.value += 1;
      isLatestLinke.value = true;
    } else {
      linkedCounts.value -= 1;
      isLatestLinke.value = false;
    }
  };
}
