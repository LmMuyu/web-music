import { Ref } from "@vue/runtime-dom";

interface StateOptions {
  x: number;
  y: number;
  width: number;
  modelComp: Ref<any>;
}

class maintags {
  public state!: StateOptions;
  public mutations: any;
  public getters: any;
  public namespaced: boolean;

  constructor() {
    this.namespaced = true;
    this.state = this.createState();
    this.mutations = this.crateMutations();
    this.getters = this.crateGetters();
  }

  private createState(): StateOptions {
    const state: StateOptions = {
      x: 0,
      y: 0,
      width: 0,
      modelComp: null,
    };

    return state;
  }

  private crateMutations() {
    return {
      setPosInfo(state: StateOptions, posdata: any) {
        for (const key in posdata) {
          if (Object.prototype.hasOwnProperty.call(state, key)) {
            state[key] = posdata[key];
          }
        }
      },
      clearModelComp(state: StateOptions) {
        state.modelComp = null;
      },
    };
  }

  private crateGetters() {
    return {
      getPosInfo: (state: StateOptions) => state,
    };
  }
}

export default maintags;
