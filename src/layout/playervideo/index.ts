import filterDate from "../../utils/filterDate";
import { fromPlayCount } from "../../utils/fromPlayCount";

interface NickName {
  followed: boolean;
  id: number;
  img1v1Url: string;
  name: string;
}

export interface VIDEO_INFO {
  vid: number;
  videoname: string;
  nickname: string;
  artistNames: NickName[];
  title: string;
  poster: string;
  playcount: string;
  createtime: number;
  duration: string;
  commentCount: number;
  otherinfo: {
    step: number;
    linke: number;
  };
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
    createtime: 0,
    duration: "",
    commentCount: 0,
    otherinfo: {
      step: 0,
      linke: 0,
    },
  };

  videoinfo.videoname = data.name;
  videoinfo.playcount = fromPlayCount(data.playCount);
  videoinfo.createtime = data.publishTime;
  videoinfo.nickname = data.artistName;
  videoinfo.artistNames = data.artists;
  videoinfo.title = data.desc;
  videoinfo.duration = filterDate(data.duration);
  videoinfo.commentCount = data.commentCount;
  videoinfo.poster = data.picUrl ?? "";
  videoinfo.vid = data.id;

  return videoinfo;
}