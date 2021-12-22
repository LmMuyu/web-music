import { getMusicDetail } from "../../api/playList";
import { findLoginInfo } from "../methods";

export interface STATETYPE {
  ids: number[];
  islogin: boolean;
  userdata: Object;
  linkes: Record<string, any>[];
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
      islogin: localStorage.getItem("token") ? true : false,
      userdata: {},
      linkes: [],
      handleCountWmap: new WeakMap(),
    };
  }

  private createMutations() {
    return {
      switchStatus(state: STATETYPE, status: boolean) {
        state.islogin = status;
      },

      setUserInfo(state: STATETYPE, data: Object) {
        state.userdata = data;
        console.log(state.userdata);
      },

      findInfo(state: STATETYPE) {
        state.userdata = findLoginInfo();
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
      getUserData: (state: STATETYPE) => () => state.userdata,
      getIslogin: (state: STATETYPE) => state.islogin,
      getLLinkes: (state: STATETYPE) => () => state.linkes,
      getIds: (state: STATETYPE) => state.ids,
    };
  }
}

export default login;
