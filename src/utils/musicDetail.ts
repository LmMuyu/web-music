import { isType } from "./methods";
import { allType } from "./type";

export interface MusicDetailOption {
  id: number;
  name: string;
  picUrl: string;
  ar: typeSinger;
  dt: number;
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

  private singerInfo(detailInfo: any) {
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
  isMusicDetail: boolean;
  nickName: string;
  dt: number;

  constructor(options: MusicDetailOption) {
    const { id, name, picUrl, ar } = this.runMusicDetail(options);

    this.id = options.id;
    this.name = options.name;
    this.picUrl = picUrl;
    this.singer = ar;
    this.singerInfo = this.setSingerInfo(ar);
    this.nickName = this.singerDomString();
    this.isMusicDetail = true;
    this.dt = options.dt;
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

  singerDomString() {
    const infos = this.singerInfo as singer[];

    function createSpanTag(next: singer) {
      return `<p class="cursor-pointer text_hover" style="color:#b2bec3" user-id="${next.id}" >${next.name}</p>`;
    }

    const str = `
      <span class="flex items-center">
      ${infos.map((next) => createSpanTag(next)).join("/")}
      </span>
     `;

    return str;
  }
}

function singerOptions(data: any) {
  if (!data) return [];
  return isType(data) !== "Array" ? [data] : data;
}

export class resultOptions implements MusicDetailOption {
  id: number;
  name: string;
  picUrl: string;
  ar: typeSinger;
  dt: number;

  constructor(musicdata: Record<string, any>) {
    this.id = this.getID(musicdata, musicdata.type);
    this.name = this.getName(musicdata);
    this.picUrl = this.getPicUrl(musicdata);
    this.ar = this.getAr(musicdata);
    this.dt = musicdata.dt;
  }

  picUrlRecursion(options: any) {
    if (Object.keys(options).length === 0) return;
    let test = false;

    for (const key in options) {
      test = /img\d+[x | y]\d+/.test(key);

      if (test) {
        return options[key];
      }
    }

    return this.picUrlRecursion(options?.album ?? {});
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
    const url = options?.album ? this.picUrlRecursion(options) : "";
    if (url) return url;
    return options.coverUrl || options.coverImgUrl || options?.["al"]?.["picUrl"] || "";
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

export function musicResultDetail(data: Object | musicDetail) {
  if (isType(data) !== "Object" || Object.keys(data).length <= 0) {
    return undefined;
  }

  //@ts-ignore
  if (data.isMusicDetail) {
    return data;
  }

  const options = new resultOptions(data);
  return new musicDetail(options);
}
