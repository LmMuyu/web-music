<template>
  <ElContainer class="py-4">
    <ElHeader style="padding-left: 0">
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
    </ElHeader>

    <div class="parent w-full">
      <ElRow
        class="w-full py-4 border-slate-200 border-collapse"
        style="border-width: 1px"
        v-for="(work, index) in toplist"
        :key="index"
      >
        <el-col :span="2" class="flex flex-col items-center justify-center">
          <span class="text-xl" style="color: #dedfe0"
            >{{ String(index + 1).padStart(2, "0") }}
          </span>
          <FontIcon
            size="12"
            :class="work.rank === 'down' && 'transform-gpu rotate-180'"
            :icon="
              work.rank === 'up'
                ? 'iconarrowup'
                : work.rank === 'down'
                ? 'iconarrowup'
                : 'iconzuixiaohua'
            "
          />
        </el-col>
        <el-col :span="9">
          <router-link
            :to="{
              path: '/video',
              query: work.query,
            }"
            class="w-full h-full"
          >
            <el-image
              class="relative w-full h-28 rounded-md"
              :src="work.imageurl + '?param=225y128'"
            >
              <span class="text-xs absolute top-0 right-0 mr-2 mt-2">{{ work.hot }}</span>
            </el-image>
          </router-link>
        </el-col>
        <el-col :span="13">
          <div class="flex flex-col ml-2">
            <div>
              <span class="text-sm">{{ work.workname }}</span>
            </div>
            <div class="truncate py-4">
              <router-link
                v-for="(nickname, index) in work.nicknames"
                :key="index"
                :to="{
                  path: '/user/home',
                  query: {
                    uid: nickname.id,
                  },
                }"
                class="text-xs"
                style="color: #dedfe0"
              >
                {{ nickname.name + (index < work.nicknames.length - 1 && "/") }}
              </router-link>
            </div>
          </div>
        </el-col>
      </ElRow>
    </div>
  </ElContainer>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from "vue";

import { topMv } from "../../../api/mv";
import { latestArea, TopMv as objTopMv } from "..";
import useColSpan from "../../../utils/useColSpan";

import { ElContainer, ElHeader, ElImage, ElRow, ElCol, ElTag } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";
import Text from "./Text.vue";

const toplist = ref<objTopMv[]>([]);
const curIndexArea = ref(0);
const laArea = ref(latestArea);
const { eachspan, stop } = useColSpan(laArea);

function onClick(index: number, area: string) {
  curIndexArea.value = index;
  topMv(10, area).then(reqTopMv);
}

function reqTopMv(data) {
  toplist.value = data.data.data.map((m, index) => new objTopMv(m, index));
}

topMv().then(reqTopMv);

onUnmounted(() => {
  stop();
});
</script>
<style scoped lang="scss">
.parent {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
</style>
