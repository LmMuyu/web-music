import filterDate from "../../../utils/filterDate";
import { User } from "./factory";

export default class followLetterInfo {
  reltiveTime: string;
  fromId: number;
  letterMes: Record<string, any>;
  follow: User;
  time: number;
  constructor({ id, time, msg, fromUser }) {
    this.fromId = id;
    this.time = time;
    this.reltiveTime = filterDate(time);
    this.letterMes = JSON.parse(msg);
    this.follow = new User(fromUser);
  }
}
