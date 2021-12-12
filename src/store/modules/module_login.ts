import { reactive, watchEffect, WatchStopHandle } from "vue";
import { getMusicDetail } from "../../api/playList";
import mitt, { Emitter, Handler } from "mitt";
import { findLoginInfo } from "../methods";

export interface STATETYPE {
  mitt: Emitter;
  islogin: boolean;
  userinfo: Object;
  ids: number[];
  linkes: Record<string, any>[];
  watchStop: WatchStopHandle;
}

class login {
  public namespaced: boolean;
  public actions: any;
  public mutations: any;
  public getters: any;
  public state: STATETYPE;

  public constructor() {
    this.namespaced = true;
    this.state = this.createState();
    this.mutations = this.createMutations();
    this.getters = this.createGetters();
    this.actions = this.createActions();
  }

  private createState() {
    const store = reactive({
      mitt: mitt(),
      islogin: !!localStorage.getItem("token") ? true : false,
      userinfo: {},
      ids: [],
      linkes: [],
      watchStop: () => {},
      handleCountWmap: new WeakMap(),
    });

    store.watchStop = this.watchUserInfo(store)();

    return store;
  }

  private createMutations() {
    return {
      switchStatus(state: STATETYPE, status: boolean) {
        state.islogin = status;
      },

      setUserInfo(state: STATETYPE, data: Object) {
        state.userinfo = data;
      },

      onMittEvent(state: STATETYPE, fn: Handler<Function>) {
        state.mitt.on("login", fn);
      },

      findInfo(state: STATETYPE) {
        state.userinfo = findLoginInfo();
      },

      setLinkes(state: STATETYPE, { ids, linkes }) {
        state.ids.push(...ids);
        state.linkes.push(...linkes);
      },
    };
  }

  private createActions() {
    return {
      async getlinke(state: any, ids: number[]) {
        const idlist = ids.splice(0, 12);

        const linkes = await Promise.all(
          idlist.map(async (id) => (await getMusicDetail(String(id))).data)
        );

        state.commit("setLinkes", {
          ids,
          linkes,
        });
      },
    };
  }

  private createGetters() {
    return {
      getUserInfo: (state: STATETYPE) => state.userinfo,
      getIslogin: (state: STATETYPE) => state.islogin,
      watchStop: (state: STATETYPE) => state.watchStop,
      getLLinkes: (state: STATETYPE) => () => state.linkes,
      getIds: (state: STATETYPE) => state.ids,
    };
  }

  private watchUserInfo(store: STATETYPE) {
    let list = [];
    let init = false;

    return function () {
      return watchEffect(() => {
        console.log("login/watchEffect");

        const value = store.userinfo;
        const keyList = Object.keys(value);
        const n = keyList.every((v) => list.indexOf(v) > -1);

        if (keyList.length > 0 && !n) {
          list = keyList;

          store.mitt.emit("login", {
            value,
            islogin: store.islogin,
            watchStop: store.watchStop,
          });
        } else if (init) {
          store.mitt.emit("login", {
            value: {},
            islogin: store.islogin,
            watchStop: store.watchStop,
          });
        }

        init = true;
      });
    };
  }
}

export default login;
