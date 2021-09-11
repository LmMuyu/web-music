<template>
  <section class="flex flex-col justify-center items-center w-full h-full">
    <main class="flex flex-col justify-center items-center w-3/5">
      <div class="py-2 w-full">
        <InputBox
          ref="phone"
          placeholder="手机号"
          :is-icon="true"
          @change="registerChecking"
          v-model="inputLoginInfo.phone"
        />
      </div>
      <div class="py-2 w-full">
        <InputBox
          ref="pass"
          iconfont="iconmima"
          type="password"
          placeholder="密码"
          v-model="inputLoginInfo.password"
        />
      </div>
      <div class="py-2 w-full flex items-center">
        <el-button class="rounded-lg w-5/12" type="primary" @click="loginBtn"
          >登录</el-button
        >
        <span class="flex-1 text-right">
          <a href="javscript:;;" class>忘记密码?</a>
        </span>
      </div>
    </main>
  </section>
</template>
<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

import { cellphone, loginCellphone } from "../../../../api/login";
import { promptbox } from "../../../../components/promptBox";

import InputBox from "./components/InputBox.vue";
import { ElButton } from "element-plus";

const router = useRouter();

const inputLoginInfo = reactive({
  phone: "",
  password: "",
  isregister: false,
});

let prephone = "";

const phone = ref();
const pass = ref();

const showErrorInfo = (box: any, message: string) =>
  box.value["showErrorInfo"]?.(message);

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

  console.log(111);

  const formData = new FormData();
  formData.append("phone", inputLoginInfo.phone.trim());
  prephone = inputLoginInfo.phone.trim();

  const result = await cellphone(formData);

  if (!result.data.hasPassword) {
    promptbox({
      title: "手机号码未注册!",
      mountNode: "body",
    });

    return;
  }

  inputLoginInfo.isregister = result.data.hasPassword;
}

async function loginBtn() {
  const isCheckRes = checkingInput();

  if (inputLoginInfo.isregister && isCheckRes) {
    const formData = new FormData();
    formData.append("phone", inputLoginInfo.phone);
    formData.append("password", inputLoginInfo.password);

    const loginResult = await loginCellphone(formData);

    if (loginResult.data.code === 502) {
      return showErrorInfo(pass, loginResult.data.message);
    }

    setUserInfo(loginResult.data);
  }
}

function setUserInfo(info: any) {
  const BC = new BroadcastChannel("login");

  const userInfo = {
    token: info.token,
    account: info.account,
    userInfo: info.profile,
    userID: info.profile.userId,
  };

  BC.postMessage(userInfo);

  BC.onmessage = function () {
    router.push({ path: "/index" }); //登录成功，跳转到主页面
  };
}
</script>
<style scoped lang="scss"></style>
