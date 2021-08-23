<template>
  <section class="flex flex-col justify-center items-center w-full h-full">
    <main class="flex flex-col justify-center items-center w-full">
      <div class="py-2 w-3/5">
        <InputBox
          ref="phone"
          placeholder="手机号"
          :is-icon="true"
          @change="registerChecking"
          v-model="inputLoginInfo.phone"
        />
      </div>
      <div class="py-2 w-3/5">
        <InputBox
          ref="pass"
          iconfont="iconmima"
          type="password"
          placeholder="密码"
          v-model="inputLoginInfo.password"
        />
      </div>
      <div class="py-2 w-full flex items-center justify-between">
        <el-button class="rounded-lg translatex" type="primary" @click="loginBtn">登录</el-button>
        <span class="_translatex">
          <a href="javscript:;;" class>忘记密码?</a>
        </span>
      </div>
    </main>
  </section>
</template> 
<script setup lang='ts'>
import { reactive, ref, } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";


import { cellphone, loginCellphone } from "../../../../api/login";
import { promptbox } from "../../../../components/promptBox";

import InputBox from "./components/InputBox.vue"
import { ElButton } from "element-plus"



const store = useStore()
const router = useRouter()

const inputLoginInfo = reactive({
  phone: "",
  password: "",
  isregister: false,
})

const phone = ref()
const pass = ref()

function checkingInput() {
  let isCheckingRes = true

  if (!inputLoginInfo.phone.trim().length) {
    phone.value["showErrorInfo"]?.("请输入手机号码!")
    isCheckingRes = false
  }

  if (!inputLoginInfo.password.trim().length) {
    pass.value["showErrorInfo"]?.("请输入密码!")
    isCheckingRes = false
  }


  return isCheckingRes
}

async function loginBtn() {
  const isCheckRes = checkingInput()


  if (inputLoginInfo.isregister && isCheckRes) {
    const formData = new FormData()
    formData.append("phone", inputLoginInfo.phone)
    formData.append("password", inputLoginInfo.password)

    const loginResult = await loginCellphone(formData)

    setUserInfo(loginResult.data)
  }

}

async function registerChecking() {
  const formData = new FormData()
  formData.append("phone", inputLoginInfo.phone.trim())

  const result = await cellphone(formData)

  if (!result.data.hasPassword) {
    promptbox({
      title: "手机号码未注册!",
      mountNode: "body"
    })

    return
  }

  inputLoginInfo.isregister = result.data.hasPassword
}

function setUserInfo(info: any) {
  const BC = new BroadcastChannel("login");
  // store.commit("login/setUserInfo", {
  //   name: "买买买"
  // })
  const userInfo = {
    token: info.token,
    account: info.account,
    userInfo: info.profile,
    userID: info.profile.userId,
  };

  store.commit("setLoginStatus", 200);
  BC.postMessage(userInfo);

  BC.onmessage = function () {
    router.push({ path: "/index" }) //登录成功，跳转到主页面
  }
}


</script>
<style scoped lang='scss'>
.translatex {
  transform: translate(140%);
}

._translatex {
  transform: translate(-140%);
}
</style>
