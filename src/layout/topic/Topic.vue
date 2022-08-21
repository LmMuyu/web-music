<template>
  <subscription-content v-if="events.length > 0" :event="events">
    <el-container class="bg-white" style="height: 40vh">
      <el-main>
        <div class="flex justify-center items-center flex-col w-full h-full rounded-lg"
          :style="{ backgroundImage: `url(${topic.bgimg})`, backgroundSize: 'cover' }">
          <div class="h-2/4 flex items-center justify-center flex-col">
            <span class="text-white text-3xl py-4 block">{{ topic.topicTitle }} </span>
            <ul class="list-disc text-white">
              <li v-for="(text, index) in topic.introductions" :key="index">
                {{ text }}
              </li>
            </ul>
          </div>
          <div class="h-2/4 flex items-center justify-center">
            <el-button plain size="large" style="width: 20vw; display: flex">
              <font-icon icon="iconw_shuxie" size="24" color="rgb(116 185 255)">
                <template #after>
                  <div class="flex items-center">
                    <span style="color: rgb(116 185 255)"> 立即参与 </span>
                  </div>
                </template>
              </font-icon>
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </subscription-content>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { topicDetail, topicHotEvent, hotTopic } from "../../api/topic";

import { ElContainer, ElMain, ElButton } from "element-plus";
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

  const topicData = (await topicDetail(tid)).data;
  const act = topicData.act
  topic.bgimg = act.coverPCUrl;
  topic.topicTitle = act.title;
  topic.introductions = act.text;
  console.log(JSON.parse(act.resourceJson));
}

async function topicEventHot(tid: number) {
  if (!tid) return console.error("tid:NUll");

  const hotevent = await topicHotEvent(tid);
  events.value = hotevent.data.events;
}

topicRequest(topic.tid);
topicEventHot(topic.tid);
</script>
<style scoped lang="scss">
</style>
