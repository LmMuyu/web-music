import { State } from "../store/type";

export default {
  getMusicInfo(state: State) {
    return state.musicInfo;
  },
  getGolbalMark(state: State) {
    return state.golbalmark;
  },
};
