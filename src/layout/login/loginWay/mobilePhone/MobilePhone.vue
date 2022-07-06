<template>
  <div class="flex flex-col items-center justify-center w-full h-full bg-white">
    <div class="w-auto">
      <InputBox
        ref="phone"
        class="py-2"
        placeholder="手机号"
        :is-icon="true"
        @change="registerChecking"
        v-model="inputLoginInfo.phone"
      />
      <InputBox
        class="py-2"
        ref="pass"
        iconfont="iconmima"
        type="password"
        placeholder="密码"
        v-model="inputLoginInfo.password"
      />
      <div class="py-2 flex flex-col items-center w-full">
        <el-button class="rounded-lg w-full" type="primary" @click="loginBtn">登录</el-button>
        <span class="flex justify-end py-4">
          <a href="javascript:;;" class="text-sm px-4">注册</a>
          <a href="javscript:;;" class="text-sm px-4">忘记密码?</a>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";

import { loginBCBus } from "../../useBroadcastChannel";
import { cellphone, loginCellphone } from "../../../../api/login";
import { promptbox } from "../../../../components/promptBox";

import InputBox from "./components/InputBox.vue";
import { ElButton } from "element-plus";
import { onUnmounted } from "vue";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";

const inputLoginInfo = reactive({
  phone: "",
  password: "",
  isregister: false,
});

let prephone = "";

const phone = ref();
const pass = ref();
const route = useRoute();
const router = useRouter();

const showErrorInfo = (box: any, message: string) => box.value["showErrorInfo"]?.(message);

function checkingInput() {
  let isCheckingRes = true;

  if (!inputLoginInfo.phone.trim().length) {
    showErrorInfo(phone, "请输入手机号码!");
    isCheckingRes = false;
  }

  if (!inputLoginInfo.password.trim().length) {
    showErrorInfo(pass, "请输入密码!");
    isCheckingRes = false;
  }

  return isCheckingRes;
}

async function registerChecking() {
  if (inputLoginInfo.isregister && prephone === inputLoginInfo.phone.trim()) {
    return;
  }

  const formData = new FormData();
  formData.append("phone", inputLoginInfo.phone.trim());
  prephone = inputLoginInfo.phone.trim();

  const result = await cellphone(formData);

  if (!result.data.hasPassword) {
    promptbox({ title: "手机号码未注册!" });
    return;
  }

  inputLoginInfo.isregister = result.data.hasPassword;
}

function loginInfoSetFormData(phone: string, md5: any) {
  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("md5_password", md5);
  return formData;
}

function fanhuigo(route: RouteLocationNormalizedLoaded): boolean | Function {
  const topath = route.query.path;
  const id = route.query.id;

  if (topath && id) {
    return router.replace.bind(router, {
      path: topath as string,
      query: { id },
    });
  }

  return false;
}

async function loginBtn() {
  const isCheckRes = checkingInput();

  if (inputLoginInfo.isregister && isCheckRes) {
    const worker = new Worker("/src/worker/password");
    worker.postMessage(inputLoginInfo.password);

    worker.addEventListener("message", async (ev) => {
      const formData = loginInfoSetFormData(inputLoginInfo.phone, ev.data);

      try {
        const loginResult = await loginCellphone(formData);
        // console.log(loginResult);

        if (loginResult.data.code === 502) {
          return;
        }

        const gofnc = fanhuigo(route);

        loginBCBus(
          loginResult.data,
          typeof gofnc === "boolean"
            ? {
                gopage: false,
                sourcess: null,
              }
            : {
                gopage: true,
                sourcess: gofnc,
              }
        );

        window.removeEventListener("keydown", keydownfn, false);
        worker.terminate();
      } catch (error) {
        console.log(error);
      }
    });

    worker.addEventListener("error", (err) => {
      console.log(err);
      promptbox({ title: "md5加密密码错误" });
    });
  } else {
    inputLoginInfo.password = "";
  }
}

function keydownfn(e) {
  // console.log(e);
  if (e.code === "Enter") {
    loginBtn();
  }
}

window.addEventListener("keydown", keydownfn, false);

onUnmounted(() => {
  window.removeEventListener("keydown", keydownfn, false);
});
</script>
<style scoped lang="scss">
div:nth-child(1) {
  background-color: #fff;
}
</style>
