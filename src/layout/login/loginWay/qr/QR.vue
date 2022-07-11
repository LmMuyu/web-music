<template>
  <div class="h-full flex items-center justify-center">
    <el-image class="w-44 h-44" :src="qrbase64img"></el-image>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { getQrKey, checkStatus, getQrCreate } from "../../../../api/login/qrCodeLogin";
import { ElImage } from "element-plus";

const qrbase64img = ref("");
let unikey = null;

getQrKey()
  .then((res) => {
    unikey = res.data.data.unikey;
    if (unikey) {
      return getQrCreate(unikey);
    }
    return Promise.reject();
  })
  .then((res) => {
    const qrimg = res.data.data.qrimg;

    if (qrimg) {
      qrbase64img.value = qrimg;
      // checkTimeoutQr();
    }
  })
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
    // console.log(res);

    clearTime();
    checkTimeoutQr();
  }, 1000);
}

onUnmounted(() => {
  console.log("clear");
  clearTime();
});
</script>
<style scoped lang="scss"></style>
