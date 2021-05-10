export interface MusicDetailOption {
  id: number;
  name: string;
  picUrl: string;
  ar: singer;
}

interface singer {
  id: number;
  name: string;
}

class singer {
  constructor({ id, name }: singer) {
    this.id = id;
    this.name = name;
  }
}

class musicDetail {
  id: number;
  name: string;
  picUrl: string;
  singerInfo: singer;

  constructor({ id, name, picUrl, ar }: MusicDetailOption) {
    this.id = id;
    this.name = name;
    this.picUrl = picUrl;
    this.singerInfo = new singer(ar);
  }
}

export default musicDetail;
