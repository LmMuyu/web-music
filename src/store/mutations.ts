import type { PlayAudioInfo, State } from "./type";
import type { MusicDetailOption } from "../utils/musicDetail";
import type { RouteLocationNormalized } from "vue-router";
import { isRef } from "vue";

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

  pubMitt(state: State, playload) {
    state.unmountList.on(playload[0], playload[1]);
  },

  subUnmountList(state: State, subtype: string, callback: Function, ...args: any) {
    state.unmountList.emit(subtype, [callback, args]);
  },

  subMitt(state: State, args: any) {
    state.unmountList.emit(args[0], args[1]);
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

  setMainHidden(state: State, playload) {
    state.mainHidden = playload;
  },

  setControlAudioCompIf(state: State, playload: boolean) {
    state.controlAudioCompIf = playload;
  },

  setPathScrollMap(state: State, playload: [string, Record<"x" | "y", number>]) {
    state.scrollMap.set(playload[0], playload[1]);
  },
};
