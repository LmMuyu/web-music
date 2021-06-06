import { componentId } from "./component";

let comname = "Toplist";
export function showComponent(name: string) {
  if (comname === name) return;
  switchComName(name);
  comname = name;
}

function switchComName(comname: string) {
  
}
