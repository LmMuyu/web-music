import { isRef, Ref, shallowRef } from "vue";

interface StateOptions {
  x: number;
  y: number;
  mx: number;
  my: number;
  width: number;
  maxX: number;
  maxY: number;
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
      mx: 0,
      my: 0,
      width: 0,
      maxX: 0,
      maxY: 0,
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
      setModelComp(state: StateOptions, data?: Ref<any>) {
        const isref = isRef(state.modelComp);
        console.log(isref);

        if (isref) {
          state.modelComp.value = null;
        } else {
          state.modelComp.value = data;
        }
      },
    };
  }

  private crateGetters() {
    return {
      getPosInfo: (state: StateOptions) => state,
      getModelComp: (state: StateOptions) => state.modelComp,
    };
  }
}

export default maintags;
