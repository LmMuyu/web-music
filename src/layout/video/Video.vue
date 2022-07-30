<template>
  <el-container class="w-full h-full bg-white">
    <el-header ref="header" class="flex items-center">
      <el-row class="w-full" align="middle">
        <el-col :span="10">
          <el-button
            ref="mountSelectAllDom"
            @click="expandSelectAll"
            size="default"
            round
            class="flex items-center px-4"
          >
            <span>{{ selectTag.name }}</span>
            <FontIcon icon="iconmore"></FontIcon>
          </el-button>
        </el-col>
        <el-col :span="14">
          <el-row class="flex justify-center items-center" align="middle">
            <el-col
              :span="3"
              v-for="tag in videotags.slice(0, 8)"
              class="flex items-center justify-center"
            >
              <el-tag v-if="selectId === tag.id" size="small" type="danger" round>{{
                tag.name
              }}</el-tag>
              <span
                @click="clickTag(tag)"
                style="color: #303133"
                class="text-xs cursor-pointer px-2"
                v-else
              >
                {{ tag.name }}
              </span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <BetterScroll @pull-up-load="pullUpLoad" :open-upload="true" :open-h-render="false">
      <card-row
        v-if="!loadingData"
        class="flex justify-center"
        :col-item="4"
        :playlist="selectData"
      >
        <template #default="{ custom }">
          <VideoBox titleclass="text-sm" :videoinfo="custom.playitem" :index="0"></VideoBox>
        </template>
      </card-row>
      <Loading v-else />
    </BetterScroll>
  </el-container>
  <video-all-group-select
    :selectId="selectId"
    :pos="selectModulePos"
    :all-select-tag="selectMap"
    @selectTag="clickTag"
    v-if="showSelect"
  />
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { markRaw, reactive, ref, shallowRef } from "vue";

import { videoDetail } from "./hooks/data";
import { getVideoGroup, groupVideoList } from "../../api/video";

import CardRow from "../../components/card/CardRow.vue";
import VideoBox from "../../components/videobox/VideoBox.vue";
import FontIcon from "../../components/fonticon/FontIcon.vue";
import Loading from "../../components/svgloading/SvgLoading.vue";
import VideoAllGroupSelect from "./components/VideoAllGroupSelect.vue";
import BetterScroll from "../../components/betterscroll/BetterScroll.vue";
import { ElContainer, ElHeader, ElRow, ElCol, ElTag, ElButton } from "element-plus";

let page = 0;
const route = useRoute();
const router = useRouter();
const selectId = ref(0);
const videotags = ref([]);
const selectData = ref([]);
const selectMap = ref({});
const loadingData = ref(true);
const showSelect = ref(false);
const header = shallowRef(null);
const mountSelectAllDom = shallowRef(null);
const selectTag = ref({ name: "", id: 0 });
const selectModulePos = reactive({ x: 0, y: 0 });

groupVideoList().then((grouplist) => {
  videotags.value = grouplist.data.data.map((tag) => ({ id: tag.id, name: tag.name }));
  selectTag.value = defaultSelectTag(videotags.value);
  selectMap.value = videoMapKey(videotags.value);
  selectId.value = selectTag.value.id;
  loadingData.value = true;
  twoPromiseAll(selectTag.value.id, 0);
});

function defaultSelectTag(tags: any[]) {
  if (route.query.tagname) {
    const tag = tags.find((tag) => tag.name === route.query.tagname);
    return tag ? tag : tags[0];
  } else {
    return tags[0];
  }
}

function routerPush(name: string) {
  return router.replace({
    path: "/indexvideo",
    query: {
      tagname: name,
    },
  });
}

function clickTag(tag: any) {
  selectTag.value = tag;
  showSelect.value && (showSelect.value = false);
  loadingData.value = true;
  twoPromiseAll(tag.id);
  selectId.value = tag.id;
  routerPush(tag.name);
}

function twoPromiseAll(id: number, k: number = 0) {
  diffIdRemoveVideoData(selectId.value, id);
  return Promise.all([getVideoGroup(id, k * 2), getVideoGroup(id, k * 2 + 1)]).then((value) => {
    const mapgroups = (value as any[]).reduce((group, next) => group.concat(next.data.datas), []);
    groupdata(mapgroups);
    page += 1;
  });
}

function groupdata(group: any) {
  selectData.value.push(...group.map((data) => new videoDetail(data.data)));
  loadingData.value = false;
}

function diffIdRemoveVideoData(preid: number, nextid: number) {
  if (preid !== nextid) {
    selectData.value = [];
  }
}

function expandSelectAll() {
  if (showSelect.value) {
    showSelect.value = false;
    return;
  }

  const el = mountSelectAllDom.value.$el as HTMLElement;
  const rect = el.getBoundingClientRect();
  const headerRect = header.value.$el as HTMLElement;

  selectModulePos.x = headerRect.offsetLeft;
  selectModulePos.y = rect.bottom;
  showSelect.value = true;
}

function videoMapKey(videotags: any[]) {
  const forcount = Math.ceil(videotags.length / 6);
  let row = 1;
  const mapObj = {};

  for (let i = 0; i < forcount; i++) {
    mapObj[row] = markRaw(videotags.slice(i * 6, row * 6));
    row += 1;
  }

  return mapObj;
}

async function pullUpLoad([resolve, reject]) {
  try {
    await twoPromiseAll(selectId.value, page);
    resolve(true);
  } catch (error) {
    reject(error);
  }
}
</script>
<style scoped lang="scss"></style>
