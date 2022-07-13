<template>
  <el-container class="w-full h-full bg-white">
    <el-header class="flex items-center">
      <el-row class="w-full" align="middle">
        <el-col :span="11">
          <el-button size="medium" round class="flex items-center px-4">
            <span>{{ selectTag.name }}</span>
            <FontIcon icon="iconmore"></FontIcon>
          </el-button>
        </el-col>
        <el-col :span="13" class="flex">
          <div class="px-2" v-for="(tag, index) in videotags.slice(0, 10)">
            <el-tag
              @click="videoGroup(tag.id)"
              v-if="selectTagIndex === index"
              size="small"
              type="danger"
              round
              >{{ tag.name }}</el-tag
            >
            <span
              @click="clickTag(tag, index)"
              v-else
              style="color: #303133"
              class="text-xs cursor-pointer"
            >
              {{ tag.name }}
            </span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <card-row :playlist="[]">
      <template #default="{ custom }">
        <VideoBox :index="0"></VideoBox>
      </template>
    </card-row>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getVideoGroup, groupVideoList } from "../../api/video";

import { ElContainer, ElHeader, ElRow, ElCol, ElTag, ElButton } from "element-plus";
import CardRow from "../../components/card/CardRow.vue";
import VideoBox from "../../components/videobox/VideoBox.vue";
import FontIcon from "../../components/fonticon/FontIcon.vue";

const videotags = ref([]);
const selectTagIndex = ref(0);
const selectTag = ref({ name: "", id: 0 });

groupVideoList().then((grouplist) => {
  videotags.value = grouplist.data.data.map((tag) => ({ id: tag.id, name: tag.name }));
  selectTag.value = videotags.value[0];

  Promise.all([getVideoGroup(selectTag.value.id), getVideoGroup(selectTag.value.id, 1)]).then(
    (value) => {
      const mapgroups = (value as any[]).reduce((group, next) => group.concat(next.data.datas), []);
      groupdata(mapgroups);
    }
  );
});

async function videoGroup(id: number) {
  const group = await getVideoGroup(id);
  groupdata(group);
}

function groupdata(group) {
  console.log(group);
}

function clickTag(tag, index) {
  selectTagIndex.value = index;
  selectTag.value = tag;
}
</script>
<style scoped lang="scss"></style>
