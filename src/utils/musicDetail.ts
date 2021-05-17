export interface MusicDetailOption {
  id: number;
  name: string;
  picUrl: string;
  ar: Singer;
}

export interface Singer {
  id: number;
  name: string;
}

type singerArr = Array<Singer>;

class singer {
  id: number;
  name: string;

  constructor(list: singerArr) {
    const { id, name } = this.singerInfo(list);

    this.id = id;
    this.name = name;
  }
  singerInfo(list: singerArr) {
    return {
      id: 1,
      name: list.map((singer) => singer.name).join("/"),
    };
  }
}

export class musicDetail {
  id: number;
  name: string;
  picUrl: string;
  singer: Record<string, any>[];
  singerInfo: singer;

  constructor(options: MusicDetailOption) {
    const { id, name, picUrl, ar } = this.runMusicDetail(options);

    this.id = id;
    this.name = name;
    this.picUrl = picUrl;
    this.singer = ar;
    this.singerInfo = new singer(ar);
  }

  runMusicDetail(options: Record<string, any>) {
    const detail = options[0];

    return { ...detail.al, ar: detail.ar };
  }
}
