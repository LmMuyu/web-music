<template>
  <ElRow
    ref="infocard"
    class="flex items-center justify-center w-full cursor-pointer transform-gpu translate-y-6"
  >
    <MainInfoCard :infoData="infoData" />
    <ElCol :span="4" class="flex items-center justify-end icons">
      <i class="iconfont icongengduo-copy" openModel="copy" @click="centerDialogVisible = true"></i>
    </ElCol>
  </ElRow>

  <Teleport to="#dialog">
    <el-dialog
      class="flex justify-center"
      v-model="centerDialogVisible"
      title="退出登录"
      width="40%"
      center
      @opened="dialogOpened"
    >
      <span class="py-5">您确定要退出登录？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmLogout">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </Teleport>
</template>
<script setup lang="ts">
import { defineProps, onUnmounted, shallowRef } from "@vue/runtime-core";
import { ref } from "vue";
import { useStore } from "vuex";

import { ElCol, ElRow, ElDialog, ElButton } from "element-plus";
import MainInfoCard from "./MainInfoCard.vue";
import { logout } from "../../../api/app/login";
import { promptbox } from "../../../components/promptBox";

const props = defineProps({
  infoData: {
    type: Object,
    default: () => ({}),
  },
});

const store = useStore();
const centerDialogVisible = ref(false);
const infocard = shallowRef(null);

function dialogOpened() {
  const body = document.querySelector("body") as HTMLElement;
  body.style.padding = "0";
}

async function confirmLogout() {
  centerDialogVisible.value = false;

  try {
    await logout();
    promptbox({ title: "已退出登录" });
    store.commit("login/setUserInfo", [{}, "logout"]);
  } catch (error) {
    promptbox({ title: "退出登录错误" });
  }
}

onUnmounted(() => {
  stop();
});
</script>

<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}
</style>
