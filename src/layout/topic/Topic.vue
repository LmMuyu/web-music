<template>
  <el-container class="bg-white h-full">
    <el-header
      style="height: 50%"
      :style="{ backgroundImage: `url(${topic.bgimg})`, backgroundSize: 'cover' }"
      class="flex justify-center items-center flex-col"
    >
      <div class="h-2/4 flex items-center justify-center flex-col">
        <span class="text-white text-3xl py-4 block">{{ topic.topicTitle }} </span>
        <ul class="list-disc text-white">
          <li v-for="(text, index) in topic.introductions" :key="index">
            {{ text }}
          </li>
        </ul>
      </div>
      <div class="h-2/4">
        <el-button plain size="large" style="width: 10vw; display: flex">
          <font-icon icon="iconw_shuxie" size="30" color="rgb(116 185 255)">
            <template #after>
              <span style="color: rgb(116 185 255)" class="text-xl"> 写动态 </span>
            </template>
          </font-icon>
        </el-button>
      </div>
    </el-header>
    <el-main>
      <subscription-content v-if="events.length > 0" :event="events"> </subscription-content>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { topicDetail, topicHotEvent } from "../../api/topic";

import { ElContainer, ElHeader, ElMain, ElButton } from "element-plus";
import FontIcon from "../../components/fonticon/FontIcon.vue";
import SubscriptionContent from "../subscription/components/SubscriptionContent.vue";

const route = useRoute();

const topic = reactive({
  topicTitle: route.query.topictitle ?? "",
  tid: route.query.tid as unknown as number,
  bgimg: "",
  introductions: [],
});

const events = ref([]);

async function topicRequest(tid: number) {
  if (!tid) return console.error("tid:NUll");

  const topicData = (await topicDetail(tid)).data.act;
  console.log(topicData);
  topic.bgimg = topicData.coverPCUrl;
  topic.topicTitle = topicData.title;
  topic.introductions = topicData.text;
  console.log(JSON.parse(topicData.resourceJson));
}

async function topicEventHot(tid: number) {
  if (!tid) return console.error("tid:NUll");

  const hotevent = await topicHotEvent(tid);
  events.value = hotevent.data.events;
}

topicRequest(topic.tid);
topicEventHot(topic.tid);
</script>
<style scoped lang="scss"></style>
