import { computed, createApp, defineComponent, ref, Ref } from "vue";
import filterDate from "../../utils/filterDate";
import router from "../../routes";

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

export function linkeEvent(linkedCounts: Ref<number>, isLatestLinke: Ref<boolean>) {
  return function (res: any) {
    const islinke = JSON.parse(res.config.data)["t"];

    if (islinke === 1 && res.data.code === 200) {
      linkedCounts.value += 1;
      isLatestLinke.value = true;
    } else {
      linkedCounts.value -= 1;
      isLatestLinke.value = false;
    }
  };
}

class PicLists {
  w: Ref<number>;
  h: Ref<number>;
  picList: string[];
  dpr: number;
  constructor(pics: Array<Record<string, any>>) {
    this.dpr = this.windowDpr();
    this.w = ref(this.dpr);
    this.h = ref(this.dpr);
    this.picList = [];
    this.toFileReader(pics);
  }

  private async toFileReader(fileList: any[]) {
    const len = fileList.length;
    if (len === 0) return [];

    const { w, h } = this;

    switch (len) {
      case 1:
        w.value = w.value * 2;
        h.value = h.value * 2;
        break;
      case 2:
        w.value = w.value * 1.5;
        h.value = h.value * 1.5;
        break;
    }

    this.w = w;
    this.h = h;

    this.picList.push(
      ...fileList.map(
        (pic) => pic.pcRectangleUrl + `?param=${Math.floor(w.value)}y${Math.floor(h.value)}`
      )
    );
  }

  private windowDpr() {
    const width = window.outerWidth;
    const height = window.outerHeight;

    const dpr = parseFloat((width / height).toFixed(2)) * 100;
    return Number((dpr - dpr * (1 / 3)).toFixed(2));
  }
}

export class Dynamic extends PicLists {
  relativeTime: string;
  images: string[];
  constructor(subinfo) {
    super(subinfo.pics);
    this.relativeTime = filterDate(subinfo.eventTime, null, true);
  }
}

export function msgRender(msg: string, mount: HTMLElement) {
  const comp = defineComponent({ template: msg });
  const app = createApp(comp);
  app.use(router);
  app.mount(mount);
}
