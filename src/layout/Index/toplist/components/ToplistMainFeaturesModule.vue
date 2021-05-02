<template>
  <span class="icon">
    <i class="ihover px-1 cursor-pointer iconfont iconbofang1" title="播放"></i>
    <i class="ihover px-1 cursor-pointer iconfont iconxiazai" title="下载"></i>
    <i
      class="ihover px-1 cursor-pointer iconfont iconfenxiang"
      title="分享"
    ></i>
  </span>
</template>
<script setup lang='ts'></script>
<style scoped lang='scss'>
.icon {
  @include Iconfont(#636e72);
}
.ihover:hover {
  color: #409eff;
}
</style>