import { fromPlayCount } from "../../utils/fromPlayCount";

export class RecPlayList {
  name: string;
  playcount: string;
  picUrl: string;
  id: number;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.picUrl = data.picUrl || data.coverImgUrl;
    this.playcount = fromPlayCount(data.playcount);
  }
}
