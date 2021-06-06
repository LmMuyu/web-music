<template>
  <el-dialog
    custom-class="custom_dialog"
    v-model="dialogVisible"
    :title="!reply ? '发表评论' : '回复评论'"
    width="60%"
    :before-close="handleClose"
  >
    <div v-if="reply" class="w-full">
      <ElRow class="w-full py-2" :align="'middle'">
        <ElCol :span="2" class="flex items-center">
          <el-avatar :size="38" :src="replyPeople.avararUrl" />
        </ElCol>
        <ElCol :span="22" class="flex flex-col items-baseline">
          <span class="text-sm">{{ replyPeople.nickanme }}</span>
          <span style="color: #c8c9cc" class="text-xs truncate w-full">{{
            replyPeople.commentcontent
          }}</span>
        </ElCol>
      </ElRow>
    </div>
    <TextEditor
      @upLoadImage="upLoadImage"
      :appendToContainer="false"
      :AiteUserData="follows"
      @editor_content="editorContent"
    >
    </TextEditor>

    <el-upload
      v-model:file-list="fileList"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      class="py-4"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </el-dialog>
  <el-dialog v-model="imageVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script setup lang="ts">
import store from "../../../../../store";
import { computed, nextTick, ref, watchEffect } from "vue";

import { TextEditor } from "vue3-text-editor";
import { Plus } from "@element-plus/icons-vue";
import {
  ElDialog,
  ElUpload,
  ElIcon,
  UploadUserFile,
  UploadProps,
  ElAvatar,
  ElRow,
  ElCol,
} from "element-plus";
import { closeInputEditorMitt } from "../../../hooks/methods";

export interface Reply {
  nickanme: string;
  uid: number;
  avararUrl: string;
  commentcontent: string;
}

const ctxEmit = defineEmits(["editorContent"]);

const reply = ref(false);
const dialogImageUrl = ref("");
const imageVisible = ref(false);
const dialogVisible = ref(false);
const fileList = ref<UploadUserFile[]>([]);
const replyPeople = ref<Readonly<Reply>>(null);

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  imageVisible.value = true;
};

function handleClose(done: () => void) {
  done();
}

function editorContent(content: string) {
  if (content) {
    ctxEmit("editorContent", { content, reply });
  }

  closeInputEditorMitt.map(dialogVisible);
  closeInputEditorMitt.on();
}

const follows = computed(() => {
  const followlists = store.getters["login/getFollows"]();

  return (followlists as any[]).map((follow) => ({
    uid: follow.uid,
    name: follow.nickname,
  }));
});

function upLoadImage(src: string) {
  if (src) {
    fileList.value.push({
      name: "upfile-" + fileList.value.length + 1,
      url: src,
    });
  }
}

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
  visibleDialog(ops?: Reply) {
    if (ops) {
      reply.value = true;
      replyPeople.value = ops;
    } else {
      reply.value = false;
      replyPeople.value = null;
    }

    closeInputEditorMitt.emit(true);
    dialogVisible.value = true;
  },

  hiddenDialog() {
    dialogVisible.value = false;
  },
});
</script>
<style scoped lang="scss">
.custom_dialog {
  padding: 0;
}
</style>
