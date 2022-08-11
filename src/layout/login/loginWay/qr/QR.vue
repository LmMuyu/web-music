<template>
  <div class="h-full flex items-center justify-center">
    <div class="relative">
      <el-image class="w-44 h-44" :src="qrbase64img"></el-image>
      <div v-if="qrcode === 800" class="make flex items-center justify-center">
        <el-button @click="refreshQr" plain> 点击刷新 </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted, ref, onDeactivated, onActivated } from "vue";
import { useRouter } from "vue-router";

import { setCookie } from "../../../../utils/request/response/result";
import { getQrKey, checkStatus, getQrCreate } from "../../../../api/login/qrCodeLogin";

import { ElImage, ElButton } from "element-plus";
import { useLocalStorage } from "@vueuse/core";

const router = useRouter();
const qrbase64img = ref("");
const qrcode = ref(0);
let unikey = null;

getQrKey()
  .then((res) => {
    unikey = res.data.data.unikey;
    if (unikey) {
      return getQrCreate(unikey);
    }
    return Promise.reject();
  })
  .then(checkCodeQr)
  .catch((err) => {
    console.log(err);
  });

let timer = null;

function clearTime() {
  clearTimeout(timer);
  timer = null;
}

function checkTimeoutQr() {
  timer = setTimeout(async () => {
    const res = await checkStatus(unikey);

    loginQrCode(res.data.code, res.data.message);
    const ch = check(res.data.code, res.data);

    if (ch) return clearTime();

    clearTime();
    checkTimeoutQr();
  }, 5000);
}

function check(code: number, data: any) {
  if (code === 800) {
    //二维码过期
    return true;
  } else if (code === 803) {
    //授权登录成功
    //写入cookie
    setCookie({ cookie: data.cookie });
    useLocalStorage("cookie", data.cookie);
    Promise.resolve().then(() => router.replace("/index"));
    return true;
  } else {
    return false;
  }
}

function loginQrCode(code: number, mes: string) {
  qrcode.value = code;
  console.log(mes);
}

function checkCodeQr(res) {
  const qrimg = res.data.data.qrimg;

  if (qrimg) {
    qrbase64img.value = qrimg;
    checkTimeoutQr();
  }
}

function refreshQr() {
  clearTime();
  getQrCreate(unikey).then(checkCodeQr);
}

onDeactivated(() => {
  console.log("onDeactivated");
  clearTime();
});

onActivated(() => {
  console.log("onActivated");
  checkTimeoutQr();
});

onUnmounted(() => {
  console.log("clear");
  clearTime();
});
</script>
<style scoped lang="scss">
.make {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
