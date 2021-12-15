<template>
  <article class="radius p-4 relative">
    <div class="w-full py-4 lastmusic">
      <div>
        <span>大无畏达瓦大屋顶</span>
        <span>大无畏达瓦大屋顶·</span>
      </div>
      <div>
        <span>大无畏达瓦大屋顶·</span>
        <span>大无畏达瓦大屋顶·</span>
      </div>
      <div>
        <span>大无畏达瓦大屋顶·</span>
        <span>大无畏达瓦大屋顶·</span>
      </div>
    </div>
    <div class="pt-8">
      <div class="flex flex-col">
        <span class="text-4x1" style="color: #0984e3"> 我喜欢的音乐 </span>
        <span class="text-xs" style="color: #74b9ff"> {{ `${linkelen} 首歌` }} </span>
      </div>
      <div class="absolute bottom-2 right-4">
        <FontIcon icon="iconbofang" size="38" color="#74b9ff"></FontIcon>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import FontIcon from "../../../../components/fonticon/FontIcon.vue";

const props = defineProps({
  linkelen: {
    type: Number,
    required: true,
  },
});
</script>
<style scoped lang="scss">
article:nth-child(1) {
  background-color: #c6e3ff;
  border-radius: 15px 15px 15px 15px;
  -moz-border-radius: 15px 15px 15px 15px;
  -webkit-border-radius: 15px 15px 15px 15px;
}

.lastmusic {
  & > div > span {
    font-size: 14px;
    color: #74b9ff;
    line-height: 16px;
  }
}
</style>
