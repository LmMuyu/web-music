import { isRef } from "@vue/runtime-dom";
import { State } from "../store/type";

export default {
  getMusicInfo(state: State) {
    return state.musicInfo;
  },

  getMainTagsShow(state: State) {
    return state.mainTagsShow;
  },

  getMainHidden(state: State) {
    return () => state.mainHidden;
  },

  getControlAudioCompIf(state: State) {
    return () => state.controlAudioCompIf;
  },

  getPathScrollMap(state: State) {
    return state.scrollMap;
  },
};
