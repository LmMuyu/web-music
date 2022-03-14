type RETTYPE = "Array" | "String" | "Object" | "Number" | "Null" | "Boolean" | "Undefined";

export function isType(type: any): RETTYPE {
  return Object.prototype.toString.call(type).match(/\[object (.+)\]/)?.[1]!;
}
