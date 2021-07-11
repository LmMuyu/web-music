import { reactive } from "@vue/reactivity";

import { useLocalStorage } from "../utils/useLocalStorage";

import type { State, UserInfo } from "./type";
import type { MusicDetailOption } from "../utils/musicDetail";

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },

  setMusicInfo(store: State, musicInfo: MusicDetailOption) {
    store.musicInfo = musicInfo;
  },
};
