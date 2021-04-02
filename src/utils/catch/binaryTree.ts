interface NEWNODE {
  key: number;
  expried: number;
  value: string;
  left: NEWNODE | null;
  right: NEWNODE | null;
}

export interface BINARYTREE {
  root: NEWNODE | null;
  get: (key: number) => false | NEWNODE | undefined;
  set: (key: number, expried: number, value: string) => void;
  remove: (key: number) => boolean | undefined;
  whileFor: (node: NEWNODE, id: number, expried: number, data: any) => void;
  createNewNode: (key: number, expried: number, data: string) => NEWNODE;
}

export class binaryTree implements BINARYTREE {
  root: NEWNODE | null;

  constructor(key: number, expried: number, value: string) {
    this.root = this.createNewNode(key, expried, value);
  }

  get(key: number) {
    if (this.root === null) return;

    let current: NEWNODE | null = this.root;

    while (key !== current?.key) {
      if (key < current?.key!) {
        current = current?.left!;
      } else {
        current = current?.right!;
      }

      if (current === null || current === undefined) {
        return false;
      }
    }

    return current;
  }

  set(key: number, expried: number, value: string) {
    if (!this.root) {
      this.root = this.createNewNode(key, expried, value);
      return;
    }

    const root = this.root;

    this.whileFor(root, key, expried, value);
  }

  remove(key: number) {
    if (this.root === null) return;

    let current: NEWNODE | null = this.root; //要删除的节点
    let prent: NEWNODE | null = this.root; //current 的父节点
    let isLeftChild = true;

    while (current.key !== key) {
      prent = current;

      if (key < current.key) {
        isLeftChild = true;
        current = current.left;
      } else {
        isLeftChild = false;
        current = current.right;
      }

      if (current === null) return false;
    }

    if (current.left && current.right) {
      if (current === this.root) {
        this.root = null;
      } else if (isLeftChild) {
        prent.left = null;
      } else {
        prent.right = null;
      }
    } else if (current.left === null) {
      if (current === this.root) {
        this.root = current.right;
      }
      if (isLeftChild) {
        prent.left = current.right;
      } else {
        prent.right = current.right;
      }
    } else if (current.right === null) {
      if (current === this.root) {
        this.root = current.left;
      } else if (isLeftChild) {
        prent.left = current.left;
      } else {
        prent.right = current.left;
      }
    } else {
      const successor = this.getSuccessor(current); //找后继节点

      if (current === this.root) {
        this.root = successor;
      }

      successor.left = current.left;
    }

    return true;
  }

  private getSuccessor(deleteNode: NEWNODE) {
    let successorParent = deleteNode; //后继节点的父节点
    let successor = deleteNode; //后继节点
    let current = deleteNode.right; //当前节点

    while (current !== null) {
      successorParent = successor;
      successor = current;
      current = current.left;
    }

    if (successor !== deleteNode.right) {
      successorParent.left = successor.right;
      successor.right = deleteNode.right;
    }

    return successor;
  }

  whileFor(node: NEWNODE, id: number, expried: number, data: any) {
    if (id < node.key) {
      if (node.left === null) {
        node.left = this.createNewNode(id, expried, data);
      } else {
        this.whileFor(node.left, id, expried, data);
      }
    } else {
      if (node.right === null) {
        node.right = this.createNewNode(id, expried, data);
      } else {
        this.whileFor(node.right, id, expried, data);
      }
    }
  }

  createNewNode(key: number, expried: number, data: string) {
    class newNode implements NEWNODE {
      key: number;
      expried: number;
      value: string;
      left: NEWNODE | null;
      right: null;

      constructor(key: number, expried: number, value: string) {
        this.key = key;
        this.value = value;
        this.expried = expried;
        this.left = null;
        this.right = null;
      }
    }
    return new newNode(key, expried, data);
  }
}
