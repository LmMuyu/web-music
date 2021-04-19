export function isType(type: any) {
  return Object.prototype.toString.call(type).match(/\[object (.*)\]/)?.[1]!;
}
