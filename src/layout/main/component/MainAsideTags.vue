<template>
  <section ref="asidetags" class="pl-14 h-full">
    <header style="height: 10%">44444</header>
    <main class="h-3/4">
      <MainTag />
    </main>
    <footer ref="footer" class="flex items-center" style="height: 15%">
      <MainAsideCard v-if="loginUserData.tramsformButton" :infoData="loginUserData.userdata" />
      <MainLoginButton class="flex justify-center outline" v-else />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from "@vue/runtime-core";
import { reactive, watchEffect } from "vue";
import { useStore } from "vuex";

import loginBCBus from "../hooks/useBroadcastChannel";
import useWatch from "../../../utils/useWatch";

import MainLoginButton from "./MainLoginButton.vue";
import MainAsideCard from "./MainAsideCard.vue";
import MainTag from "./MainTag.vue";

const store = useStore();

const asidetags = ref(null);
const footer = ref(null);

const loginUserData = reactive({
  tramsformButton: false,
  userdata: {},
});

store.commit("login/setWatchFn", { runFn: watchOrBus });

function watchOrBus(islogin: boolean) {
  console.log("layout->Main->MainAsideTags->watchOrBus");

  //是否已经登录
  if (!islogin) {
    console.log("layout->Main->MainAsideTags->loginBCBus");
    loginBCBus(false).then(logindata); //接受登录后的用户信息
  } else {
    console.log("layout->Main->MainAsideTags->watchRetUserData");
    watchRetUserData(store.getters["login/getUserData"]()); //接受登录后的用户信息
  }
}

function logindata(bcWatch: { userdata: any; portMess: (data: any) => void }) {
  loginUserData.tramsformButton = true;
  loginUserData.userdata = bcWatch.userdata;
}

function watchRetUserData(watchData: any) {
  const { stopWatch, value } = useWatch(watchData);
  store.commit("login/pushWatchFn", ["stopwatch", stopWatch]);

  watchEffect(() => {
    console.log(value);

    if (value.value) {
      loginUserData.tramsformButton = true;
      loginUserData.userdata = value.value;
    }
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
</script>
<style scoped lang="scss"></style>
