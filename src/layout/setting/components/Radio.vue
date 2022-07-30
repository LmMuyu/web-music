<template>
  <el-radio-group
    v-model="modelRadio"
    style="align-items: flex-start"
    class="flex flex-col items-start justify-start"
    @change="(r) => ctxEmit('update:modelRadio', (prevR = r as any))"
  >
    <el-radio
      :label="radop.label"
      size="large"
      class="text-xs ml-4"
      v-for="(radop, index) in radioOptions"
      :key="index"
      @click.capture="captureClick"
    >
      {{ radop.title }}
    </el-radio>
  </el-radio-group>
</template>
<script setup lang="ts">
import { ElRadioGroup, ElRadio } from "element-plus";
import { PropType } from "vue";

import { radioOp } from "../type";

const ctxEmit = defineEmits(["update:modelRadio"]);

const props = defineProps({
  modelRadio: String,
  radioOptions: {
    type: Array as PropType<radioOp[]>,
    required: true,
  },
  uncheck: Boolean,
});

let prevR = props.modelRadio;

function captureClick() {
  Promise.resolve().then(() => {
    if (props.modelRadio == prevR && props.uncheck) {
      ctxEmit("update:modelRadio", "");
    }
  });
}
</script>
<style scoped lang="scss"></style>
