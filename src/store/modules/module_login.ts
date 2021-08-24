import { reactive, watchEffect, WatchStopHandle } from "vue";
import mitt, { Emitter, Handler } from "mitt";
import { findLoginInfo } from "../methods";

export interface STATETYPE {
  mitt: Emitter;
  islogin: boolean;
  userinfo: Object;
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
    this.actions = {};
    this.mutations = this.createMutations();
    this.getters = this.createGetters();
  }

  private createState() {
    const store = reactive({
      mitt: mitt(),
      islogin: false,
      userinfo: {},
      watchStop: () => {},
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

      onMittEvent(state: STATETYPE, Fn: Handler<Function>) {
        state.mitt.on("login", Fn);
      },

      findInfo(state: STATETYPE) {
        state.userinfo = findLoginInfo();
      },
    };
  }

  private createGetters() {
    return {
      getUserInfo: (state: STATETYPE) => state.userinfo,
      watchStop: (state: STATETYPE) => state.watchStop,
    };
  }

  private watchUserInfo(store: STATETYPE) {
    let list = [];

    return function () {
      return watchEffect(() => {
        const value = store.userinfo;
        const keyList = Object.keys(value);
        const b = keyList.every((v) => list.indexOf(v) > -1);

        if (keyList.length > 0 && !b) {
          list = keyList;

          store.mitt.emit("login", {
            value,
            islogin: store.islogin,
            watchStop: store.watchStop,
          });
        }
      });
    };
  }
}

export default login;
