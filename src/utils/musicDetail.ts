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

class singer {
  id: number;
  name: string;

  constructor({ id, name }: Singer) {
    this.id = id;
    this.name = name;
  }
}

export class musicDetail {
  id: number;
  name: string;
  picUrl: string;
  singerInfo: singer;

  constructor(options: MusicDetailOption) {
    const { id, name, picUrl, ar } = this.runMusicDetail(options);

    this.id = id;
    this.name = name;
    this.picUrl = picUrl;
    this.singerInfo = new singer(ar);
  }

  runMusicDetail(options: Record<string, any>): MusicDetailOption {
    const detail = options[0];

    return { ...detail.al, ar: detail.ar[0] };
  }
}
