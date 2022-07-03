<template>
  <el-row>
    <el-col :span="7">
      <div
        class="autowh rounded-md"
        style="width: 256px; height: 256px"
        :style="{ backgroundImage: `url(${playlist.backgroundUrlImage + '?param=256y256'})` }"
      >
        <el-image
          class="h-full w-full"
          fit="contain"
          :src="playlist.backgroundUrlImage + '?param=256y256'"
        ></el-image>
      </div>
    </el-col>
    <el-col class="basic_detail" :span="17">
      <div class="flex items-center">
        <span class="text-2xl">{{ playlist.name }}</span>
        <el-tag
          class="mx-2 cursor-pointer"
          size="mini"
          v-for="(tagname, index) in playlist.tags"
          :key="index"
          >{{ tagname }}</el-tag
        >
      </div>
      <div class="hove_text">
        <router-link :to="{ path: '/user/home', query: { uid: playlist.creator?.userId || '' } }">
          <span> </span>
          <span>
            {{ playlist.creator?.nickname || "" }}
          </span>
        </router-link>
      </div>
      <div>
        <span class="text-sm">最后更新时间为{{ playlist.updateTime }} </span>
      </div>
      <div>
        <span class="boxtext text-left text-sm" v-html="playlist.titile"></span>
      </div>
      <div class="flex items-center">
        <el-button size="small" type="primary" :plain="true">播放全部</el-button>

        <el-button
          @click="shouChuang"
          size="small"
          class="flex justify-center items-center"
          :plain="true"
        >
          <font-icon icon="iconxihuan"> </font-icon>
          <span> 收藏 </span>
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ElImage, ElRow, ElCol, ElButton, ElTag, ElMessage } from "element-plus";
import { useStore } from "vuex";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const props = defineProps({
  playlist: {
    type: Object,
    required: true,
  },
});

const store = useStore();
function shouChuang() {
  if (store && store.getters["login/getIslogin"]) {
  } else {
    return ElMessage.error("请先登录！");
  }
}
</script>
<style scoped lang="scss">
.boxtext {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.autowh {
  max-height: 256px;
  max-width: 256px;
}

.basic_detail {
  & > div {
    padding: 8px 0;
  }

  .hove_text {
    @include Decoration_Hover;
  }
}
</style>
