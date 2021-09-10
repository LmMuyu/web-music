import { watchEffect, WatchStopHandle } from "@vue/runtime-dom";

interface StateOptions {
  x: number;
  y: number;
  mainheight: number;
  mainwidth: number;
  cardheight: number;
  cardwidth: number;
  watchStop: WatchStopHandle;
}

class maincard {
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
      cardheight: 0,
      cardwidth: 0,
      mainheight: 0,
      mainwidth: 0,
      watchStop: null,
    };

    state.watchStop = this.createWatchEffect(state)();
    return state;
  }

  private crateMutations() {
    return {
      setPosInfo(state: StateOptions, posdata: any) {
        for (const key in posdata) {
          if (Object.prototype.hasOwnProperty.call(state, key)) {
            console.log(key);

            state[key] = posdata[key];
          }
        }
      },
    };
  }

  private crateGetters() {
    return {
      getPosInfo: (state: StateOptions) => state,
    };
  }

  private createWatchEffect(state: StateOptions) {
    return () =>
      watchEffect(() => {
        const mainheight = state.mainheight;

        console.log(mainheight);
      });
  }
}

export default maincard;
