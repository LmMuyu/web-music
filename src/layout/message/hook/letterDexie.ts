// db.ts
import Dexie, { Table } from "dexie";
import followLetterInfo from "./followLetterInfo";

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
      .toArray();
  }

  async setLetterInfoLists(letters: Friend[]) {
    const count = this.friends.bulkPut(letters);
    this.setLastTimes(letters[0].uid, letters[0].lasttime);
    return count;
  }

  setLastTimes(uid: number, lasttime: number) {
    // this.lasttimes.where("uid").equals(uid).modify({lasttimes:})
  }
}
