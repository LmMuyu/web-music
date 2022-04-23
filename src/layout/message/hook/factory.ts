import filterDate from "../../../utils/filterDate";
import { LetterMes } from "../type";

export class FocusTheUser {
  newMsgCount: number;
  lastMsgTime: string;
  userId: number;
  nickname: string;
  lastMsg: LetterMes;
  fromUser: User;
  lastTime: number;
  constructor({ newMsgCount, lastMsgTime, userId, nickname, lastMsg, fromUser }) {
    this.userId = userId;
    this.nickname = nickname;
    this.newMsgCount = newMsgCount;
    this.lastTime = lastMsgTime;
    this.lastMsgTime = filterDate(lastMsgTime, null, true);
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
