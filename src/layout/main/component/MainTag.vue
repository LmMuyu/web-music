<template>
  <nav>
    <el-row
      v-for="(tagNav, index) in AsideTags"
      :key="index"
      class="cursor-pointer py-4 w-full icons"
      @mouseenter="moveActive(index)"
      @mouseleave="leaveActive(index)"
      @click="toPath(tagNav.path, index)"
    >
      <el-col :span="8" class="flex items-center justify-end">
        <el-tooltip
          :visible="!windowResize"
          class="box-item"
          :content="tagNav.title"
          placement="right"
          v-if="!windowResize"
        >
          <i class="iconfont" :class="tagNav.icon" :style="activeStyle(index)"></i>
        </el-tooltip>
        <i class="iconfont" v-else :class="tagNav.icon" :style="activeStyle(index)"></i>
      </el-col>
      <el-col :span="16">
        <p v-show="windowResize" class="text-lg px-5 text_color" :style="activeStyle(index)">
          {{ tagNav.title }}
        </p>
      </el-col>
    </el-row>
  </nav>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { inject, Ref } from "vue";
import { useRouter } from "vue-router";

import { currentIndex, moveIndex, AsideTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";

import { ElTooltip, ElRow, ElCol } from "element-plus";

const router = useRouter();
const store = useStore();
const windowResize = inject("windowResize") as Ref<boolean>;

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(
  currentIndex,
  moveIndex
);

const toPath = (path: string, index: number) => {
  const storedata = store.getters["login/getUserData"]();
  clickActive(index);
  const userdata = storedata.data;

  router.push({
    path,
    query: {
      uid: userdata.userID,
      isself: 1,
      issinger: "false",
    },
  });
};

const activeTag = (to: any) => {
  currentIndex.value = AsideTags.findIndex((value) => to.path.indexOf(value.path) > -1);
};

router.beforeEach((to) => activeTag(to));
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}

.text_color {
  color: #636e72;
}
</style>
