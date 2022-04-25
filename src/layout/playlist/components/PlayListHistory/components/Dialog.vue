<template>
  <el-dialog
    custom-class="custom_dialog"
    v-model="dialogVisible"
    title="发表评论"
    width="40%"
    :before-close="handleClose"
  >
    <TextEditor :AiteUserData="follows" @editor_content="editorContent">
      <template #dialog="{ data }">
        <span class="relative">
          <a
            href="javascript:void(;;)"
            class="absolute top-0 left-0 w-full h-full"
            @click="aiteUser(data.uid)"
          >
            {{ data.nickname }}
          </a>
        </span>
      </template>
    </TextEditor>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from "vue";
import store from "../../../../../store";

import { ElDialog } from "element-plus";

const dialogVisible = ref(false);

function handleClose(done: () => void) {
  done();
}

function editorContent(content: string) {
  console.log(content);
}

const follows = computed(() => {
  return store.getters["login/getFollows"]();
});

function aiteUser(uid: number) {}

watchEffect(async () => {
  if (dialogVisible.value) {
    await nextTick();
    const bodynode = document.querySelector(".custom_dialog");
    const childBody = bodynode.querySelector(".el-dialog__body")! as HTMLElement;

    childBody.style.cssText = `
    padding:0 16px;
    `;
  }
});

defineExpose({
  visibleDialog() {
    dialogVisible.value = true;
  },
});
</script>
<style scoped lang="scss">
.custom_dialog {
  padding: 0;
}
</style>
