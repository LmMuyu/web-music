<template>
  <section class="flex flex-col justify-center items-center w-full h-full">
    <div class="py-2 w-3/5">
      <InputBox placeholder="手机号" />
    </div>
    <div class="py-2 w-3/5">
      <InputBox iconfont="iconmima" type="password" placeholder="密码" />
    </div>
  </section>
</template> 
<script setup lang='ts'>
import InputBox from "./components/InputBox.vue"
</script>
<style scoped lang='scss'>
</style>
