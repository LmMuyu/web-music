import { isType } from "./methods";
import { allType } from "./type";

export interface MusicDetailOption {
  id: number;
  name: string;
  picUrl: string;
  ar: allType<typeSinger>;
}

export interface typeSinger {
  id?: number;
  userId?: number;
  name?: string;
  nickname?: string;
  userName?: string;
}

type singerArr = Array<typeSinger>;

const listID = ["id", "userId"];
const listName = ["name", "nickname", "userName"];

export class singer {
  id: number;
  name: string;

  constructor(detailInfo: typeSinger) {
    const { id, name } = this.singerInfo(detailInfo);

    this.id = id;
    this.name = name;
  }

  singerInfo(detailInfo: any) {
    // console.log(detailInfo);
    const keys = Object.keys(detailInfo);

    const id = listID.find((v) => keys.includes(v))!;
    const name = listName.find((v) => keys.includes(v))!;

    return {
      id: detailInfo[id],
      name: detailInfo[name],
    };
  }
}

export class musicDetail {
  id: number;
  name: string;
  picUrl: string;
  singer: Record<string, any>[];
  singerInfo: allType<typeSinger>;

  constructor(options: MusicDetailOption) {
    const { id, name, picUrl, ar } = this.runMusicDetail(options);

    this.id = id;
    this.name = name;
    this.picUrl = picUrl;
    this.singer = ar;
    this.singerInfo = this.setSingerInfo(ar);
  }

  runMusicDetail(options: Record<string, any>) {
    const detail = options?.[0] || options;

    return { ...(detail?.al || detail), ar: detail.ar };
  }

  setSingerInfo(dataInfo: any) {
    return isType(dataInfo) === "Array"
      ? (dataInfo as singerArr).map((info) => new singer(info))
      : new singer(dataInfo);
  }
}

//resultOptions

function singerOptions(data: any) {
  if (!data) return [];
  return isType(data) !== "Array" ? [data] : data;
}

export class resultOptions implements MusicDetailOption {
  id: number;
  name: string;
  picUrl: string;
  ar: typeSinger;

  constructor(options: Record<string, any>) {
    this.id = this.getID(options, options.type);
    this.name = this.getName(options);
    this.picUrl = this.getPicUrl(options);
    this.ar = this.getAr(options);
  }

  picUrlRecursion(options: any) {
    let test = false;

    for (const key in options) {
      test = /img\d+[x | y]\d+/.test(key);

      if (test) {
        return options[key];
      }
    }

    return this.picUrlRecursion(options.album);
  }

  getID(options: any, type: string) {
    const id = options.id || options.vid;

    if (!id) {
      throw new Error(`${type}:找不到对应id`);
    }

    return id;
  }

  getName(options: any): string {
    return options.name || options.title;
  }

  getPicUrl(options: any) {
    const url = this.picUrlRecursion(options);

    if (url) return url;

    return (
      options.coverUrl || options.coverImgUrl || options["al"]["picUrl"] || ""
    );
  }

  getAr(options: any) {
    const listInfoAr = ["ar", "creator", "artists"];
    let singerInfoOption = {};

    for (let i = 0; i < listInfoAr.length; i++) {
      const item = options[listInfoAr[i]];

      if (item) {
        singerInfoOption = item;
        break;
      }
    }

    return singerOptions(singerInfoOption);
  }
}

export function musicResultDetail(data: Object) {
  if (isType(data) !== "Object" || Object.keys(data).length <= 0) {
    return undefined;
  }

  const options = new resultOptions(data);
  return new musicDetail(options);
}
