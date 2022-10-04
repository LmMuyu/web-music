<template>
  <el-row>
    <el-col :span="4" class="rounded-md">
      <el-image
        class="w-56 h-56"
        fit="contain"
        :src="playlist.backgroundUrlImage + '?param=224y224'"
      ></el-image>
    </el-col>
    <el-col class="basic_detail px-6" :span="17">
      <div class="flex items-center">
        <span class="text-2xl">{{ playlist.name }}</span>
        <el-tag
          class="mx-2 cursor-pointer"
          size="small"
          v-for="(tagname, index) in playlist.tags"
          :key="index"
          @click="toRouterPath(tagname)"
          >{{ tagname }}</el-tag
        >
      </div>
      <div class="flex items-center">
        <div class="hove_text">
          <router-link
            class="flex items-center"
            :to="{
              path: '/user/home',
              query: {
                uid: playlist.creator?.userId || '',
                isself: false,
                issinger: false,
              },
            }"
          >
            <el-avatar
              :size="32"
              fit="contain"
              :src="
                logininfopriority
                  ? store.getters['login/getIslogin']
                    ? userData?.data?.avatarUrl + '?param=32y32'
                    : ''
                  : playlist?.creator?.avatarUrl
                  ? playlist.creator.avatarUrl + '?param=32y32'
                  : ''
              "
            />
            <span style="color: #79bbff" class="px-2 flex items-center"
              >{{ playlist.creator?.nickname || "" }}
            </span>
          </router-link>
        </div>
        <span class="text-xs" style="color: #b1b3b8"
          >最后更新时间为{{ playlist.updateTime }}
        </span>
      </div>
      <div v-if="playlist.titile">
        <span class="boxtext text-left text-sm" v-html="playlist.titile"></span>
      </div>
      <div class="flex items-center">
        <el-button
          size="small"
          type="primary"
          @click="ctxEmit('playerAll')"
          :plain="true"
          >播放全部</el-button
        >

        <el-button
          @click="shouChuang"
          size="small"
          class="flex justify-center items-center"
          :plain="true"
        >
          <font-icon
            :color="playlist.subscribed && '#409EFF'"
            icon="iconxihuan"
          >
          </font-icon>
          <span class="px-1"> 收藏 </span>
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {
  ElImage,
  ElRow,
  ElCol,
  ElButton,
  ElTag,
  ElMessage,
  ElAvatar,
} from "element-plus";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { subscribe } from "../../../api/songdetail";
import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { promptbox } from "../../../components/promptBox";

const ctxEmit = defineEmits(["playerAll"]);

const props = defineProps({
  playlist: {
    type: Object,
    required: true,
  },
  logininfopriority: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const router = useRouter();

async function shouChuang() {
  if (store && store.getters["login/getIslogin"]) {
    const t = props.playlist.subscribed ? 2 : 1;
    try {
      const ss = await subscribe(props.playlist.id, t);
      console.log(ss);

      if (ss && ss.status === 200) {
        console.log(ss.data);
        promptbox({ title: "收藏成功" });
      } else if (ss.status === 403) {
        promptbox({ title: "没有权限收藏" });
      } else {
        promptbox({ title: "收藏失败" });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    return ElMessage.error("请先登录！");
  }
}

function toRouterPath(tagname: string) {
  router.push({
    path: "/explore",
    query: {
      tag: tagname,
    },
  });
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
