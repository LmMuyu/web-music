<template>
  <el-dialog
    ref="fromdialog"
    v-model="showdialog"
    title="Tips"
    status-icon
    width="40%"
    :rules="rules"
    :before-close="handleClose"
  >
    <el-form label-width="100px" :model="formLabelAlign">
      <el-form-item label="歌单名：" prop="playlistname">
        <el-input v-model="formLabelAlign.name" />
      </el-form-item>
      <el-form-item label="歌单状态：">
        <el-radio-group v-model="formLabelAlign.isprivacy" class="ml-4">
          <el-radio :label="false" size="large">公开</el-radio>
          <el-radio :label="true" size="large">隐私</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="ctxEmit('dialogVisible')">取消</el-button>
        <el-button type="primary" @click="createPlaylist">创建</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref } from "vue";
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  FormInstance,
} from "element-plus";
import { newPlaylist } from "../../../../api/user";
import { promptbox } from "../../../../components/promptBox";

defineProps({
  showdialog: {
    required: true,
    type: Boolean,
  },
});

const ctxEmit = defineEmits(["dialogVisible"]);

const formLabelAlign = reactive({
  name: "",
  isprivacy: false,
});

const rules = reactive({
  playlistname: [{ validator: PlaylistName, trigger: "blur", required: true }],
});

const fromdialog = ref(null);

function PlaylistName(rule: any, value: any, callback: any) {
  console.log(rule);
  console.log(value);
  console.log(callback);
}

const handleClose = (done: () => void) => {
  done();
  ctxEmit("dialogVisible");
};

async function createPlaylist() {
  if (!(formLabelAlign.name.trim().length > 0)) {
    return promptbox({
      title: "歌单名不能为空",
    });
  }

  const f = new FormData();

  f.append("name", formLabelAlign.name);
  if (formLabelAlign.isprivacy) {
    f.append("privacy", "10");
  }

  const createres = await newPlaylist(f);

  ctxEmit("dialogVisible");

  console.log(createres);

  if (createres.data.code === 200) {
    return promptbox({
      title: "创建成功",
    });
  } else {
    return promptbox({
      title: createres.data.message,
    });
  }
}
</script>
<style scoped></style>
