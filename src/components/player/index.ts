import { reactive, ref } from "@vue/runtime-dom";
import { nextTick, Ref, watchEffect, WatchStopHandle } from "vue";
import { commentMusic } from "../../api/playList";
import { useLocalStorage } from "../../utils/useLocalStorage";
import { useWatchRoutePath } from "../../utils/useWatchHost";

type CommentsType = "music" | "mv" | "video";

export class VideoComments {
  currPage: number;
  initmap: boolean;
  COMMENT_LEN: number;
  MAX_LIMIT: any;
  timeTable: Map<any, any>;
  playListHistoryOptions: { total: number; time: number };
  mid: number | string;
  comments: Ref<any[]>;
  type: CommentsType;
  commentMusicThen: Ref<({ config, data: comment }: { config: any; data: any }) => void>;
  constructor(type: CommentsType) {
    this.currPage = 1;
    this.initmap = false;
    this.COMMENT_LEN = 40;
    this.MAX_LIMIT = this.COMMENT_LEN;
    this.timeTable = new Map();
    this.comments = ref([]);
    this.type = type;

    this.playListHistoryOptions = reactive({ total: 0, time: 0 });
    this.commentMusicThen = ref(this.commentMusicThenFn);
  }

  currentChange(index: number) {
    if (index === this.currPage) {
      return;
    }

    console.log(index);

    commentMusic(this.mid, index, 0, 20, this.type).then(this.commentMusicThen.value.bind(this));
  }

  changePageIndex(index: number) {
    if (index === this.currPage) {
      return;
    }

    commentMusic(this.mid, index, 0, 20, this.type).then(this.commentMusicThen.value.bind(this));
  }

  commentMusicThenFn({ config, data: comment }) {
    this.playListHistoryOptions.total = comment.total;
    this.playListHistoryOptions.time = comment.comments[comment.comments.length - 1].time;

    if (config.params.offset + 1 === 1 && comment.hotComments.length > 0) {
      const diff = this.COMMENT_LEN - comment.hotComments.length;
      this.comments.value = [...comment.hotComments, ...comment.comments.slice(0, diff)];
      return;
    }

    this.comments.value = comment.comments;
    this.setTimeTable(1, this.playListHistoryOptions.time);
  }

  setTimeTable(page: number, time: number) {
    if (!this.timeTable.has(page)) {
      this.timeTable.set(page, time);
    }
  }

  async currentMusicPlayIndex(index: number, mid: number | string) {
    const data = await commentMusic(mid, 1, 0, this.MAX_LIMIT, this.type);
    this.mid = mid;

    return new Promise((resolve) => {
      watchEffect(() => {
        if (this.commentMusicThen.value) {
          this.commentMusicThen.value.call(this, data);
          resolve(this.comments);
        }
      });
    });
  }
}

export class AudioStatus {
  status: Ref<boolean>;
  p: Promise<unknown>;
  private include: string[];
  private _resolve: (value: unknown) => void;
  private comeout: string[];
  constructor() {
    this.status = ref(false);
    //这个数组是用来固定死Audio组件的，不让它伸回去/伸出来
    this.include = ["/playlist", "/video"];
    //同时在include和comeout数组的路由路径是不让伸出来
    this.comeout = ["/video"];

    this.defaultStatus();
    this.sync();
    this.watchRoute();
  }

  defaultStatus() {
    const status = useLocalStorage("audiodefstatus").value;
    if (this.status.value) {
      this.status.value = status;
    }
  }

  watchRoute() {
    useWatchRoutePath(async (route) => {
      const path = route.path;

      if (this.include.indexOf(path) > -1) {
        this.status.value = true;
      } else {
        this.status.value = false;
      }

      await nextTick();
      const comeoutstatus = this.comeout.indexOf(path) > -1;
      //用来控制Audio组件默认状态
      this._resolve(!comeoutstatus);
    });
  }

  sync() {
    this._resolve = null;
    this.p = new Promise((resolve) => (this._resolve = resolve));
  }
}
