import { isRef, Ref } from "vue";
import { ActionTree, MutationTree, StoreOptions } from "vuex";

interface EXPLORESTATE {
  activeRef: Ref<boolean>;
}

export default class explore implements StoreOptions<EXPLORESTATE> {
  public namespaced?: boolean;
  public actions?: ActionTree<EXPLORESTATE, EXPLORESTATE>;
  public state?: EXPLORESTATE | (() => EXPLORESTATE);
  public mutations?: MutationTree<EXPLORESTATE>;

  constructor() {
    this.namespaced = true;
    this.state = this.createState();
    this.mutations = this.createMutations();
  }

  private createState(): EXPLORESTATE {
    return {
      activeRef: null,
    };
  }

  private createMutations() {
    return {
      setActiveRef(state: EXPLORESTATE, ref: Ref<boolean>) {
        if (isRef(ref)) {
          state.activeRef = ref;
        }
      },

      transformRef(state: EXPLORESTATE) {
        if (state.activeRef !== null) {
          state.activeRef = null;
        }
      },
    };
  }
}
