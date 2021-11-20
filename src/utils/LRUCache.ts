export interface NodeAttribute {
  key: any;
  value: any;
  expires: number;
}

class LRUCache {
  private cap: number;
  private catchlist: NodeAttribute[];
  private expires: number;

  constructor(cap = 3, expires: number = 3600) {
    this.cap = cap;
    this.catchlist = [];
    this.expires = expires * 1000;
  }

  private Node(key: any, value: any, expires?: number): NodeAttribute {
    let exp = !expires ? this.expires : expires;

    return {
      key,
      value,
      expires: Date.now() + exp,
    };
  }

  private append(node: NodeAttribute) {
    this.catchlist.push(node);
  }

  private find(key: any, isindex: boolean = false) {
    const findMethods = isindex ? "findIndex" : "find";
    return this.catchlist[findMethods]((catchdata) => catchdata.key == key);
  }

  get(key: any): NodeAttribute | null {
    const conNode = this.find(key);

    if (!conNode) {
      return null;
    } else {
      //判断缓存数据是否过期
      if (typeof conNode !== "number" && this.ifExpires(conNode.expires)) {
        return null;
      }

      const index = this.find(key, true) as number;
      const node = this.remove(index);
      this.append(node);
      return node;
    }
  }

  put(key: any, value: any, expries?: number) {
    const node = this.get(key);

    if (node !== null) {
      const index = this.find(key, true) as number;
      this.remove(index);
      this.append(node);
    } else {
      const node = this.Node(key, value, expries);

      if (this.catchlist.length >= this.cap) {
        this.remove(0);
      }

      this.append(node);
    }

    return node;
  }

  private remove(index: number): NodeAttribute {
    const node = this.catchlist.splice(index, 1);
    return node[0];
  }

  private ifExpires(time: number) {
    return Date.now() > time;
  }

  viewAllCache() {
    return {
      size: this.catchlist.length,
      catchList: this.catchlist,
    };
  }
}

export default LRUCache;
