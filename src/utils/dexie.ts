//@ts-nocheck
import Dexie, { Table } from "dexie";
import { isType } from "./methods";

import type { musicDetail } from "./musicDetail";

interface TABLEDETAIL {
  data: musicDetail;
  updateTime: number;
}

type RETPROMISE<T> = Promis<T>;

interface RESOLVERESTURN {
  deleteData: (mids: number[]) => RETPROMISE<number>;
  search: (mid: number) => RETPROMISE<TABLEDETAIL[]>;
  addData: (data: TABLEDETAIL | TABLEDETAIL[]) => RETPROMISE<void>;
  deleterCollAll: () => RETPROMISE<void>;
  updateData: (key: number | string, data: TABLEDETAIL) => RETPROMISE<number>;
}
class DexieInstance extends Dexie {
  musicInfo!: Table<TABLEDETAIL>;

  constructor() {
    super("musicData");

    this.version(1).stores({
      musicInfo: "++mid,data,updateTime",
    });
  }

  onClose() {
    this.close();
  }
}

async function createDexie(): Promise<RESOLVERESTURN> {
  let db: DexieInstance = null;

  if (window.db) {
    db = window.db;
  } else {
    db = new DexieInstance();
    window.db = db;
  }

  await db.open();

  return new Promise((resolve) => {
    db.transaction("rw", db.musicInfo, async () => {
      try {
        async function deleteData(mids: number[]) {
          return await db.musicInfo.where("mid").anyOf(mids).delete();
        }

        async function search(mid: number) {
          return await db.musicInfo.where({ mid }).toArray();
        }

        async function deleterCollAll() {
          return await db.musicInfo.delete();
        }

        async function addData(data: TABLEDETAIL | TABLEDETAIL[]) {
          const tables = await db.musicInfo.toArray();
          const tableData = [];

          console.log(tables);

          if (Array.isArray(data)) {
            tableData.push(
              ...data.filter((data) => !tables.some((table) => table.data.id === data.data.id))
            );
          } else {
            const isExist = tables.some((table) => {
              return table.data.id === data.data.id;
            });

            if (!isExist) {
              tableData.push((data.data = JSON.stringify(data.data)));
            }
          }

          if (!tableData.length) {
            return;
          }

          return await db.musicInfo.bulkAdd(tableData);
        }

        async function updateData(key: number | string, data: TABLEDETAIL) {
          return await db.musicInfo.update(key, data);
        }

        resolve({
          deleteData,
          search,
          addData,
          deleterCollAll,
          updateData,
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
}

export default createDexie;
