<template>
  <article class="flex px-14 pt-12 w-full">
    <div class="w-2/4">
      <div>
        <img src="../../../../assets/platform.png" alt="" class="h-32" />
      </div>
      <div class="pt-7 flex flex-col">
        <div>
          <button
            class="outline-none border-none text-center py-2 p-20 text-gray-50 mp_Login"
            @click="withPhone"
          >
            手机号登录
          </button>
        </div>
        <div class="pt-7">
          <button
            class="outline-none border-none text-center py-2 p-20 text-gray-900 signup"
          >
            <span class="px-6">注册</span>
          </button>
        </div>
      </div>
    </div>
    <div class="w-2/4">
      <ul class="flex flex-col items-center list-noneh-full icon">
        <li
          v-for="(other, index) in thirdPartyLogin"
          :key="index"
          class="flex items-center justify-center min-w-full pt-6 cursor-pointer"
        >
          <div
            class="flex items-center justify-center border-solid border border-gray-400 w-12 h-12 round"
          >
            <i
              :class="other.icon"
              class="iconfont"
              :style="{ color: other.color, fontSize: other.size }"
            ></i>
          </div>

          <p class="transform translate-x-6">{{ other.text + "登录" }}</p>
        </li>
      </ul>
    </div>
  </article>
</template>
<script setup lang="ts">
import { defineEmit } from "@vue/runtime-core";
import { thirdPartyLogin } from "../api/data";
const ctxEmit = defineEmit(["onOther"]);

function withPhone() {
  ctxEmit("onOther", "loginwithphone");
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
