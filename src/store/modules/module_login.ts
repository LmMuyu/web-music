import { getMusicDetail } from "../../api/playList";
import mitt, { Emitter } from "mitt";

enum watchType {
  STOPWATCH = "stopwatch",
}

interface WATCHFNOPTIONS {
  stopWatchFnLists: Emitter;
  runFn: (iswatchbc: boolean) => void;
}

export interface STATETYPE {
  ids: number[];
  islogin: boolean;
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
        runFn: null,
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

      setWatchFn(state: STATETYPE, watch: Pick<WATCHFNOPTIONS, "runFn">) {
        state.watch.runFn = watch.runFn;
      },

      pushWatchFn(state: STATETYPE, mittops: [watchType, () => void]) {
        state.watch.stopWatchFnLists.off(mittops[0], mittops[1]);
      },

      emitTypeWatchFn(state: STATETYPE, type: watchType) {
        state.watch.stopWatchFnLists.emit(type);
      },
    };
  }

  private createActions() {
    return {
      async getlinke(state: any, linkesId: number[]) {
        const ids = linkesId.splice(0, 12).join(",");
        const linkes = (await getMusicDetail(ids)).data;
      },

      runWatchFn(state: { state: STATETYPE }, argvs: [(value: any) => void, boolean]) {
        const _resolve = argvs[0];

        let timer = setInterval(() => {
          const watchRunFn = state.state.watch.runFn;

          if (watchRunFn !== null) {
            watchRunFn(argvs[1]);
            _resolve(true);

            clearInterval(timer);
            timer = null;
            console.log("store->module_login->runWatchFn");
          }
        }, 100);
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
