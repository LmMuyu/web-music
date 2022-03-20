import type { State } from "./type";
import type { MusicDetailOption } from "../utils/musicDetail";
import type { RouteLocationNormalized } from "vue-router";

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },

  setMusicInfo(store: State, musicInfo: MusicDetailOption) {
    store.musicInfo = musicInfo;
  },

  runActiveTagFn<T extends RouteLocationNormalized>(
    state: State,
    parmas: [((to: T) => void)?, T?]
  ) {
    if (state.activeTagFn && parmas[1]) {
      state.activeTagFn(parmas[1]);
      return;
    }

    state.activeTagFn = (parmas[0] && parmas[0]) || (() => {});
  },

  switchGolbalMark(state: State | { circleRef: boolean }) {
    state.circleRef = false;
  },

  setMainTagsShowStatus(state: State, status: boolean) {
    state.mainTagsShow = status;
  },

  pubUnmountList(state: State, pubtype: string, unmount: (...args: any) => any | void) {
    state.unmountList.off(pubtype, (args) => {
      const resvalue = unmount(args[1]);

      if (resvalue) {
        args[0] && args[0](resvalue);
      }
    });
  },

  subUnmountList(state: State, subtype: string, callback: Function, ...args: any) {
    state.unmountList.emit(subtype, [callback, args]);
  },

  navRouterPushRun(state: State) {
    state.navRouterPush();
  },

  setNavRouterPush(state: State, playload: () => any | null) {
    if (typeof playload !== "function" && playload !== null) {
      return console.warn("playload目标是Function给定的是" + typeof playload);
    }

    state.navRouterPush = playload;
  },
};
