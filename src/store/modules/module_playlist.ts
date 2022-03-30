import { GetterTree, MutationTree, StoreOptions } from "vuex";
import type { musicDetail as SongInfo } from "../../utils/musicDetail";

interface store {
  songinfo: SongInfo | {};
  iconsize: number;
  songId: number;
  playlists: any[];
}

export default class Playlist implements StoreOptions<store> {
  state?: store | (() => store);
  mutations?: MutationTree<store>;
  getters?: GetterTree<store, store>;
  namespaced: boolean;

  constructor() {
    this.namespaced = true;
    this.mutations = this.mutationsmodule;
    this.getters = this.gettersmodule;
    this.state = this.statemodule;
  }

  private get statemodule(): store {
    return {
      iconsize: 22,
      songinfo: {},
      songId: 0,
      playlists: [],
    };
  }

  private get mutationsmodule(): MutationTree<store> {
    return {
      setSongInfo(state, payload) {
        if (!payload || Object.keys(payload).length === 0) return;
        state.songinfo = payload;
      },

      setSongId(state, id) {
        state.songId = id;
      },

      musiclists(state, lists: any[]) {
        if (Array.isArray(lists)) {
          state.playlists = lists;
        }
      },
    };
  }

  private get gettersmodule(): GetterTree<store, store> {
    return {
      getStoreAll(state) {
        return Object.keys(state).reduce((pre, next) => {
          return (pre[next] = state[next]);
        }, {});
      },

      getSongInfo(state) {
        return () => state.songinfo;
      },

      getIconSize(state) {
        return state.iconsize;
      },

      getSongId(state) {
        return () => state.songId;
      },

      getMusiclists(state) {
        return () => state.playlists;
      },
    };
  }
}
