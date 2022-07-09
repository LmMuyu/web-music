import { Dexie, Table, Transaction } from "dexie";
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

function dexieTransaction(): Promise<Transaction> {
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
      const collection = table.where("mid").equals(mid);

      return {
        collection,
        has: !!(await collection.toArray()).length,
      };
    }

    async function put(
      mid: number,
      songinfo: musicDetail,
      putlists?: musicDetail[],
      bulk?: boolean
    ) {
      if (mid) {
        const { has } = await idWhere(mid);
        if (has) return;
      }

      if (bulk) {
        const songlists = await getAllSong();

        const filterlists = putlists.filter((song) => {
          const res = songlists.find((md) => md.mid === song.id);
          return res ? false : true;
        });

        const puts = filterlists.map((value) => ({
          mid: value.id,
          songinfo: value,
        }));

        return puts.forEach((song) => table.put(song));
      } else {
        return table.put({ mid, songinfo });
      }
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

    function tableDelete() {
      dexieMusiclist.delete();
    }

    async function setFirst(detele: musicDetail) {
      await deleteCount(detele.id);
      return put(detele.id, detele);
    }

    async function deleteCount(ids: number | number[]) {
      const deleteCounts = await table.where("mid").anyOf(ids).delete();
      return deleteCounts;
    }

    return {
      put,
      last,
      first,
      getAllSong,
      deleteCount,
      tableDelete,
      setFirst,
    };
  } catch (error) {
    console.log(error);
  }
}
