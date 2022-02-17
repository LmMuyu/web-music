import { Dexie, Table } from "dexie";
import { musicDetail } from "../utils/musicDetail";

interface MusicSong {
  id?: string;
  mid: number;
  songinfo: musicDetail;
}

class musicSongList extends Dexie {
  songlist!: Table<MusicSong>;

  constructor() {
    super("songlist");
    this.version(1).stores({
      songlist: "++id,mid,songinfo",
    });
  }
}

const dexieMusiclist = new musicSongList();

function dexieTransaction() {
  return new Promise((resolve, reject) => {
    dexieMusiclist.transaction("rw", dexieMusiclist.songlist, resolve).catch(reject);
  });
}

export default async function () {
  try {
    const trans = await dexieTransaction();
    const table = dexieMusiclist.songlist;

    async function idWhere(mid: number) {
      if (!(typeof mid === "number")) {
        console.warn(`typeof mid:应该传"number"类型,结果收到为${typeof mid}类型`);
        return;
      }
      const data = await table.where("mid").equals(mid).toArray();

      return !!data.length;
    }

    async function put(mid: number, songinfo: musicDetail) {
      const has = await idWhere(mid);
      if (has) return;

      return table.put({ mid, songinfo });
    }

    async function first() {
      return await table.toCollection().last();
    }

    async function last() {
      return await table.toCollection().first();
    }

    async function getAllSong() {
      return (await table.toArray()).reverse();
    }

    function tableDetele() {
      dexieMusiclist.delete();
    }

    async function deteleCount(ids: number | number[]) {
      const deteleCounts = await table.where("mid").anyOf(ids).delete();
      return deteleCounts;
    }

    return {
      put,
      last,
      first,
      getAllSong,
      deteleCount,
      tableDetele,
    };
  } catch (error) {
    console.log(error);
  }
}
