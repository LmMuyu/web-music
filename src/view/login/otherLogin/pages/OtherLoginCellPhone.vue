<template>
  <el-container>
    <el-main class="">
      <div class="flex items-center flex-col mx-28">
        <el-input
          placeholder="请输入手机号"
          v-model.number="formData.phoneNumber"
          :maxlength="11"
          class="input-with-select"
          @change="lwPhone(formData, logging)"
        >
          <template v-slot:prepend>
            <select
              class="outline-none border-none w-36 input_select"
              v-model="formData.countries"
            >
              <option
                v-for="item in countryList"
                :key="item.code"
                :value="'+' + item.code"
              >
                {{ `+${item.code}--${item.zh}` }}
              </option>
            </select>
          </template>
        </el-input>
        <div class="py-3 flex"></div>
        <el-input
          placeholder="请输入验证码"
          v-model="formData.verificationCode"
        >
          <template v-slot:append>
            <el-button
              type="primary"
              @click="
                onVerificationCode(
                  formData.phoneNumber,
                  countDownFn,
                  formData.countries
                )
              "
              >{{ vccd === 0 ? "发送验证码" : vccd }}</el-button
            >
          </template>
        </el-input>
        <div class="py-3 flex justify-between w-52">
          <span class="flex items-center">
            <input type="checkbox" v-model="automaticLogin" />
            <p class="relative left-2">自动登录</p>
          </span>
          <span class="cursor-pointer">忘记密码?</span>
        </div>
        <div class="flex justify-center prent_button">
          <el-button type="primary">登录</el-button>
        </div>
      </div>
    </el-main>
    <el-footer
      height="48px"
      class="absolute left-0 right-0 bottom-0 border-t-2 border-solid border-gray-300"
    >
      <OtherLoginCellPhoneFooter />
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import OtherLoginCellPhoneFooter from "./components/OtherLoginCellPhoneFooter.vue";
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
} from "@vue/runtime-core";
import { onVerificationCode } from "../hooks/onVerificationCode";
import { reactive, ref, toRaw } from "@vue/reactivity";
import { ElInput, ElButton, ElContainer, ElFooter, ElMain } from "element-plus";
import { lwPhone } from "../hooks/lwPhone";
import observer from "../../../../utils/observer/Observer";
import getFile from "../../../../utils/getCurrentInstanceFile";

interface CuntriesCode {
  data: Array<Record<string, any>>;
}

const formData = reactive({
  phoneRes: false,
  countries: "+86",
  phoneNumber: "",
  verificationCode: "",
});

let currFileName: string = "";
const automaticLogin = ref(false);
const vccd = ref(0); //过多久验证码才能重新获取
const deaultVccdTime = 10;

(async function () {
  try {
    const instance = (getCurrentInstance() as unknown) as {
      type: {
        __file: string;
      };
    };

    currFileName = await getFile(instance);
    // console.log(currFileName);
  } catch (error) {
    throw new Error(error);
  }
})();

const countryList = computed(() => {
  const countriesCode: CuntriesCode = toRaw(
    getCurrentInstance()?.appContext.config.globalProperties.$store.state
      .countriesCode
  );

  return countriesCode.data.reduce(
    (pre, cur) => pre.concat(...cur.countryList),
    []
  );
});

function logging({
  hasPassword,
  nickname,
}: {
  hasPassword: boolean;
  nickname: string;
}) {
  console.log(hasPassword + "-----" + nickname);
}

//验证码倒计时
const countDownFn = (function () {
  let timer: NodeJS.Timeout | null = null;

  //到零时清除倒计时
  function clearCountdown() {
    if (vccd.value <= 0) {
      observer.off(currFileName);
      timer = null;
    }
  }

  return function () {
    if (timer) {
      return;
    }

    vccd.value = deaultVccdTime;
    timer = setInterval(() => {
      vccd.value -= 1;
      clearCountdown();
      // console.log(vccd.value);
    }, 1000);

    if (currFileName) {
      observer.on(currFileName, timer);
    } else {
      throw new Error();
    }
  };
})();

onBeforeUnmount(() => {
  vccd.value !== 0 && observer.off(currFileName);
});
</script>
<style lang="scss" scoped>
.input-with-select {
  &:deep(.el-input-group__prepend) {
    background-color: #fff;
    padding: 0;
  }
}

.prent_button {
  & > button {
    padding: 0 78px !important;
  }
}
</style>
