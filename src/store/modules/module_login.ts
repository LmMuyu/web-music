import { getMusicDetail } from "../../api/playList";
import mitt, { Emitter } from "mitt";
import { ActionTree } from "vuex";
import { computed, watchEffect } from "vue";

enum watchType {
  STOPWATCH = "stopwatch",
}

interface WATCHFNOPTIONS {
  stopWatchFnLists: Emitter;
  watchLoginFn: (iswatchbc: boolean) => void | null;
}

export interface STATETYPE {
  ids: number[];
  islogin: true | false;
  userdata: Object;
  linkes: Record<string, any>[];
  initStatus: Boolean;
  watch: WATCHFNOPTIONS;
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
    return {
      ids: [],
      islogin: null,
      userdata: {},
      linkes: [],
      handleCountWmap: new WeakMap(),
      initStatus: false,
      watch: {
        stopWatchFnLists: mitt(),
        watchLoginFn: null,
      },
    };
  }

  private createMutations() {
    return {
      switchStatus(state: STATETYPE, status: boolean) {
        state.islogin = status;
      },

      setUserInfo(state: STATETYPE, data: Object) {
        state.userdata = data;
      },

      setInitStatus(state: STATETYPE) {
        state.initStatus = true;
      },

      setLinkes(state: STATETYPE, { ids, linkes }) {
        state.linkes.push(...linkes);
      },

      setWatchFn(state: STATETYPE, watchLoginFn) {
        if (typeof watchLoginFn !== "function") return;

        state.watch.watchLoginFn = watchLoginFn;
      },

      pushWatchFn(state: STATETYPE, mittops: [watchType, () => void]) {
        state.watch.stopWatchFnLists.off(mittops[0], mittops[1]);
      },

      emitTypeWatchFn(state: STATETYPE, type: watchType) {
        state.watch.stopWatchFnLists.emit(type);
      },
    };
  }

  private createActions(): ActionTree<STATETYPE, any> {
    return {
      dispatchWatchFn(state, argvs: [(value: unknown) => void, boolean]) {
        const _resolve = argvs[0];
        const fn = () => state.state.watch.watchLoginFn;
        const watchRunFn = computed(() => fn());

        const stop = watchEffect(() => {
          if (watchRunFn.value !== null) {
            watchRunFn.value(argvs[1]);
            _resolve(stop());
          }
        });
      },
    };
  }

  private createGetters() {
    return {
      getUserData: (state: STATETYPE) => () => state.userdata,
      getLLinkesLen: (state: STATETYPE) => state.linkes.length,
      getInitStatus: (state: STATETYPE) => state.initStatus,
      getLLinkes: (state: STATETYPE) => () => state.linkes,
      getIslogin: (state: STATETYPE) => state.islogin,
      getIds: (state: STATETYPE) => state.ids,
    };
  }
}

export default login;
