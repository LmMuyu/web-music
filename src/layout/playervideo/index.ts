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
  vid: number;
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
  otherinfo: { step: number; linke: number };
  videoGroup: { id: number; name: string }[];
}

export function videoinfodata(data: any): VIDEO_INFO {
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
      step: 0,
      linke: 0,
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
