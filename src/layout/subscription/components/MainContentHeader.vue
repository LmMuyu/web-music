<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <div ref="linkComp"></div>
      <p class="text-sm mx-2" style="color: #b2bec3">{{ eventType(type) }}</p>
    </div>
    <div>
      <p class="text-xs" style="color: rgb(178 190 195)">{{ filterDate(showTime, null, true) }}</p>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { defineProps, nextTick, onMounted, ref, watchEffect } from "vue";

import filterDate from "../../../utils/filterDate";
import { eventType } from "../hooks/eventType";
import { routerLinkRender } from "../renderNode";

const props = defineProps({
  userinfo: {
    type: Object,
    default: () => {},
  },
  showTime: {
    type: Number,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
});

const linkComp = ref(null);

onMounted(async () => {
  await nextTick();

  watchEffect(() => {
    if (Object.keys(props.userinfo).length > 0) {
      if (linkComp.value) {
        routerLinkRender(linkComp, {
          nickname: props.userinfo.nickname,
          uid: props.userinfo.userId,
        });
      } else {
        console.error(linkComp.value + `:元素为空，无法挂载`);
      }
    }
  });
});
</script>
<style scoped lang="scss">
.hover {
  text-decoration: none;
}

.hover:hover {
  text-decoration: underline;
}
</style>
