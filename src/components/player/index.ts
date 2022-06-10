import { reactive, ref } from "@vue/runtime-dom";
import { commentMusic } from "../../api/playList";
import { isType } from "../../utils/methods";

type CommentsType = "music" | "mv";

export class VideoComments {
  currPage: number;
  initmap: boolean;
  COMMENT_LEN: number;
  MAX_LIMIT: any;
  timeTable: Map<any, any>;
  playListHistoryOptions: { total: number; time: number };
  mid: number;
  comments: any;
  type: CommentsType;
  commentMusicThen: ({ config, data: comment }: { config: any; data: any }) => void;
  constructor(type: CommentsType) {
    this.currPage = 1;
    this.initmap = false;
    this.COMMENT_LEN = 40;
    this.MAX_LIMIT = this.COMMENT_LEN;
    this.timeTable = new Map();
    this.comments = ref([]);
    this.type = type;

    this.playListHistoryOptions = reactive({ total: 0, time: 0 });
    this.commentMusicThen = this.commentMusicThenFn;
  }

  currentChange(index: number) {
    if (index === this.currPage) {
      return;
    }
    commentMusic(this.mid, index, this.timeTable.get(index - 1), null, this.type).then(
      this.commentMusicThen
    );
  }

  changePageIndex(index: number) {
    if (index === this.currPage) {
      return;
    }

    commentMusic(this.mid, index, this.timeTable.get(index - 1) ?? 0, null, this.type).then(
      this.commentMusicThen
    );
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

  async currentMusicPlayIndex(index: number, mid: number) {
    const data = await commentMusic(mid, 1, 0, this.MAX_LIMIT, this.type);
    this.mid = mid;

    if (data) {
      this.commentMusicThen(data);
      return this.comments;
    }
  }
}
