export class mittCommonFn {
  private map: Map<string, (any?: any) => void>;
  constructor() {
    this.map = new Map();
  }

  setMittMap(key: string, fn: Function) {
    this.map.set(key, fn);
  }

  removeMittMapKey(key: string) {
    return this.map.delete(key);
  }

  getMittMapFn(key: string) {
    return this.map.get(key);
  }
}
