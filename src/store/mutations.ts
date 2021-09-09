import { findLoginInfo } from "./methods";

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
};
