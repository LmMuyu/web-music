interface TRID_NODE {
  next: TRID_NODE;
  isEnd: boolean;
}

function createNode() {
  return {
    next: Object.create(null),
    isEnd: false,
  };
}

class Trid {
  private root: { next: TRID_NODE; isEnd: boolean };

  constructor() {
    this.root = createNode();
  }

  insert(world: string) {
    if (!world) return;

    let node = this.root;
    for (let i = 0; i < world.length; i++) {
      if (world[i] !== " ") {
        if (!node.next[world[i]]) {
          node.next[world[i]] = createNode();
        }
      } else {
        break;
      }

      node = node.next[world[i]];
    }

    node.isEnd = true;
    return true;
  }

  search(world: string, retNodeTree: boolean = false) {
    if (!world) return;
    let node = this.root;

    for (let i = 0; i < world.length; i++) {
      if (node.next[world[i]]) {
        node = node.next[world[i]];
      } else {
        return false;
      }
    }

    return retNodeTree ? node : node.isEnd;
  }

  deepSearch(world: string) {
    const nodeTree = this.search(world, true) as Record<string, any>;
    const searchResList = [];

    function deep(tree: Record<string, any>, texts: string) {
      if (tree.isEnd) {
        searchResList.push({
          color: "rgb(116, 185, 255)",
          world,
          resworld: texts,
        });
      }

      Object.keys(tree.next).forEach((str) => {
        deep(tree.next[str], (texts += str));
      });
    }

    deep(nodeTree, "");

    return searchResList;
  }

  retTrid() {
    return this.root;
  }
}

export default Trid;
