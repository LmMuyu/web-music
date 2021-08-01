<template>
  <div class="line_h">
    <p v-html="toParseJson"></p>
  </div>
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";

const props = defineProps({
  eventJson: {
    type: Object,
    default: () => ({}),
  },
  actId: {
    type: Number,
    default: -1,
  },
});

const toParseJson = computed(() => {
  const renderStr: string = props.eventJson["msg"];

  return renderStr.replace(/(\n|#((\p{sc=Han}|\d|\w)+?)#)/gu, ($1) => {
    let s = !!$1.trim();

    if (s) {
      return `<a herf="javascript:;;" style="color:#74b9ff;">${$1}</a>`;
    } else {
      return "<br/>";
    }
  });
});
</script>
<style scoped lang="scss">
.line_h {
  line-height: 24px;
}
</style>
