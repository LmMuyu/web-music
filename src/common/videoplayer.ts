import { isType } from "../utils/methods";

type EventKey =
  | "durationchange"
  | "definitionChange"
  | "screenShot"
  | "play"
  | "playing"
  | "pause"
  | "ended"
  | "error";

interface OPTIONS {
  autoplay: boolean;
  poster: string;
  lastPlayTime: number;
  lastPlayTimeHideDelay: number;
  urlList: string[];
}

const typenames = [
  "durationchange",
  "definitionChange",
  "screenShot",
  "play",
  "playing",
  "pause",
  "ended",
  "error",
];

export default class playerVideo implements Partial<OPTIONS> {
  private xgplayer: any;
  private url: string;
  private mountel: HTMLElement;
  private eventnames: string[];
  private eventlists: { type: string; fn: () => any }[];
  private width: number;
  private height: number;
  autoplay: boolean;
  player: any;
  poster: string;
  urlList: string[];
  lastPlayTime: number;
  lastPlayTimeHideDelay: number;
  isStanceSources: boolean;

  constructor(url: string, mountel: HTMLElement, options?: Partial<OPTIONS>) {
    //@ts-ignore
    this.xgplayer = window.Player;
    this.url = url;
    this.mountel = mountel;
    this.autoplay = options?.autoplay ?? false;
    this.poster = options?.poster ?? "";
    this.urlList = options?.urlList ?? [];
    this.lastPlayTime = options?.lastPlayTime ?? 0;
    this.lastPlayTimeHideDelay = options?.lastPlayTimeHideDelay ?? 0;
    this.isStanceSources = true;
    this.eventnames = typenames;
    this.eventlists = [];
    this.playerVideo();
  }

  init() {
    this.playerVideo();
  }

  playerVideo() {
    if (!this.xgplayer) return;
    const { autoplay, urlList, lastPlayTime, lastPlayTimeHideDelay, poster, width, height } = this;

    Promise.resolve().then(() => {
      try {
        this.player = new this.xgplayer({
          el: this.mountel,
          url: this.url,
          lang: "zh-cn",
          width,
          poster,
          height,
          autoplay,
          lastPlayTime,
          lastPlayTimeHideDelay,
          playbackRate: [0.5, 0.75, 1, 1.5, 2],
          defaultPlaybackRate: 1,
          playNext: {
            urlList,
          },
          keyShortcutStep: {
            //设置调整步长
            currentTime: 15, //播放进度调整步长，默认10秒
            volume: 0.2, //音量调整步长，默认0.1
          },
        });

        const isCanPlay = this.canPlayType();
        if (!isCanPlay) {
          this.destroy();
          console.warn("无法播放MP4视频");
        }

        this.dispatchOnEvent();
      } catch (error) {
        this.isStanceSources = false;
        console.log("实例化xgplayer失败");
      }
    });
  }

  unshiftMusicUrl(urls: string | string[]) {
    const warnmearr = (index) => console.warn("urls下标" + index + "不是类型字符");

    if (isType(urls) === "Array") {
      const urlList = (urls as string[]).filter((url, index) =>
        typeof url === "string" ? url : warnmearr(index)
      );

      this.urlList.push(...urlList);
    } else if (typeof urls === "string") {
      this.urlList.push(urls);
    } else {
      console.warn("urls不是类型字符");
    }
  }

  windowsize(width: number, heihgt: number) {
    this.width = width;
    this.height = heihgt;
  }

  destroy() {
    this.player.destroy(true);
    this.player = null;
    return true;
  }

  canPlayType() {
    return this.player.canPlayType('video/mp4; codecs="avc1.64001E, mp4a.40.5"');
  }

  on(name: EventKey, listener: () => any) {
    if (typeof listener !== "function") {
      console.log("listener不是函数");
      return;
    }

    if (!(this.eventnames.indexOf(name) > -1)) {
      console.log("无法注册" + name + "事件");
      return;
    }

    const eventobj = {
      type: name,
      fn: listener,
    };

    this.eventlists.push(eventobj);
  }

  private dispatchOnEvent() {
    this.eventlists.map((eventobj) => {
      this.player.on(eventobj.type, eventobj.fn);
    });
  }
}
