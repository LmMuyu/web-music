import type { MutationTree, GetterTree } from "vuex";
import type { musicDetail } from "../../utils/musicDetail";

type DATA<T = string> = Record<string, T>;

interface STATE {
  listMaps: Map<number, Readonly<DATA>>;
  lsits: musicDetail[];
  enterTag: string;
}

export default class Toplist {
  namespaced: boolean;
  state: () => STATE;
  mutations: MutationTree<any>;
  getters: GetterTree<any, any>;

  constructor() {
    this.namespaced = true;
    this.state = function () {
      return {
        listMaps: new Map(),
        lsits: [],
        enterTag: "",
      };
    };

    this.mutations = this.createMutations();
    this.getters = this.createGetters();
  }

  private createMutations() {
    return {
      setLists(state: STATE, data: any) {
        if (!state.lsits[data.name]) {
          state.lsits[data.name] = data.data;

          data.data.map((music) => {
            state.listMaps.set(music.id, music);
          });
        }
      },
      setCurrTag(state: STATE, tagname: string) {
        state.enterTag = tagname;
      },
    };
  }

  private createGetters() {
    return {
      retListMaps(state: STATE) {
        return state.listMaps;
      },
      retLists(state: STATE) {
        return state.lsits;
      },
    };
  }
}
