import { mittCommonFn } from "./hooks";

import type { State } from "./type";
import type { MusicDetailOption } from "../utils/musicDetail";
import type { RouteLocationNormalized } from "vue-router";

const mittCommMap = new mittCommonFn();

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

  addMittHandle(state: State, handle: any) {
    const handleKey = handle.key;
    const handleFn = handle.fn;
    state.dialogEditor.on(handleKey, handleFn);
  },

  runMittHandle(state: State, handle: any) {
    const handleKey = handle.key;
    const handleVal = handle.value;
    state.dialogEditor.emit(handleKey, handleVal);
  },

  removeMittKey(state: State, p: any) {
    state.dialogEditor.off(p.key, p.removeHandle);
  },

  bindMitt(state: State, bind: [string, () => void]) {
    const key = bind[0];
    const fn = bind[1];

    state.mitt.on(key, fn);
    mittCommMap.setMittMap(key, fn);
  },

  bindOnceMitt(state: State, bind: [string, (...arg: any) => void]) {
    const key = bind[0];
    const fn = bind[1];

    const proxyFn = new Proxy(fn, {
      apply(target, thisArg, argArray) {
        mittCommMap.removeMittMapKey(key);
        console.log(state.mitt);
        return target(...argArray);
      },
    });

    state.mitt.on(key, proxyFn);
    mittCommMap.setMittMap(key, proxyFn);
  },

  emitMitt(state: State, emitHandle: [string | undefined, any]) {
    const key = emitHandle[0];
    const event = emitHandle[1];
    if (key === "*" || !key) {
      state.mitt.all.forEach((v, k) => state.mitt.emit(k, event));
    } else {
      state.mitt.emit(key, event);
    }
  },

  removeMitt(state: State, key: string) {
    const fn = mittCommMap.getMittMapFn(key);

    if (fn) {
      state.mitt.off(key, fn);
    }
  },
};
