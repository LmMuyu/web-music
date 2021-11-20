import type { MutationTree } from "vuex";

type DATA = Record<string, number[]>;

interface STATE {
  listIds: DATA;
}

export default class Toplist {
  namespaced: boolean;
  state: () => STATE;
  mutations: MutationTree<any>;

  constructor() {
    this.namespaced = true;
    this.state = function () {
      return {
        listIds: {},
      };
    };

    this.mutations = this.createMutations();
  }

  private createMutations() {
    return {
      setListIds(state: STATE, data: DATA) {
        for (const key in data) {
          if (!Object.prototype.hasOwnProperty.call(state.listIds, key)) {
            state.listIds[key] = data[key];
          }
        }
      },
    };
  }
}
