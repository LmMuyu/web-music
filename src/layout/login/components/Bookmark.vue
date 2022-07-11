<template>
  <div :class="class">
    <div @click="ctxEmit('switchLogin')" class="button-content cursor-pointer text-white">
      切换登录方式
    </div>
  </div>
</template>
<script setup lang="ts">
const ctxEmit = defineEmits(["switchLogin"]);

const props = defineProps({
  class: String,
});
</script>
<style scoped lang="scss">
.button-content:before {
  content: "";
  width: 20px;
  height: 0%;
  border: 15px solid;
  border-color: transparent #409eff transparent transparent;
  position: absolute;
  right: 100px;
  top: 0px;
}
.button-content {
  width: 100px;
  height: 30px;
  background-color: #409eff;
  font-size: small;
  line-height: 30px;
  text-align: center;
}
</style>
