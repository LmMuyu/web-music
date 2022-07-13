<template>
  <article class="radius p-4 relative">
    <el-row class="w-full flex">
      <el-col :span="20" class="lastmusic">
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
      </el-col>
      <el-col :span="4" class="text-right">
        <router-link
          :to="{ path: '/user/single', query: { id } }"
          class="text-xs"
          style="color: #79bbff"
          >全部</router-link
        >
      </el-col>
    </el-row>
    <div class="pt-8">
      <div class="flex flex-col">
        <span class="text-4x1" style="color: #0984e3"> 我喜欢的音乐 </span>
        <span class="text-xs" style="color: #74b9ff"> {{ `${linkelen} 首歌` }} </span>
      </div>
      <div class="absolute bottom-2 right-4" @click.capture="ctxEmits('playermusic')">
        <FontIcon icon="iconbofang" size="38" color="#74b9ff"></FontIcon>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import FontIcon from "../../../../components/fonticon/FontIcon.vue";
import { ElRow, ElCol } from "element-plus";
import { useRoute } from "vue-router";

const ctxEmits = defineEmits(["playermusic"]);
const uid = useRoute().query.uid;

const props = defineProps({
  linkelen: {
    type: Number,
    required: true,
  },
  id: Number,
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
