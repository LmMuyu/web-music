import filterDate from "../../../utils/filterDate";

export class FocusTheUser {
  newMsgCount: number;
  lastMsgTime: string;
  userId: number;
  nickname: string;
  lastMsg: Record<string, any>;
  fromUser: User;
  constructor({ newMsgCount, lastMsgTime, userId, nickname, lastMsg, fromUser }) {
    this.userId = userId;
    this.nickname = nickname;
    this.newMsgCount = newMsgCount;
    this.lastMsgTime = filterDate(lastMsgTime);
    this.lastMsg = JSON.parse(lastMsg);
    this.fromUser = new User(fromUser);
  }
}

export class User {
  avatar: string;
  uid: number;
  nickname: string;
  constructor({ avatarUrl, userId, nickname }) {
    this.avatar = avatarUrl;
    this.uid = userId;
    this.nickname = nickname;
  }
}
