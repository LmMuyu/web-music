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
          <button @click.stop="phoneLogin" class="flex justify-center">
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

import OtherLoginCellPhoneFooter from "./components/OtherLoginCellPhoneFooter.vue";
import CurState from "./components/CurState.vue";
import {
  ElInput,
  ElContainer,
  ElFooter,
  ElMain,
  ElMessage,
} from "element-plus";

import { getStore } from "../../../../utils/getStore";
import { lwPhone } from "../hooks/lwPhone";
import { login } from "../hooks/login";

import type { UserInfo, TokenJsonStr } from "../../../../store/type";
import { useRefNegate } from "../../../../utils/useRefNegate";

const formData = reactive({
  phoneRes: false,
  countries: "+86",
  phoneNumber: "",
  password: "",
  verificationCode: "",
});

const automaticLogin = ref(false);

const store = getStore();

const cancelComp = inject<Function>("cancelComp") || (() => {});

const country = computed(() => {
  const countriesCode = toRaw(store.state.countriesCode)!;
  return countriesCode.reduce((pre, cur) => pre.concat(...cur.countryList), []);
});

const { countRef, negate } = useRefNegate(true);

function phoneLogin() {
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

    store.dispatch("getUserInfo", [userInfo, cancelComp as () => void]);
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
.prent_button {
  & > button {
    padding: 0 78px !important;
  }
}
</style>
