<template>
  <el-container :class="class" class="rounded-md bg-show w-3/5 h-4/6" :style="containerPos">
    <el-main class="bg-white w-full h-full overflow-hidden">
      <better-scroll :open-h-render="false">
        <el-row align="middle" class="" v-for="(tagobj, row) in allSelectTag" :key="row">
          <el-col
            class="px-4 flex items-center justify-center"
            :span="4"
            v-for="(tag, col) in tagobj"
            :key="col"
          >
            <el-tag v-if="tag.id === selectId" type="danger" round>{{ tag.name }}</el-tag>
            <span
              @click="selectTag(tag)"
              v-else
              class="py-4 text-xs cursor-pointer hover:text-red-300"
            >
              {{ tag.name }}
            </span>
          </el-col>
        </el-row>
      </better-scroll>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ElContainer, ElMain, ElRow, ElCol, ElTag } from "element-plus";
import { computed } from "vue";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";

const ctxEmit = defineEmits(["selectTag"]);

const props = defineProps({
  allSelectTag: {
    type: Object,
    required: true,
  },
  pos: {
    type: Object,
    required: true,
  },
  selectId: Number,
  class: String,
});

function selectTag(tag: any) {
  if (tag.id === props.selectId) return;
  ctxEmit("selectTag", tag);
}

const containerPos = computed(() => {
  return {
    position: "absolute",
    left: props.pos.x * 2 + "px",
    top: props.pos.y + 16 + "px",
  };
});
</script>
<style scoped lang="scss">
.bg-show {
  -webkit-box-shadow: 0px 0px 3px 0px rgba(96, 98, 102, 1);
  -moz-box-shadow: 0px 0px 3px 0px rgba(96, 98, 102, 1);
  box-shadow: 0px 0px 3px 0px rgba(96, 98, 102, 1);
}
</style>
