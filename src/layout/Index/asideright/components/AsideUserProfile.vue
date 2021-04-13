<template>
  <div class="user_profile w-full flex flex-col items-center p-6 pb-6">
    <p class="">登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
    <button
      @click="onLogin('#login')"
      class="outline-none border border-solid bg-red-600 text-white p-2 px-14 mt-4"
      style="border-color: #dfe6e9"
    >
      用户登录
    </button>
  </div>
</template>
<script setup lang="ts">
import onLogin from "../../../../view/login/login";
</script>
<style lang="scss" scoped>
.user_profile {
  background-image: linear-gradient(to bottom, #fff, rgb(230, 230, 230));
}
</style>
