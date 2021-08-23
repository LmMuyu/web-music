import { reactive, watchEffect, WatchStopHandle } from "vue";
import { ModuleTree } from "vuex";
import mitt, { Emitter, Handler } from "mitt";

export interface STATETYPE {
  mitt: Emitter;
  islogin: boolean;
  userinfo: Object;
  watchStop: WatchStopHandle;
}

const modules: ModuleTree<any> = {
  login: {
    namespaced: true,
    state: function (): STATETYPE {
      const store = reactive({
        mitt: mitt(),
        islogin: false,
        userinfo: {},
        watchStop: () => {},
      });

      store.watchStop = watchUserInfo(store)();

      return store;
    },
    actions: {},
    mutations: {
      switchStatus(state: STATETYPE, status: boolean) {
        state.islogin = status;
      },

      setUserInfo(state: STATETYPE, data: Object) {
        state.userinfo = data;
      },

      onMittEvent(state: STATETYPE, Fn: Handler<Function>) {
        state.mitt.on("login", Fn);
      },
    },
    getters: {
      getUserInfo: (state: STATETYPE) => state.userinfo,
      watchStop: (state: STATETYPE) => state.watchStop,
    },
  },
};

const watchUserInfo = (store: STATETYPE) => {
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
};

export default modules;
