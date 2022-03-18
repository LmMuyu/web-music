<template>
  <div class="flex items-center w-full h-full">
    <div style="width: 40%" class="flex justify-center items-center h-full">
      <div class="flex justify-center w-full">
        <div class="w-3/5">
          <div class="py-2">
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
          <div class="py-2 w-full flex flex-col items-center">
            <el-button class="rounded-lg w-full" type="primary" @click="loginBtn">登录</el-button>
            <span class="flex justify-end py-4">
              <a href="javascript:;;" class="text-sm px-4">注册</a>
              <a href="javscript:;;" class="text-sm px-4">忘记密码?</a>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 60%" class="h-full py-2 bgimage"></div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";

import {loginBCBus} from "../../useBroadcastChannel";
import { cellphone, loginCellphone } from "../../../../api/login";
import { promptbox } from "../../../../components/promptBox";

import InputBox from "./components/InputBox.vue";
import { ElButton } from "element-plus";

const inputLoginInfo = reactive({
  phone: "",
  password: "",
  isregister: false,
});

let prephone = "";

const phone = ref();
const pass = ref();

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
    const worker = new Worker("/src/worker/password");
    worker.postMessage(inputLoginInfo.password);

    worker.addEventListener("message", async (ev) => {
      const formData = new FormData();
      formData.append("phone", inputLoginInfo.phone);
      formData.append("md5_password", ev.data);

      const loginResult = await loginCellphone(formData);
      loginBCBus(loginResult.data);

      window.removeEventListener("keydown", keydownfn, false);
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
  if (e.code === "Enter") {
    loginBtn();
  }
}

window.addEventListener("keydown", keydownfn, false);
</script>
<style scoped lang="scss">
div:nth-child(1) {
  background-color: #fff;
}

.bgimage {
  position: relative;
  background-image: url("https://images.pexels.com/photos/991012/pexels-photo-991012.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-box-shadow: 0px 0px 10px 0px rgba(234, 234, 234, 1);
    -moz-box-shadow: 0px 0px 10px 0px rgba(234, 234, 234, 1);
    box-shadow: 0px 0px 10px 0px rgba(234, 234, 234, 1);
  }
}
</style>
