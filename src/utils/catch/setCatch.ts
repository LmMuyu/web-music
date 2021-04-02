import { isType } from "../../utils/methods";
import { BINARYTREE, binaryTree } from "./binaryTree";

interface DataItem {
  id: number;
  expried: number;
  catchData: string;
}

type Parameter = string | number | Record<string, any>;

class catchObj {
  catch: Record<string, BINARYTREE>;

  constructor() {
    this.catch = {};
  }

  has(url: string) {
    return this.catch.hasOwnProperty(url) ? this.catch[url] : "";
  }

  set(url: string, httpData: DataItem) {
    const { id, expried, catchData } = httpData;
    const catchObj = this.catch[url];

    catchObj
      ? (this.catch[url] = new binaryTree(id, expried, catchData))
      : (catchObj as BINARYTREE).set(id, expried, catchData);
  }

  get(url: string, id: number) {
    const time = new Date().getTime();

    const catchObj = this.catch[url];
    const catchItem = catchObj.get(id);

    if (!catchItem) return false;

    if (time >= catchItem.expried) {
      return false;
    } else {
      return catchItem.value;
    }
  }

  delete(url: string, id: number) {
    const catchObj = this.catch[url];
    catchObj.remove(id);
  }
}

export default function Catch() {
  const theCatch = new catchObj();

  return {
    setCatchItem(
      url: string,
      parameter: Parameter,
      catchData: string,
      expriedStr: string
    ) {
      const catrol = Number(this.expriedTime(expriedStr));
      if (!catrol) return false;

      const expried = new Date().getTime() + catrol * 1000;
      const fromCodeID = this.getCharCodeAt(url, parameter);

      theCatch.set(url, {
        id: fromCodeID,
        expried,
        catchData,
      });
    },

    getCharCodeAt(url: string, parameter: Parameter) {
      const type = isType(parameter);
      let code: string | undefined;

      if (type == "Object") {
        code = spellUrl(url, parameter as Object);
      } else if (type == "String" || type === "Number") {
        code = url + type;
      }

      const codeLen = code?.length!;
      let fromCode: string = "";

      for (let i = 0; i < codeLen; i++) {
        fromCode += code?.charCodeAt(i);
      }

      return Number(fromCode);
    },

    getCatchItem(url: string, parameter: Parameter) {
      const fromCodeID = this.getCharCodeAt(url, parameter);

      return theCatch.get(url, fromCodeID);
    },

    removeCatchItem(url: string, parameter: Parameter) {
      const fromCodeID = this.getCharCodeAt(url, parameter);

      theCatch.delete(url, fromCodeID);
    },

    expriedTime(expriedStr: string): string | undefined {
      return expriedStr.match(/\max-age=['"](.*)['"]/)?.[0];
    },
  };
}

function spellUrl(url: string, parameter: Record<string, any>) {
  let urlEl = url + "?";

  for (const key in parameter as Object) {
    const paramr = key + "=" + parameter[key];
    urlEl += paramr;
  }

  return urlEl;
}
