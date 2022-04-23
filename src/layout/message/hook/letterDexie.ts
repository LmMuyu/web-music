// db.ts
import Dexie, { Table } from "dexie";
import followLetterInfo from "./followLetterInfo";

type Method<T, K extends keyof T> = Omit<T, K>;

export interface Friend {
  uid: number;
  lasttime: number;
  letterinfo: followLetterInfo;
}

export interface LastTime {
  uid: number;
  lasttimes: number[];
}

export default class letterDexie extends Dexie {
  friends!: Table<Friend>;
  lasttimes!: Table<LastTime>;
  uid: number;
  lasttime: number;

  constructor() {
    super("letterContent");
    this.version(1).stores({
      friends: "++lcId,&letter,uid,lasttime,letterinfo",
      lasttimes: "&uid,*lasttimes",
    });

    this.friends = this.table("friends");
    this.lasttimes = this.table("lasttimes");
    this.openDexie();
  }

  async openDexie() {
    return await this.transaction("rw", [this.lasttimes, this.friends], () => {
      console.log("dexie已打开:", this.isOpen());
    });
  }

  async getLetterInfos(uid: number, lastTime: number) {
    return await this.friends
      .where({ uid })
      .and((x) => x.lasttime === lastTime)
      .toArray()
      .then((friends) => friends.map((friend) => friend.letterinfo));
  }

  async setLetterInfoLists(letters: Friend[]) {
    const count = this.friends.bulkPut(letters);

    this.uid = letters[0].uid;
    this.lasttime = letters[0].lasttime;

    this.writeLastTimes();
    return count;
  }

  private async writeLastTimes() {
    const lhas = await this.hasLastTimes(this.uid, this.lasttime);

    if (lhas === undefined) {
      this.setLastTimes(this.uid, this.lasttime);
      return;
    }

    if (!lhas) {
      this.modifyLastTime(this.uid, this.lasttime);
    }
  }

  setLastTimes(uid: number, lasttime: number) {
    return this.lasttimes.put({
      uid,
      lasttimes: [lasttime],
    });
  }

  modifyLastTime(uid: number, lasttime: number) {
    return this.lasttimes
      .where("uid")
      .equals(uid)
      .modify((friend) => {
        friend.lasttimes.push(lasttime);
      });
  }

  async getLastTimes(uid: number) {
    const uidlastTimes = await this.lasttimes.get(uid);
    return uidlastTimes ? uidlastTimes.lasttimes : -1;
  }

  diffPut(uid: number, letterinfos: followLetterInfo[]) {
    this.friends.where({ uid }).each((friend) => {
      console.log(friend);
    });
  }

  private async hasLastTimes(uid: number, lastTime: number): Promise<boolean | undefined> {
    const uidlastTimes = await this.getLastTimes(uid);

    if (uidlastTimes != -1) {
      return uidlastTimes.indexOf(lastTime) !== -1 ? true : false;
    } else {
      return undefined;
    }
  }
}

// //每一个用户的每一页私信的最后时间
// class Lasttimes<T extends Record<string, any>> extends letterDexie {}

// //每个用户的私信信息
// class Friends<T extends Record<string, any>> extends letterDexie {
  
// }
