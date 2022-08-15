import { mylinked, videoDetailInfo } from "../../api/playervideo";
import { mvSublist } from "../../api/user";
import filterDate, { formatTime } from "../../utils/filterDate";
import { fromPlayCount } from "../../utils/fromPlayCount";
import { isType } from "../../utils/methods";

interface NickName {
  followed: boolean;
  id: number;
  img1v1Url: string;
  name: string;
}

export interface VIDEO_INFO {
  vid: number | string;
  title: string;
  cover: string;
  poster: string;
  nickname: string;
  duration: string;
  videoname: string;
  playcount: string;
  createtime: string;
  commentCount: number;
  artistNames: NickName[];
  otherinfo: {
    collection: number;
    linke: number;
    share: number;
    islinke: boolean;
    iscollection: boolean;
  };
  videoGroup: { id: number; name: string }[];
}

export async function videoinfodata(data: any): Promise<VIDEO_INFO> {
  const videoinfo: VIDEO_INFO = {
    vid: null,
    videoname: "",
    nickname: "",
    artistNames: [],
    poster: "",
    title: "",
    playcount: "",
    createtime: "",
    duration: "",
    commentCount: 0,
    cover: "",
    otherinfo: {
      linke: 0,
      collection: 0,
      share: 0,
      islinke: false,
      iscollection: false,
    },
    videoGroup: [],
  };

  videoinfo.videoname = data.name || data.title;
  videoinfo.playcount = fromPlayCount(data.playCount || data.playTime * 10);
  videoinfo.createtime = formatTime(data.publishTime, "ymd_hms");
  videoinfo.nickname = data.artistName;
  videoinfo.artistNames =
    isType(data.artists || data.creator) === "Array"
      ? (data.artists || data.creator).map((detail) => new nickNameClass(detail))
      : [new nickNameClass(data.artists || data.creator)];
  videoinfo.title = data.desc || data.description;
  videoinfo.duration = filterDate(data.duration || data.durationms);
  videoinfo.commentCount = data.commentCount;
  videoinfo.poster = data.picUrl ?? "";
  videoinfo.vid = data.id || data.vid;
  videoinfo.cover = data.cover || data.coverUrl;
  videoinfo.videoGroup = data.videoGroup || [];
  videoinfo.otherinfo.linke = data.praisedCount;
  videoinfo.otherinfo.collection = data.subscribeCount;
  videoinfo.otherinfo.share = data.shareCount;

  const otherInfo = await isLinkCollect(videoinfo.vid as string);

  for (const key in otherInfo) {
    videoinfo.otherinfo[`is${key}`] = otherInfo[key];
  }

  return videoinfo;
}

class nickNameClass implements NickName {
  id: number;
  img1v1Url: string;
  name: string;
  followed: boolean;

  constructor(data: any) {
    this.id = data.userId || data.id;
    this.name = data.nickname || data.name;
    this.followed = data.followed;
    this.img1v1Url = data.avatarUrl || data.img1v1Url;
  }
}

export async function isLinkCollect(isid: string) {
  const quantityInfo = await mvSublist();
  const isRes = {
    collection: false,
    linke: false,
  };

  isRes.collection = quantityInfo.data.data.some((collect) => collect.vid === isid);
  isRes.linke = (await videoDetailInfo(isid)).data.liked;

  return isRes;
}
