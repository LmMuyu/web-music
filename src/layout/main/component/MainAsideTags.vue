<template>
  <section ref="asidetags" class="h-full">
    <header style="height: 10%" class="flex items-center justify-center">44444</header>
    <main class="h-3/4">
      <MainTag />
    </main>
    <footer ref="footer" class="flex items-center justify-center px-4 pb-4" style="height: 15%">
      <MainAsideCard v-if="loginUserData.tramsformButton" :infoData="loginUserData.userdata" />
      <ButtonEnter v-else-if="windowResize" />
      <AvatarEnter v-else />
    </footer>
  </section>
</template>
<script setup lang="tsx">
import { nextTick, onMounted, ref } from "@vue/runtime-core";
import { computed, inject, onUnmounted, reactive, watchEffect } from "vue";
import { useStore } from "vuex";

import { mainBCBus } from "../../login/useBroadcastChannel";

import { AvatarEnter, ButtonEnter } from "./LoginModule";
import MainAsideCard from "./MainAsideCard.vue";
import MainTag from "./MainTag.vue";

import type { USERINFO } from "../../login/useBroadcastChannel";

const store = useStore();

const asidetags = ref(null);
const footer = ref(null);
const loginUserData = reactive({
  tramsformButton: false,
  userdata: {},
});

const windowResize = inject("windowResize");

store.commit("login/setWatchFn", (islogin) => {
  //登录islogin为true 没登录islogin为false
  if (!islogin) {
    mainBCBus().then(logindata); //接受登录后的用户信息
  } else {
    watchRetUserData().then(logindata); //接受登录后的用户信息
  }
});

function logindata(broadcastChannelData: USERINFO) {
  serLoginUserData(broadcastChannelData);
  watchRetUserData().then(logindata);
}

function serLoginUserData(userdata: USERINFO | { userdata: USERINFO }) {
  //@ts-ignore
  userdata = userdata?.userdata ?? userdata;
  // console.log(userdata);

  loginUserData.tramsformButton = Object.keys(userdata).length > 0 ? true : false;
  loginUserData.userdata = userdata;
}

function watchRetUserData() {
  return new Promise((resolve, reject) => {
    const watchData = computed(() => {
      return store.getters["login/getUserData"]();
    });

    const _resolve = Promise.resolve();

    let stop = watchEffect(() => {
      const storedata = watchData.value;
      console.log(storedata);

      const userdata = storedata.data ?? {};
      const type = storedata.type ?? "";

      //有登录信息
      if (Object.keys(userdata).length > 0 && type && type === "login") {
        resolve(userdata);
        _resolve.then(() => {
          watchData.effect.stop();
          stop();
          stop = null;
        });
        store.commit("login/setUserInfo", [userdata ?? {}, ""]);
        //退出登录
      } else if (type && type === "logout") {
        resolve({});
        _resolve.then(() => {
          watchData.effect.stop();
          stop();
          stop = null;
        });
        store.commit("login/setUserInfo", [userdata ?? {}, ""]);
      }
    });
  });
}

function setButtonStyle() {
  const btn = document.querySelector(".el-button") as HTMLElement;

  if (btn) {
    btn.style.outline = "none";
    btn.classList.add(...["justify-center", "w-1/2"]);
  }
}

function reviseButtonPos() {
  const mainheight = asidetags.value.clientHeight;
  const mainwidth = asidetags.value.clientWidth;

  const cardheight = footer.value.clientHeight;
  const cardwidth = footer.value.clientWidth;

  store.commit("maintags/setPosInfo", {
    x: mainwidth - cardwidth - 8,
    y: mainheight - cardheight,
    width: cardwidth + 16,
  });
}

onMounted(() => {
  nextTick().then(() => {
    reviseButtonPos();
    setButtonStyle();
  });
});

onUnmounted(() => {
  console.log("onUnmounted");
});
</script>
<style scoped lang="scss"></style>
