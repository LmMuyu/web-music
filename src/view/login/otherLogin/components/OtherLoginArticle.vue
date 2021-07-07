<template>
  <article class="flex px-14 pt-12 w-full">
    <div class="w-2/4">
      <div>
        <img src="../../../../assets/platform.png" alt="" class="h-32" />
      </div>
      <div class="pt-7 flex flex-col">
        <div>
          <button
            class="
              outline-none
              border-none
              text-center
              py-2
              p-20
              text-gray-50
              mp_Login
            "
            @click="withPhone"
          >
            手机号登录
          </button>
        </div>
        <div class="pt-7">
          <button
            class="
              outline-none
              border-none
              text-center
              py-2
              p-20
              text-gray-900
              signup
            "
          >
            <span class="px-6">注册</span>
          </button>
        </div>
      </div>
    </div>
    <div class="w-2/4">
      <OtherLoginThirdParty :third-party-login="thirdPartyLogin" />
    </div>
  </article>
</template>
<script setup lang="ts">
import { inject } from "@vue/runtime-core";

import { thirdPartyLogin, footerDeal } from "../api/data";
import { injectKey } from "../../api/data";

import OtherLoginThirdParty from "./OtherLoginThirdParty.vue";
import { ElMessage } from "element-plus";

import type { Emitter } from "mitt";

const protocol: { value: boolean } = inject("protocol")!; //是否同意条款
const mitt: Emitter | undefined = inject(injectKey);

function createMessage(data: { text: string }[]) {
  let str = data.reduce(
    (str, cur) => (str += `《${cur.text}》、`),
    "请先勾选同意 "
  );

  return str.slice(0, str.length - 1);
}

function withPhone() {
  if (!mitt) return new Error("otherLogin undefined");

  if (!protocol.value) {
    ElMessage.warning({
      type: "warning",
      message: createMessage(footerDeal),
    });

    return;
  }

  mitt.emit("otherLogin", "loginwithphone");
}
</script>
<style lang="scss" scoped>
.icon {
  @include Iconfont();
}
.mp_Login {
  background: #0984e3;
}
.signup {
  background: #f5f6fa;
}
.round {
  border-radius: 50%;
}
</style>
