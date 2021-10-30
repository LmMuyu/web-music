type retType =
  | "String"
  | "Number"
  | "Function"
  | "Array"
  | "Symbol"
  | "Boolean"
  | "Object"
  | "Null"
  | "Undefined";

export function useType(type: any): retType {
  return Object.prototype.toString.call(type).match(/\[object\s(.+)\]/)[1];
}
