<template>
  <el-container class="py-4">
    <el-header style="padding-left: 0;">
      <el-row :align="'middle'">
        <el-col :span="15">
          <Text text="最新MV" />
        </el-col>
        <el-col :span="9">
          <el-row class="flex items-center justify-end">
            <el-col
              class="flex justify-center"
              :span="eachspan"
              v-for="(area, index) in laArea"
              :key="index"
            >
              <el-tag :disable-transitions="true" v-if="curIndexArea === index" round type="danger">
                {{ area }}
              </el-tag>
              <span class="text-xs px-4 cursor-pointer" @click="onClick(index, area)" v-else>
                {{ area }}
              </span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <div class="h-1/2"><Lists :rootlist="mvData" /></div>
  </el-container>
</template>
<script setup lang="ts">
import { ElContainer, ElHeader, ElRow, ElCol, ElTag } from "element-plus";
import { onUnmounted, ref } from "vue";
import { latestArea } from "..";
import { latestmv } from "../../../api/mv";

import useColSpan from "../../../utils/useColSpan";
import Lists from "./Lists.vue";
import Text from "./Text.vue";

const curIndexArea = ref(0);
const laArea = ref(latestArea);
const mvData = ref([]);
const { eachspan, stop } = useColSpan(laArea);

async function latestMvData(area: string) {
  const newmv = await latestmv(area, 8);
  mvData.value = newmv.data.data;
}

latestMvData(laArea.value[0]);

function onClick(index: number, area: string) {
  curIndexArea.value = index;
  latestMvData(area);
}

onUnmounted(() => {
  stop();
});
</script>

<style scoped lang="scss"></style>
