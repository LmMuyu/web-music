<template>
  <div class="flex overflow-x-hidden">
    <div>
      <el-avatar :size="32"></el-avatar>
    </div>
    <div class="flex flex-col">
      <pre>2021:222</pre>
      <p style="word-wrap: break-word; width: 50%">
        dakwdkakwdkakwdkaosjdjaowjdoajdoojawdjawjdoawjodjoajwodjoawjodoawjdoawdjoajo
      </p>
    </div>
  </div>
  <div class="flex flex-row-reverse justify-start">
    <div>
      <el-avatar :size="32"></el-avatar>
    </div>
    <div class="px-2 flex flex-col items-end">
      <pre class="text-xs py-2">2021:222</pre>
      <p style="word-wrap: break-word; width: 50%" class="bg_color  text-sm p-3 rounded-md">
        dakwdkakwdkakwdkaosjdjaowjdoajdoojawdjawjdoawjodjoajwodjoawjodoawjdoawdjoajo
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElAvatar } from "element-plus";
</script>
<style scoped lang="scss">
.bg_color {
  background-color: #dcf3fe;
  // #F2F6FA
}
</style>
