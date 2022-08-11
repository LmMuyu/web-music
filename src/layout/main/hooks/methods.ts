import { computed, reactive, watchEffect } from "vue";
import store from "../../../store";
import { mainBCBus, USERINFO } from "../../login/useBroadcastChannel";

function watchLoginData() {
  const loginUserData = reactive({
    tramsformButton: false,
    userdata: {},
  });

  function logindata(broadcastChannelData: USERINFO) {
    serLoginUserData(broadcastChannelData);
    watchRetUserData().then(logindata);
  }

  function serLoginUserData(userdata: USERINFO | { userdata: USERINFO }) {
    //@ts-ignore
    userdata = userdata?.userdata ?? userdata;
    loginUserData.tramsformButton = Object.keys(userdata).length > 0 ? true : false;
    loginUserData.userdata = userdata;
  }

  function watchRetUserData() {
    return new Promise((resolve, reject) => {
      const watchData = computed<any>(store.getters["login/getUserData"]);
      const _resolve = Promise.resolve();

      function dispposeUserInfo(userdata: any) {
        resolve(userdata);
        _resolve.then(() => {
          watchData.effect.stop();
          stop();
          stop = null;
        });

        store.commit("login/setUserInfo", [userdata ?? {}, ""]);
      }

      let stop = watchEffect(() => {
        const storedata = watchData.value;
        const userdata = storedata.data ?? {};
        const type = storedata.type ?? "";

        //有登录信息
        if (Object.keys(userdata).length > 0 && type && type === "login") {
          dispposeUserInfo(userdata);
          //退出登录
        } else if (type && type === "logout") {
          dispposeUserInfo({});
        } else {
          // loginUserData.userdata = storedata.data;
          // loginUserData.tramsformButton = true;
        }
      });
    });
  }

  function storeWatchFn(islogin) {
    // console.log(islogin);
    //登录islogin为true 没登录islogin为false
    if (!islogin) {
      mainBCBus().then(logindata); //接受登录后的用户信息
    } else {
      watchRetUserData().then(logindata); //接受登录后的用户信息
    }
  }

  return {
    storeWatchFn,
    loginUserData,
  };
}

export const watchUserData = watchLoginData();
