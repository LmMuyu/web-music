import { app } from "../../main";

interface COMP {
  name: string;
}

export default function compName(comLists: any[]) {
  if (comLists && comLists.length !== 0) {
    for (let i = 0; i < comLists.length; i++) {
      const compName = (comLists[i] as COMP).name;
      if (!compName) continue;

      app.component(compName, comLists[i]);
    }
  }
}
