import { isRef } from "@vue/runtime-dom";
import { State } from "../store/type";

export default {
  getMusicInfo(state: State) {
    return state.musicInfo;
  },
};
