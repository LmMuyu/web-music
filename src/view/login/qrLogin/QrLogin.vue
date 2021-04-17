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
        <Expired @click="getQrKey" :qrexpired="qrexpired" />
      </div>
    </div>
  </article>
  <footer style="height: 12.499%" class="flex items-center justify-center">
    <ElButton round @click="otherLogin">选择其它方式登录</ElButton>
  </footer>
</template>
<script setup lang="ts">
const Expired = defineAsyncComponent(() => import("../components/Expired.vue"));
import {
  defineAsyncComponent,
  defineEmit,
  getCurrentInstance,
  onBeforeUnmount,
  ref,
  inject,
} from "@vue/runtime-dom";
import { ElMessage, ElButton } from "element-plus";
import { STATUS } from "../enum";
import observer from "../../../utils/observer/Observer";
import {
  getQrKey,
  getQrCreate,
  checkStatus,
} from "../../../api/login/qrCodeLogin";
import { AxiosResponse } from "axios";

interface LoginData {
  code: number;
  cookie: string;
  message: string;
}

interface CurrComp {
  value: string;
}

const ctxEmit = defineEmit(["onOther"]);
const currentInstanceName = getCurrentInstance()?.type.__file?.match(
  /(\w+)\.vue$/
)?.[1]!;
const qrBase64 = ref("");
const qrexpired = ref(false);
const currComp: CurrComp = inject("currCompId")!;

onBeforeUnmount(() => {
  observer.off(currentInstanceName);
});

//获取二维码key
getQrKey({
  url: "/login/qr/key",
}).then(({ data }) => {
  const unikey = data.data.unikey;

  QrCreate(unikey);
});

//获取二维码图片
function QrCreate(key: string) {
  getQrCreate({
    url: "/login/qr/create",
    params: {
      qrimg: "base64",
      key,
    },
  }).then(({ data: { data: qrimg } }) => {
    if (!!qrBase64.value) qrBase64.value = "";
    qrBase64.value = qrimg.qrimg;

    checkLoginStatus(key);
  });
}

//轮询二维码检测扫码状态
async function checkLoginStatus(key: string) {
  let times: NodeJS.Timeout | null = null;
  //防止用户扫二维码多次
  if (times) return;

  times = setInterval(async () => {
    if (currComp && currComp.value === "qrlogin") {
      const checkRes = await checkStatus({
        url: "/login/qr/check",
        params: { key },
      });
      const { data }: AxiosResponse<LoginData> = checkRes;
      console.log(data);

      loginReslutDealWith(data.code, times, data.code === 803 ? data : "");
    }
  }, 5000);

  observer.on(currentInstanceName, times);
}

//根据返回的code来选择对应的逻辑
function loginReslutDealWith(
  code: number,
  times: any,
  successData?: LoginData | string
) {
  switch (code) {
    case STATUS.EXPIRED:
      qrexpired.value = true;
      break;
    case STATUS.WAIT:
      break;
    case STATUS.TODECONFIRMED:
      break;
    case STATUS.RESLUT:
      clearTimeout(times);
      times = null;

      Promise.resolve().then(() => {
        if (!!successData && typeof successData !== "string")
          loginResult(successData.cookie);
      });

      if (!!successData && typeof successData !== "string") {
        ElMessage({
          message: successData.message,
          type: "success",
        });
      }

      break;
    default:
      return;
  }
}

function loginResult(cookie: string) {
  qrBase64.value = "";
}

function otherLogin() {
  ctxEmit("onOther", "otherLogin");
}
</script>
<style lang="scss" scoped></style>
