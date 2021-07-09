interface NodeAttribute {
  key: any;
  value: any;
  prev: null | NodeAttribute;
  next: null | NodeAttribute;
}

class LRUCache {
  private cap: number;
  private map: Map<any, NodeAttribute>;
  private head: null | NodeAttribute;
  private tail: null | NodeAttribute;

  constructor(cap = 3) {
    this.cap = cap;
    this.map = new Map();

    this.head = null;
    this.tail = null;
  }

  private Node(key: any, value: any): NodeAttribute {
    return {
      key,
      value,
      prev: null,
      next: null,
    };
  }

  private appendHead(node: NodeAttribute) {
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
  }

  get(key: any): -1 | any {
    const node = this.map.get(key);

    if (!node) {
      return -1;
    } else {
      const res = node.value;
      this.remove(node);
      this.appendHead(node);
      return res;
    }
  }

  put(key: any, value: any) {
    const nodeMap: NodeAttribute | undefined = this.map.get(key);

    if (nodeMap) {
      nodeMap.value = value;
      this.remove(nodeMap);
      this.appendHead(nodeMap);
    } else {
      const node = this.Node(key, value);

      if (this.map.size >= this.cap) {
        this.map.delete(this.tail?.key);
        this.remove(this.tail!);
        // console.log(this.head);
        this.map.set(key, node);
        this.appendHead(node);
      } else {
        this.map.set(key, node);
        this.appendHead(node);
      }
    }
  }

  private remove(node: NodeAttribute) {
    if (this.head == this.tail) {
      this.head = this.tail = null;
    } else {
      if (node == this.head) {
        this.head = this.head.next;
        node.next = null;
      } else if (node == this.tail) {
        this.tail = this.tail.prev;
        node.prev = null;
      } else {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
        node.next = node.prev = null;
      }
    }
  }

  viewAllCache() {
    return {
      doublyLinkedList: this.head,
      map: this.map.entries(),
    };
  }
}

export default new LRUCache();
