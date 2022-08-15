<template>
  <ElRow
    class="border-solid border-slate-200 border-b-2 px-4"
    v-for="(comment, index) in comments"
    :key="index"
  >
    <ElCol :span="4">
      <ElAvatar :src="comment.user.avatarUrl"></ElAvatar>
    </ElCol>
    <ElCol :span="20" class="flex flex-col">
      <div class="flex justify-between items-center">
        <router-link
          :to="{
            path: '/',
            query: {
              uid: comment.user.userId,
            },
          }"
          style="color: #409eff"
        >
          {{ comment.user.nickname }}
        </router-link>
        <span style="color: #dedfe0" class="text-xs">
          {{ formatTime(comment.time, "ymd_hms") }}
        </span>
      </div>
      <div class="flex flex-col leading-6 text-xs" style="color: #303133">
        <div class="flex items-center">
          <span>回复我的：</span>
          <span>{{ String(comment.content).replaceAll(" ", "") }}</span>
        </div>
        <div style="background-color: #e9e9eb" class="p-2 rounded-md">
          <span>{{ comment.beRepliedContent }}</span>
        </div>
      </div>
      <div class="w-full flex items-center justify-end">
        <div @click="goRoutePath(comment)" class="flex items-center cursor-pointer">
          <FontIcon size="12" icon="iconpinglun_huabanfuben" color="#dedfe0" />
          <span class="text-xs py-4" style="color: #c8c9cc">回复</span>
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { historyComments } from "../../../api/message";
import { ElRow, ElCol, ElAvatar } from "element-plus";
import { formatTime } from "../../../utils/filterDate";
import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const comments = ref([]);

const commentKey = {
  0: "/playlist",
  1: "/video",
  2: "/songlist",
  3: "专辑",
  4: "电台",
  5: "/video",
  6: "/subscription",
};

const userData = store.getters["login/getUserData"]().data;

historyComments(10, userData.id).then((historyData) => {
  comments.value = historyData.data.comments;
});

function goRoutePath(comment: any) {
  const jsonComment = JSON.parse(comment.resourceJson);

  router.push({
    path: commentKey[comment.commentLocationType],
    query: {
      id: jsonComment.id,
    },
  });
}
</script>
<style scoped lang="scss"></style>
