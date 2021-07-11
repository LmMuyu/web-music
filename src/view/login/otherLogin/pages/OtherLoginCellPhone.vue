<template>
  <el-container>
    <el-main class="">
      <div class="flex items-center flex-col mx-28">
        <el-input
          placeholder="请输入手机号"
          v-model.number="formData.phoneNumber"
          class="input-with-select"
          @blur="lwPhone(formData)"
        >
          <template v-slot:prepend>
            <select
              class="outline-none border-none w-36 input_select"
              v-model="formData.countries"
            >
              <option
                v-for="item in country"
                :key="item.code"
                :value="'+' + item.code"
              >
                {{ `+${item.code}--${item.zh}` }}
              </option>
            </select>
          </template>
        </el-input>
        <el-input
          show-password
          placeholder="请输入密码"
          v-model="formData.password"
          class="py-1"
        >
        </el-input>
        <div class="py-3 flex justify-between w-52">
          <span class="flex items-center">
            <input type="checkbox" v-model="automaticLogin" />
            <p class="relative left-2">自动登录</p>
          </span>
          <span class="cursor-pointer">忘记密码?</span>
        </div>
        <div class="flex justify-center prent_button">
          <button
            :style="{ backgroundColor: '#74b9ff', outline: 'none' }"
            @click.stop="phoneLogin"
            class="relative flex justify-center items-center px-32 shadow_box"
          >
            <div
              class="absolute top-0 bottom-0 w-full h-full"
              style="background-color: #dfe6e9; opacity: 0"
            ></div>
            <cur-state :state="countRef" />
          </button>
        </div>
      </div>
    </el-main>
    <el-footer
      height="48px"
      class="
        absolute
        left-0
        right-0
        bottom-0
        border-t-2 border-solid border-gray-300
      "
    >
      <OtherLoginCellPhoneFooter />
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { computed, inject } from "@vue/runtime-core";
import { reactive, ref, toRaw } from "@vue/reactivity";

import { useRefNegate } from "../../../../utils/useRefNegate";
import { showMessage } from "../../../../utils/useMessage";
import { getStore } from "../../../../utils/getStore";
import { lwPhone } from "../hooks/lwPhone";
import { login } from "../hooks/login";

import OtherLoginCellPhoneFooter from "./components/OtherLoginCellPhoneFooter.vue";
import CurState from "./components/CurState.vue";
import {
  ElInput,
  ElContainer,
  ElFooter,
  ElMain,
  ElMessage,
} from "element-plus";

import type { UserInfo, TokenJsonStr } from "../../../../store/type";

const store = getStore();

const formData = reactive({
  phoneRes: false,
  countries: "+86",
  phoneNumber: "",
  password: "",
});

const automaticLogin = ref(false);

const cancelComp = inject<Function>("cancelComp") || (() => {});

const country = computed(() => {
  const countriesCode = toRaw(store.state.countriesCode)!;
  return countriesCode.reduce((pre, cur) => pre.concat(...cur.countryList), []);
});

const { countRef, negate } = useRefNegate(true);

function phoneLogin() {
  if (!formData.phoneNumber) {
    showMessage("error", "请输入手机号");
    return;
  } else if (!formData.password) {
    showMessage("error", "请输入密码");
    return;
  }

  negate();

  login(formData, ({ data }: any) => {
    const { bindings } = data;
    const userData = bindings[1];

    if (!userData) {
      return ElMessage.error({
        type: "error",
        message: "登录失败!",
      });
    }

    const userInfo: UserInfo = {
      id: userData.id,
      token: data.token,
      userID: userData.userId,
      tokenJsonStr: createTokenJsonStr(userData),
    };

    // store.dispatch("getUserInfo", [userInfo, cancelComp as () => void]);
    const BC = new BroadcastChannel("login");
    BC.postMessage(userInfo);
    BC.onmessage = function () {
      if (!cancelComp) throw new Error("cencelComp for Null");
      cancelComp(); //销毁登录框
    };
  });
}

function createTokenJsonStr(userData: UserInfo): TokenJsonStr {
  return JSON.parse(userData.tokenJsonStr as unknown as string);
}
</script>
<style lang="scss" scoped>
.input-with-select {
  &:deep(.el-input-group__prepend) {
    background-color: #fff;
    padding: 0;
  }
}
.zidong {
  &:deep(.el-button) {
    width: 150px;
  }
}

.shadow_box:hover {
  .shadow_box > div {
    opacity: 0.2;
  }
  box-shadow: 0 0 1px 1px #81ecec, 0 0 1px 1px #81ecec;
}
</style>
