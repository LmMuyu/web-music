<template>
  <article class="flex justify-center items-center h-3/4">
    <div class="px-4">
      <img
        src="https://s2.music.126.net/style/web2/img/qr_guide.png?0ddbd359a12507dd562b38c0ebef72fc"
        width="140"
        height="140"
        draggable="false"
      />
    </div>
    <div class="w-52 flex flex-col" style="height: 245.55px">
      <p class="text-center text-2xl">扫码登录</p>
      <div class="w-52 h-52 relative">
        <img :src="qrBase64" class="h-full w-full" draggable="false" />
        <Expired :qrexpired="qrexpired" />
      </div>
    </div>
  </article>
  <footer style="height: 12.499%" class="flex items-center justify-center">
    <ElButton round @click="otherLogin">选择其它方式登录</ElButton>
  </footer>
</template>
<script setup lang="ts">
const Expired = defineAsyncComponent(() => import("../components/Expired.vue"));
import { defineAsyncComponent, defineEmit, ref } from "@vue/runtime-dom";
import { ElButton } from "element-plus";
import { STATUS } from "../enum";
import {
  getQrKey,
  getQrCreate,
  checkStatus,
} from "../../../api/login/qrCodeLogin";

const ctxEmit = defineEmit(["onOther"]);

const qrBase64 = ref("");
const qrexpired = ref(false);

getQrKey({
  url: "/login/qr/key",
}).then(({ data }) => {
  const unikey = data.data.unikey;

  QrCreate(unikey);
});

function QrCreate(key: string) {
  getQrCreate({
    url: "/login/qr/create",
    params: {
      qrimg: "base64",
      key,
    },
  }).then(({ data: { data: qrimg } }) => {
    qrBase64.value = qrimg.qrimg;

    // checkLoginStatus(key);
  });
}

async function checkLoginStatus(key: string) {
  // let times;

  // //防止用户扫二维码多次
  // if (!times) return;

  // times = setInterval(async () => {
  //   const checkRes = await checkStatus({
  //     url: "/login/qr/check",
  //     params: { key },
  //   });

  //   const {
  //     data: { code },
  //   } = checkRes;

  //   console.log(checkRes);

  //   loginReslutDealWith(code);
  // }, 5000);

  const socket = io("http://127.0.0.1:3000/login/qr/check");

  socket.on("connect", () => {});

  // handle the event sent with socket.send()
  socket.on("message", (data: any) => {
    console.log(data);
  });
}

function loginReslutDealWith(code: number) {
  switch (code) {
    case STATUS.EXPIRED:
      qrexpired.value = true;
      break;
    case STATUS.WAIT:
      break;
    case STATUS.TODECONFIRMED:
      break;
    case STATUS.RESLUT:
      break;
    default:
      return;
  }
}

function otherLogin() {
  ctxEmit("onOther");
}
</script>
<style lang="scss" scoped></style>
