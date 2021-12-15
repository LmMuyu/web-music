<template>
  <nav class="py-4">
    <el-row class="w-3/5">
      <el-col :span="6">
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
      <el-col
        :span="4"
        class="flex cursor-pointer"
        v-for="(selecttag, index) in select.tagstr"
        :key="index"
      >
        <div
          @click="currSelectTag(selecttag, index)"
          class="flex items-center h-full w-3/5 px-2 hover_backcolor"
          :style="currenSelectIndex === index ? currentBackColor : ''"
        >
          <span
            :style="currenSelectIndex === index ? textCssText : currentTextCssText"
            class="w-full text-center"
            >{{ selecttag }}</span
          >
        </div>
      </el-col>
    </el-row>
  </nav>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";

import { ElSelect, ElOption, ElOptionGroup, ElRow, ElCol } from "element-plus";

const ctxEmit = defineEmits(["songs", "selectTag"]);

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
  tagstr: ["专辑", "艺人", "MV", "云盘"],
});

function currSelectTag(selecttag: string, index: number) {
  currenSelectIndex.value = index;
  ctxEmit("selectTag", selecttag);
}

function lableSelect(change: string) {
  select.select = change;
  currenSelectIndex.value = null;
  ctxEmit("songs", select.select);
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
