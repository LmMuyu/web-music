import dexie from "dexie";

const db = new dexie("musiclistinfo");
db.version(1).stores({
  musicinfos: "++id,data,time",
});
