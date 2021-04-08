<template>
  <div
    class="select bg-white flex flex-col fixed left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 z-50 shadow"
    style="width: 530px; height: 372px"
    :ref="mouse"
  >
    <header class="bg-gray-900 py-3 flex" style="height: 12.499%">
      <div style="width: 50%" class="flex items-center">
        <p class="transform translate-x-2 text-white font-bold text-lg">登录</p>
      </div>
      <div style="width: 50%" class="icon flex items-center justify-end">
        <i
          class="iconfont icondel transform -translate-x-2"
          @click="cancel"
        ></i>
      </div>
    </header>
    <!-- <article class="flex justify-center items-center h-3/4">
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
      <ElButton round>选择其它方式登录</ElButton>
    </footer> -->
    <Signup />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, defineProps, ref } from "vue";
import {
  getQrKey,
  getQrCreate,
  checkStatus,
} from "../../api/login/qrCodeLogin";
import { STATUS } from "./enum";
import { ElButton } from "element-plus";
import mouse from "./api/mouse";
const Expired = defineAsyncComponent(() => import("./components/Expired.vue"));
// const Signup = defineAsyncComponent(() => import("./signup/Signup.vue"));
import Signup from "./signup/Signup.vue";

const props = defineProps({
  cancel: {
    type: Function,
    required: true,
  },
});

const qrBase64 = ref("");
const qrexpired = ref(false);

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
  let times;

  times = setInterval(async () => {
    const checkRes = await checkStatus({
      url: "/login/qr/check",
      params: { key },
    });

    const {
      data: { code },
    } = checkRes;

    console.log(checkRes);

    loginReslutDealWith(code);
  }, 5000);
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

getQrKey({
  url: "/login/qr/key",
}).then(({ data }) => {
  const unikey = data.data.unikey;

  QrCreate(unikey);
});
</script>

<style scoped lang="scss">
.icon {
  @include Iconfont(#f5f6fa, 32);

  & > i {
    cursor: pointer;
  }
}

.shadow {
  box-shadow: 0px 0px 5px #2d3436;
}

.qrexpired {
  background-color: rgba(255, 255, 255, 0.616);
  z-index: 49;
}

.select {
  -webkit-touch-callout: none;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
</style>
