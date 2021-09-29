<template>
  <section class="p-4">
    <span>
      <p>热门话题</p>
    </span>
    <nav ref="nav" class="py-4">
      <div
        v-for="(topicItme, index) in renderTopic"
        :key="index"
        class="flex py-1"
      >
        <div>
          <el-image
            :src="topicItme.sharePicUrl + '?param=36y42'"
            style="width: 38px; height: 40px"
            class="rounded-md"
          ></el-image>
        </div>
        <div class="flex flex-col px-4">
          <p>#{{ topicItme.title }}#</p>
          <p style="color: #dfe6e9">{{ topicItme.participateCount }}人参与</p>
        </div>
      </div>
    </nav>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getTopic } from "../../../../api/subscription";

import { ElImage } from "element-plus";

const nav = ref<HTMLElement | null>(null);

const renderTopic = ref([]);

getTopic().then((topic) => {
  renderTopic.value.push(...topic.data.hot);
});
</script>
<style scoped lang="scss"></style>
