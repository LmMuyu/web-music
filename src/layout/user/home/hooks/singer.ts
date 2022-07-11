import dayjs from "dayjs";
import { computed, watchEffect } from "vue";
import store from "../../../../store";
import { follow } from "../../../../store/modules/module_login";
import { formatTime } from "../../../../utils/filterDate";

export class SingetInfo {
  id: 0;
  uid: 0;
  nickname: "";
  tags: "";
  avatarUrl: "";
  follow: boolean;
  artist: {
    musicsize: 0;
    mvsize: 0;
    eventCount: 0;
    videoCount: 0;
  };
  other: {
    wyiyuntubiaoUrl: "";
  };
  stop: any;
  title: string;

  constructor(data: any) {
    console.log(data);

    this.id = data.artist.id;
    this.uid = data?.user?.userId || data.artist.id;
    this.nickname = data?.user?.nickname || data.artist.name;
    this.tags = data.identify.imageDesc;
    this.avatarUrl = data.artist.cover;
    this.title = data.artist.briefDesc;

    this.artist = new Artist();
    this.artist.eventCount = data.eventCount;
    this.artist.musicsize = data.artist.musicsize;
    this.artist.mvsize = data.artist.mvsize;
    this.artist.videoCount = data.videoCount;

    this.other = new Other();
    this.other.wyiyuntubiaoUrl = data.identify.imageUrl;

    this.islogin && this.findFollow();
  }

  private findFollow() {
    const follows = computed<follow[]>(store.getters["login/getFollows"]);
    const userdata = store.getters["login/getUserData"];

    this.stop = watchEffect(() => {
      if (follows.value.length > 0) {
        console.log("查找中");
        const followinfo = follows.value.find((followinfo) => followinfo.uid === userdata.userID);
        console.log(followinfo);
        this.follow = followinfo ? true : false;
      } else {
        this.follow = false;
      }
    });
  }

  stopWatch() {
    this.stop();
  }

  islogin() {
    return store.getters["login/getIslogin"];
  }
}

class Artist {
  musicsize: 0;
  mvsize: 0;
  eventCount: 0;
  videoCount: 0;
}

class Other {
  wyiyuntubiaoUrl: "";
}

export const module = {
  guanzhu: "关注",
};

export const singerModuleInfo = {
  eventCount: "动态",
  mvsize: "MV",
  musicsize: "单曲",
  videoCount: "视频",
};

export class albumDateil {
  aid: 0;
  picUrl: string;
  albumname: string;
  createtime: string;
  alias: [];

  constructor(data: any) {
    this.aid = data.id;
    this.picUrl = data.picUrl;
    this.createtime = formatTime(data.publishTime);
    this.alias = data.alias;
  }
}
