<template>
  <nav class="py-4">
    <el-row>
      <el-col :span="3">
        <el-select @change="lableSelect" v-model="select.select">
          <el-option-group
            :label="group.lable"
            v-for="(group, index) in select.selectOptions"
            :key="index"
          >
            <el-option
              v-for="(option, index) in group.options"
              :key="index"
              :value="option.value"
              :label="option.label"
            ></el-option>
          </el-option-group>
        </el-select>
      </el-col>
      <el-col :span="18" class="flex">
        <el-row class="w-full">
          <el-col
            class="cursor-pointer px-2"
            v-for="(selecttag, index) in select.tagstr"
            :key="index"
            :span="tagDynamicSpan.get(selecttag)"
          >
            <div
              @click="currSelectTag(selecttag, index)"
              class="flex items-center h-full px-2 hover_backcolor"
              :style="currenSelectIndex === index ? currentBackColor : ''"
            >
              <span
                :style="currenSelectIndex === index ? textCssText : currentTextCssText"
                class="w-full text-center"
                style="line-height: 16px; vertical-align: middle"
                >{{ selecttag }}</span
              >
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="3">
        <div v-if="!issinger" class="w-4/5 h-full cursor-pointer" @click="ctxEmit('newSong')">
          <div class="flex items-center h-full w-full px-2 hover_backcolor">
            <div v-if="!isSelectCloud" class="flex items-center justify-center">
              <font-icon icon="iconjia"></font-icon>
              <span class="text-sm" style="color: #606266; font-weight: bold">新建歌单</span>
            </div>
            <div v-else class="flex">
              <font-icon icon="iconshangchuanyunduan"></font-icon>
              <span
                class="text-sm px-1"
                @click="openInputFile"
                style="color: #606266; font-weight: bold"
                >上传云盘</span
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </nav>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";

import { musicUploadToCloudDisk } from "../../hooks";

import { ElSelect, ElOption, ElOptionGroup, ElRow, ElCol } from "element-plus";
import FontIcon from "../../../../components/fonticon/FontIcon.vue";

const ctxEmit = defineEmits(["songs", "selectTag", "newSong"]);

const props = defineProps({
  issinger: Boolean,
});

const noSelectCssText = "font-weight: bold;";
const yesSelectCssText = "font-weight: bolder;";
const cssText = `
    font-size:18px;
    color:#606266;
  `;

const textCssText = cssText + noSelectCssText;
const currentTextCssText = cssText + yesSelectCssText;
const currentBackColor = `
  border-radius: 4px;
  background-color: #f6f6f6
  `;

const currenSelectIndex = ref<null | number>(null);
const isSelectCloud = ref(false);
const tagDynamicSpan = ref<Map<string, number>>(hashTagSpan());

const select = reactive({
  select: "全部歌单",
  selectOptions: [
    {
      lable: "",
      options: [
        {
          value: "全部歌单",
          label: "全部歌单",
        },
      ],
    },
    {
      lable: "",
      options: [
        {
          value: "创建的歌单",
          label: "创建的歌单",
        },
        {
          value: "收藏的歌单",
          label: "收藏的歌单",
        },
      ],
    },
  ],
  tagstr: pushTags(),
});

function currSelectTag(selecttag: string, index: number) {
  currenSelectIndex.value = index;

  if (selecttag === "云盘") {
    isSelectCloud.value = true;
  } else {
    isSelectCloud.value = false;
  }

  ctxEmit("selectTag", selecttag);
}

function lableSelect(change: string) {
  select.select = change;
  currenSelectIndex.value = null;
  ctxEmit("songs", select.select);
}

function openInputFile() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("multiple", "true");
  input.click();

  input.addEventListener("change", function () {
    const files = this.files;

    musicUploadToCloudDisk(files, (res) => {
      console.log(res);
    });
  });
}

function pushTags() {
  const defaultTags = ["专辑", "艺人", "MV", "云盘"];

  if (props.issinger) {
    const yirsindex = defaultTags.indexOf("艺人");
    const yunpanindex = defaultTags.indexOf("云盘");
    defaultTags[yirsindex] = "相似艺人";
    defaultTags.splice(yunpanindex, 1);
  }

  return defaultTags;
}

function hashTagSpan() {
  const tags = pushTags();
  const spanMap = new Map();
  const defaultSpan = 3;
  const defaultTextSize = 2;

  tags.forEach((tag) => {
    if (tag.length > defaultTextSize) {
      const tagspanlen = defaultSpan + (tag.length - defaultTextSize);
      spanMap.set(tag, tagspanlen);
    } else {
      spanMap.set(tag, defaultSpan);
    }
  });

  return spanMap;
}

onMounted(() => {
  nextTick(() => {
    function setCssText(selectors: string, csstext: string) {
      const node = document.querySelector(selectors);
      if (!node) {
        return;
      }

      (node as HTMLElement).style.cssText = csstext;
    }

    setCssText(
      ".el-input__inner",
      `
      border:none;
      padding:0px;
      padding-right:16px;
      text-align:center;
      ${textCssText}
      `
    );
    setCssText(".el-input__suffix-inner", "height: inherit");
    setCssText(
      ".el-input__icon",
      `
      display: flex;
      align-items: center;
      justify-content: center;
      `
    );
  });
});
</script>
<style scoped lang="scss">
.hover_backcolor:hover {
  border-radius: 4px;
  background-color: #f6f6f6;
}
</style>
