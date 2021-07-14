<template>
  <ElRow class="flex h-full border_radius">
    <ElCol :span="7" class="right_border">
      <el-container class="h-full">
        <el-header class="flex items-center justify-center">
          <Search
            class="border border-gray-300 border-solid rounded-md"
            :isroot-class="false"
            :disabled="false"
            :returnresdata="returnresdata"
          />
        </el-header>
        <el-main class="h-full  overflow-hidden">
          <MessagePrivateLetter :privateLetterList="privateLetter.main" />
        </el-main>
      </el-container>
    </ElCol>
    <ElCol :span="12"> xx </ElCol>
    <ElCol :span="5"> dawd</ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";

import { getPrivateLetter, getUserMessage } from "../../api/message";

import MessagePrivateLetter from "./components/MessagePrivateLetter.vue";
import { ElRow, ElCol, ElHeader, ElMain, ElContainer } from "element-plus";
import Search from "../../components/search/Search.vue";

const returnresdata = (data: any) => {
  console.log(data);
};

const privateLetter = reactive({
  main: [],
  viewMess: [],
});

const store = useStore();

const watchStep = store.watch(
  () => store.state.userInfo,
  async (value) => {
    if (!value) return;
    const list = await getPrivateLetter();
    privateLetter.main = list.data.msgs;

    // const privateMesList = await getUserMessage(list);
    // privateLetter.viewMess = privateMesList;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  watchStep();
});
</script>
<style scoped lang="scss">
.border_radius {
  box-shadow: 0 0 1px 2px #f5f6fa;
  border-radius: 8px;
  .right_border {
    border-right: 1px solid #f5f6fa;
  }
}
</style>
