<template>
  <el-container ref="container" class="w-full h-full bg-white">
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
              <el-tag
                v-if="selectId === tag.id"
                size="small"
                type="danger"
                round
                >{{ tag.name }}</el-tag
              >
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
    <RecycleScroller
      field="vid"
      :items="selectData"
      :two-dimension="true"
      :col-dimension="5"
      :comp="comp"
      :weapper-height="85"
      :item-size="168"
      @update="pullUpLoad"
      v-if="!loadingData"
    ></RecycleScroller>
    <Loading v-else />
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
import {
  defineComponent,
  markRaw,
  onMounted,
  reactive,
  ref,
  shallowRef,
} from "vue";

import { videoDetail } from "./hooks/data";
import { getVideoGroup, groupVideoList } from "../../api/video";

import CardRow from "../../components/card/CardRow.vue";
import VideoBox from "../../components/videobox/VideoBox.vue";
import FontIcon from "../../components/fonticon/FontIcon.vue";
import Loading from "../../components/svgloading/SvgLoading.vue";
import VideoAllGroupSelect from "./components/VideoAllGroupSelect.vue";
import RecycleScroller from "../../components/vritualscroller/RecycleScroller.vue";
import {
  ElContainer,
  ElHeader,
  ElRow,
  ElCol,
  ElTag,
  ElButton,
} from "element-plus";
import { promptbox } from "../../components/promptBox";

let page = 0;
const selectId = ref(0);
const route = useRoute();
const videotags = ref([]);
const selectMap = ref({});
const router = useRouter();
const loadingData = ref(true);
const showSelect = ref(false);
const header = shallowRef(null);
const container = shallowRef(null);
const selectData = ref<videoDetail[]>([]);
const mountSelectAllDom = shallowRef(null);
const selectTag = ref({ name: "", id: 0 });
const selectModulePos = reactive({ x: 0, y: 0 });

const comp = defineComponent({
  props: {
    item: Object,
    index: Number,
  },
  components: {
    VideoBox,
    CardRow,
  },
  template: `
    <CardRow
        class="flex justify-center"
        :col-item="5"
        :playlist="item"
      >
        <template #default="{ custom }">
          <VideoBox
            titleclass="text-sm"
            :videoinfo="custom.playitem"
            :index="0"
          ></VideoBox>
        </template>
      </CardRow>
  `,
});

groupVideoList().then((grouplist) => {
  videotags.value = grouplist.data.data.map((tag) => ({
    id: tag.id,
    name: tag.name,
  }));
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

async function twoPromiseAll(id: number, k: number = 0) {
  diffIdRemoveVideoData(selectId.value, id);

  try {
    const value = await Promise.all([
      getVideoGroup(id, k * 2 + 0),
      getVideoGroup(id, k * 2 + 1),
      ...(k === 0
        ? [
            getVideoGroup(id, k * 2 + 2),
            getVideoGroup(id, k * 2 + 3),
            getVideoGroup(id, k * 2 + 4),
          ]
        : []),
    ]);

    const mapgroups = (value as any[]).reduce(
      (group, next) => group.concat(next.data.datas),
      []
    );

    let timer = (await groupdata(mapgroups, k)) as any;
    if (timer.v) {
      clearTimeout(timer.v);
      timer.v = null;
    }
    page += 1;

    promptbox({
      title: "发现了更多新内容",
      mountNode: container.value.$el,
    });

    return Promise.resolve(true);
  } catch (error) {
    promptbox({
      title: "发生了一点小问题~",
      mountNode: container.value.$el,
    });
    return Promise.reject(false);
  }
}

function groupdata(group: any, k: number) {
  let timer = {
    v: null,
  };
  return new Promise((resolve) => {
    selectData.value.push(...group.map((data) => new videoDetail(data.data)));
    loadingData.value = false;

    if (k === 0) {
      resolve(timer);
    } else {
      timer.v = setTimeout(() => resolve(timer.v), 1000);
    }
  });
}

function diffIdRemoveVideoData(preid: number, nextid: number) {
  if (preid !== nextid) {
    selectData.value = [];
    return true;
  }

  return false;
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

let req = false;

async function pullUpLoad(done: (status: boolean) => void) {
  if (req) return;
  console.log("请求中");

  try {
    req = true;
    await twoPromiseAll(selectId.value, page);
    done(true);
  } catch (error) {
    done(false);
  } finally {
    req = false;
  }
}
</script>
<style scoped lang="scss"></style>
