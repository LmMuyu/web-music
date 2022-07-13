import { ActionTree } from "vuex";
import { computed, watchEffect } from "vue";
import { follows, userAccount } from "../../api/user";
import { followUser } from "../../api/playervideo";

enum watchType {
  STOPWATCH = "stopwatch",
}

type loginType = "logout" | "login" | "";

interface WATCHFNOPTIONS {
  watchLoginFn: (iswatchbc: boolean) => void | null;
}

export class follow {
  nickname: string;
  uid: number;
  avatar: string;
  constructor({ nickname, userId, avatarUrl }) {
    this.uid = userId;
    this.avatar = avatarUrl;
    this.nickname = nickname;
  }
}

export interface STATETYPE {
  ids: number[];
  islogin: true | false;
  userdata: { data?: Object; type?: loginType };
  linkes: Record<string, any>[];
  initStatus: Boolean;
  watch: WATCHFNOPTIONS;
  follows: follow[];
  userId: number;
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
      userId: 0,
      islogin: null,
      userdata: {},
      follows: [],
      linkes: [],
      handleCountWmap: new WeakMap(),
      initStatus: false,
      watch: {
        watchLoginFn: null,
      },
    };
  }

  private createMutations() {
    return {
      switchStatus(state: STATETYPE, status: boolean) {
        state.islogin = status;
      },

      setUserInfo(state: STATETYPE, data: [Object, loginType]) {
        state.userdata = {
          data: data[0],
          type: data[1],
        };
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

      setFollowsLists(state: STATETYPE, lists: follow[]) {
        state.follows.push(...lists);
      },

      setUserId(state: STATETYPE, id: number) {
        state.userId = id;
      },

      setAccount(state: STATETYPE, account) {
        console.log(account);
      },
    };
  }

  private createActions(): ActionTree<STATETYPE, any> {
    return {
      dispatchWatchFn(state, argvs: [(value: unknown) => void, boolean]) {
        const _resolve = argvs[0];
        const fn = () => state.state.watch.watchLoginFn;
        const watchRunFn = computed(() => fn());

        watchEffect(() => {
          if (watchRunFn.value !== null) {
            if (argvs[1] === false) {
              state.commit("setUserInfo", [{}, "logout"]);
            }

            watchRunFn.value(argvs[1]);
            _resolve(true);
          }
        });
      },

      async setFollows(state) {
        //@ts-ignore
        const userInfoOruserId = state.state.userdata?.data || state.state.userId;
        const userFollows = await follows(
          typeof userInfoOruserId === "number"
            ? userInfoOruserId
            : Number((userInfoOruserId as any).userID),
          1
        );
        const followLists = userFollows.data.follow.map((followuser) => new follow(followuser));
        state.commit("setFollowsLists", followLists);
      },

      async follow(state, { uid, backcall }) {
        const islogin = state.state.islogin;
        const follows = state.state.follows;

        if (islogin) {
          const isfollow = follows.findIndex((follow) => follow.uid === uid);
          const resFollow = await followUser(uid, isfollow === -1 ? 1 : 0);
          console.log(resFollow);

          if (resFollow.data.code === 200) {
            // state.commit("setFollowsLists", [uid]);
          }

          backcall?.(resFollow);
        }
      },

      async account(state) {
        // const account = await userAccount();
        // state.commit("setAccount", account.data);
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
      getFollows: (state: STATETYPE) => () => state.follows,
    };
  }
}

export default login;
