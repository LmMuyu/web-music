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
import { createApp, defineProps, nextTick, ref, watch, watchEffect } from "vue";
import { RouterLink } from "vue-router";
import router from "../../../routes";

import filterDate from "../../../utils/filterDate";
import { eventType } from "../hooks/eventType";

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

function headerRouterLink(props) {
  return () => (
    <span class="hover relative">
      <RouterLink
        style="color: #74b9ff"
        class="cursor-pointer"
        to={{ path: "/user/home", query: { uid: props.uid } }}
      >
        {props.nickname}
      </RouterLink>
    </span>
  );
}

watchEffect(async () => {
  if (Object.keys(props.userinfo).length > 0) {
    const app = createApp(
      headerRouterLink({ nickname: props.userinfo.nickname, uid: props.userinfo.userId })
    );
    app.use(router);

    await nextTick();
    if (linkComp.value) {
      app.mount(linkComp.value);
    } else {
      console.error(linkComp.value + `:元素为空，无法挂载`);
    }
  }
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
