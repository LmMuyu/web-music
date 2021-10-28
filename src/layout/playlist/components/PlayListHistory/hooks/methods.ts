export function setRenderDataID(list: any[]) {
  return list.map((value, index) => ({
    ...value,
    key: index,
  }));
}
