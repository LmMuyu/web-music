import { Alias } from "vite";
import { fsRead } from "./fs";

export async function setTsconfig(path: string, aliasList: Alias[]) {
  const tsconfigExt = await fsRead(path);
  console.log(JSON.parse(tsconfigExt)["compilerOptions"]["paths"]);
}
