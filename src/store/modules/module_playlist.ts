import mitt, { Emitter } from "mitt";
import { GetterTree, MutationTree, StoreOptions } from "vuex";
import { MatchItem } from "../../layout/playlist/type";
import { isType } from "../../utils/methods";
import type { musicDetail } from "../../utils/musicDetail";

interface store {
  songinfo: musicDetail | {};
  iconsize: number;
  songId: number;
  playlists: musicDetail[];
  playerFn: (id: number) => void;
  mitt: Emitter;
  lyrics: MatchItem[];
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
      playerFn: null,
      mitt: mitt(),
      lyrics: [],
    };
  }

  private get mutationsmodule(): MutationTree<store> {
    return {
      setSongInfo(state, payload: musicDetail) {
        if (!payload || Object.keys(payload).length === 0) return;
        state.songinfo = payload;
      },

      setSongId(state, id) {
        state.songId = id;
      },

      musiclists(state, lists: musicDetail[]) {
        // console.log(lists);
        if (Array.isArray(lists)) {
          const lids = state.playlists.map((v) => v.id);
          const filterAfterData = lists.filter((m) => lids.indexOf(m.id) === -1);

          state.playlists.push(...filterAfterData);
        }
      },

      thisPlaylistPageSetSongId(state, id: number) {
        if (state.songId === 0 || state.songId !== id) {
          state.songId = id;
        }
      },

      setPlayerFn(state, fn: (id: number) => void) {
        const typefn = isType(fn);

        if (typefn !== "Function" && typefn !== "AsyncFunction") {
          return console.error("要求fn是一个函数，得到的是" + typefn);
        }
        state.playerFn = fn;
      },

      runPlayerFn(state, id: number) {
        state.playerFn && state.playerFn(id);

        if (isType(state.playerFn) === "Null") {
          console.warn("state.playerFn为Null");
        }
      },

      setLyrics(state, lyrics: MatchItem[]) {
        state.lyrics = lyrics;
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

      getLyrics: (state) => state.lyrics,
    };
  }
}
