export class PlayList {
  creator: Creator;
  playlistname: number;
  id: number;
  playlistcount: number;
  playlistUrl: string;
  constructor(playlist: any) {
    this.id = playlist.id;
    this.playlistname = playlist.name;
    this.creator = new Creator(playlist.creator);
    this.playlistcount = playlist.trackCount;
    this.playlistUrl = playlist.coverImgUrl;
  }
}

class Creator {
  nickname: string;
  userId: number;
  constructor(creator: any) {
    this.nickname = creator.nickname;
    this.userId = creator.userId;
  }
}

export class User {
  avatarUrl: string;
  userId: number;
  nickname: string;
  gender: 1 | 2;
  constructor(user: any) {
    this.avatarUrl = user.avatarUrl;
    this.userId = user.userId;
    this.nickname = user.nickname;
    this.gender = user.gender;
  }
}
