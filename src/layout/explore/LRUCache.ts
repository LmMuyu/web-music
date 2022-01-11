interface NODE {
  key: any;
  value: any;
  next: NODE;
  prev: NODE;
}

export default class LRU {
  private size: number;
  private head: NODE | null;
  private tail: NODE | null;
  private map: Map<any, NODE>;
  constructor() {
    this.size = 3;
    this.map = new Map();
    this.head = null;
    this.tail = null;
  }

  private node(key: any, value: any) {
    return {
      key,
      value,
      next: null,
      prev: null,
    };
  }

  private appendHead(node: NODE) {
    if (this.head === null) {
      this.head = this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
  }

  put(key: any, value: any) {
    const node = this.map.get(key);

    if (node) {
      const newnode = this.node(key, value);
      this.remove(node);
      this.appendHead(newnode);
      this.map.set(key, newnode);
    } else {
      const newnode = this.node(key, value);

      if (this.map.size >= this.size) {
        console.log("remove");
        this.remove(this.tail);
        console.log(this.tail.key);
        this.map.delete(this.tail.key);
        this.appendHead(newnode);
        this.map.set(key, newnode);
      } else {
        console.log("append");
        this.appendHead(newnode);
        this.map.set(key, newnode);
      }
    }
  }

  get(key: any) {
    const node = this.map.get(key);

    if (!node) {
      return -1;
    } else {
      this.remove(node);
      this.appendHead(node);
      return node;
    }
  }

  private remove(node: NODE) {
    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else if (node === this.head) {
      const nextnode = this.head.next;
      nextnode.prev = null;
      this.head = nextnode;
      node.next = null;
    } else if (node === this.tail) {
      const prevnode = this.tail.prev;
      prevnode.next = null;
      this.tail = prevnode;
      node.prev = null;
    } else {
      this.head.next = this.tail;
      this.tail.prev = this.head;
      node.prev = node.next = null;
    }
  }

  get mapAllData() {
    return Array.from(this.map.values());
  }

  get toviewCache() {
    return this.head;
  }
}
