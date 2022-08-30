<template>
  <div class="flex items-center w-full h-full bg-white">
    <div class="w-1/2 text-xl font-bold"><p class="px-4">订阅动态</p></div>
    <div class="w-1/2 flex justify-end">
      <div class="w-1/2 flex">
        <div class="flex justify-center items-center rounded-full">
          <FontIcon
            @click="dialogVisible = true"
            icon="iconw_shuxie"
            title="写动态"
            size="30"
          ></FontIcon>
        </div>
        <div class="flex items-center px-6">
          <el-avatar :src="userinfo?.data?.avatarUrl"></el-avatar>
          <span class="font-bold px-2"> {{ userinfo?.data?.nickname }} </span>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="Tips" width="40%" :before-close="handleClose">
    <TextEditor
      @upLoadImage="upLoadImage"
      :appendToContainer="false"
      :AiteUserData="[]"
      @editor_content="editorContent"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">发布</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, h } from "vue";
import { useStore } from "vuex";

import { ElAvatar, ElMessageBox, ElDialog, ElButton, ElRow, ElCol } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { TextEditor } from "vue3-text-editor";

const store = useStore();
const dialogVisible = ref(false);

const userinfo = computed<any>(store.getters["login/getUserData"]);

const promptBox = defineComponent({
  components: {
    ElButton,
    ElRow,
    ElCol,
  },
  template: `
  <div class="flex flex-col rounded-lg">
    <span style="color:#303133" class="font-bold flex justify-center text-lg">提示</span>
    <span style="color:#C0C4CC" class="text-xs py-4">即将退出，是否保留草稿</span>
  </div>
  `,
});

function handleClose(done: () => void) {
  ElMessageBox.confirm(h(promptBox), {
    cancelButtonClass: "cancelClass",
    confirmButtonClass: "confirmClass",
    center: true,
  })
    .then(() => {
      console.log(222);
    })
    .catch(() => {})
    .finally(done);
}
function editorContent() {}
function upLoadImage(file) {
  console.log(file);
}
</script>
<style scoped lang="scss">
.rounded_text {
  color: #fff;
  background: #74b9ff;
}
</style>

<style></style>
