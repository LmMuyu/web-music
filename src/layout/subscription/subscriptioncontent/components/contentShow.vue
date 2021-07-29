<template>
  <section>
    <header>
      <contentShowHeader />
    </header>
    <main></main>
  </section>
</template>
<script setup lang="ts">
import { getSubScriptDynamic } from "../../../../api/subscription";

import contentShowHeader from "./contentShowHeader.vue";

import type { PropType } from "@vue/runtime-core";
import type { UserInfo } from "../../../../store/type";

const props = defineProps({
  userInfo: {
    type: Object as PropType<UserInfo>,
    default: () => {},
  },
});


console.log(props.userInfo);


getSubScriptDynamic(props.userInfo.userID).then((res) => {
  console.log(res);
});
</script>
<style scoped lang="scss"></style>
