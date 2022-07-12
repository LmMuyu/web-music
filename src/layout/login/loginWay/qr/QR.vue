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
import { onUnmounted, ref } from "vue";
import { getQrKey, checkStatus, getQrCreate } from "../../../../api/login/qrCodeLogin";
import { ElImage, ElButton } from "element-plus";

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

    loginQrCode(res.data.code);

    if (res.data.code === 800) {
      clearTime();
      return;
    }

    clearTime();
    checkTimeoutQr();
  }, 5000);
}

function loginQrCode(code: number) {
  qrcode.value = code;
  console.log(code);
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
