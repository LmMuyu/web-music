<template>
  <el-row>
    <el-col :span="4" class="rounded-md">
      <el-image
        class="h-full w-full"
        fit="contain"
        :src="playlist.backgroundUrlImage + '?param=256y256'"
      ></el-image>
    </el-col>

    <el-col class="basic_detail px-6" :span="17">
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
      <div class="flex items-center">
        <div class="hove_text">
          <router-link
            class="flex items-center"
            :to="{ path: '/user/home', query: { uid: playlist.creator?.userId || '' } }"
          >
            <el-avatar class="px-2" :size="32" fit="cover" :src="userData?.data?.avatarUrl ?? ''" />
            <span style="color: #79bbff" class="px-2 flex items-center"
              >{{ playlist.creator?.nickname || "" }}
            </span>
          </router-link>
        </div>
        <span class="text-xs" style="color: #b1b3b8">最后更新时间为{{ playlist.updateTime }} </span>
      </div>
      <div v-if="playlist.titile">
        <span class="boxtext text-left text-sm" v-html="playlist.titile"></span>
      </div>
      <div class="flex items-center">
        <el-button size="small" type="primary" @click="ctxEmit('playerAll')" :plain="true"
          >播放全部</el-button
        >

        <el-button
          @click="shouChuang"
          size="small"
          class="flex justify-center items-center"
          :plain="true"
        >
          <font-icon icon="iconxihuan"> </font-icon>
          <span class="px-1"> 收藏 </span>
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ElImage, ElRow, ElCol, ElButton, ElTag, ElMessage, ElAvatar } from "element-plus";
import { computed } from "vue";
import { useStore } from "vuex";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const ctxEmit = defineEmits(["playerAll"]);

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

const userData = computed<any>(store.getters["login/getUserData"]);
</script>
<style scoped lang="scss">
.boxtext {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
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
