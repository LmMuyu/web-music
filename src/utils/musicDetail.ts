import { ref, Ref, unref, watch } from "vue";
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
  dt: number;
  id: number;
  picUrl: string;
  name: string;
  style: Ref<string>;
  nickName: string;
  rootClass: Ref<string>;
  classStr: Ref<string>;
  isMusicDetail: boolean;
  singer: Record<string, any>[];
  singerInfo: allType<typeSinger>;
  stop: any;

  constructor(options: MusicDetailOption) {
    const { picUrl, ar } = this.runMusicDetail(options);

    this.singer = ar;
    this.nickName = "";
    this.id = options.id;
    this.picUrl = picUrl;
    this.dt = options.dt;
    this.style = ref("");
    this.name = options.name;
    this.classStr = ref("");
    this.rootClass = ref("");
    this.isMusicDetail = true;
    this.singerInfo = this.setSingerInfo(ar);

    this.singerDomString();
    this.watchClassStyle();
  }

  private runMusicDetail(options: Record<string, any>) {
    const detail = options?.[0] || options;

    return { ...(detail?.al || detail), ar: detail.ar };
  }

  private setSingerInfo(dataInfo: any) {
    return isType(dataInfo) === "Array"
      ? (dataInfo as singerArr).map((info) => new singer(info))
      : new singer(dataInfo);
  }

  async singerDomString() {
    const infos = this.singerInfo as singer[];

    const createSpanTag = (next: singer) =>
      `<p class="cursor-pointer text_hover bottom_line ${unref(
        this.classStr
      )}" style="color:#b2bec3;${unref(this.style)}" user-id="${next.id}" >${next.name}</p>`;

    const str = `
      <span class="flex items-center" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;" >
      ${infos.map((next) => createSpanTag(next)).join(" / ")}
      </span>
     `;

    this.nickName = str;
  }

  private watchClassStyle() {
    const that = this;
    this.stop = watch([this.classStr, this.style, this.rootClass], this.singerDomString.bind(that));
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
    this.dt = musicdata?.dt || musicdata.duration || 0;
  }

  picUrlRecursion(album: any) {
    if (Object.keys(album).length === 0) return;
    let test = false;

    for (const key in album) {
      test = /img\d+[x | y]\d+/.test(key);

      if (test) {
        return album[key];
      }
    }

    return album.picUrl ? album.picUrl : "";
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
    const url = options?.album ? this.picUrlRecursion(options?.album) : "";

    if (url) return url;
    return (
      (options.xInfo && getAvatarImage(options.xInfo)) ||
      options.coverUrl ||
      options.coverImgUrl ||
      options?.["al"]?.["picUrl"] ||
      ""
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

export function musicResultDetail(data: Object | musicDetail, source?: Object): musicDetail {
  if (isType(data) !== "Object" || Object.keys(data).length <= 0) {
    return undefined;
  }

  //@ts-ignore
  if (data.isMusicDetail) {
    return data as musicDetail;
  }
  const options = new resultOptions(data);
  const url = source && getAvatarImage(source);

  if (source && url) {
    options.picUrl = url;
  }

  return new musicDetail(options);
}

function getAvatarImage(source) {
  let key = "";
  const isavatar = Object.keys(source).some((value) => {
    const avatarkey = value.match(/img\d+x\d+/);
    if (!!avatarkey) {
      key = avatarkey[0];
    }
    return !!avatarkey;
  });

  return isavatar ? source[key] : undefined;
}
