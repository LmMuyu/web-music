import { State } from "../store/type";

export default {
  getMusicInfo(state: State) {
    return state.musicInfo;
  },

  getStatus(state: State) {
    return state.loginState;
  },
};
