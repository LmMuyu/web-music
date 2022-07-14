import { fromPlayCount } from "../../../utils/fromPlayCount";

export class videoDetail {
  vid: number;
  title: string;
  playTime: string;
  durationms: string;
  enterPlayDt: number;
  enterPlayUrl: string;
  creator: creatorInfo[];
  coverUrl: string;

  constructor(data: any) {
    this.vid = data.vid;
    this.enterPlayUrl = data.previewUrl;
    this.enterPlayDt = Math.floor(data.previewDurationms / 1000);
    this.playTime = fromPlayCount(data.playTime * 10);
    this.creator = [new creatorInfo(data.creator)];
    this.durationms = data.durationms;
    this.title = data.title;
    this.coverUrl = data.coverUrl;
  }
}

class creatorInfo {
  userName: string;
  userId: number;

  constructor({ nickname, userId }) {
    this.userName = nickname;
    this.userId = userId;
  }
}
