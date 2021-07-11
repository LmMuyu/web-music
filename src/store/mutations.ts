import { findLoginInfo } from "./methods";

import type { State } from "./type";
import type { MusicDetailOption } from "../utils/musicDetail";

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },

  setMusicInfo(store: State, musicInfo: MusicDetailOption) {
    store.musicInfo = musicInfo;
  },

  setLocalStorage(state: State) {
    state.userInfo = findLoginInfo();
  },
};
