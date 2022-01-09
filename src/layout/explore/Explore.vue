<template>
  <div>
    <FilterBtnCollections @btnWithActive="onBtnWithActive" />
  </div>
</template>
<script setup lang="ts">
import { Ref } from "vue";
import { useStore } from "vuex";

import FilterBtnCollections from "./components/FilterBtnCollections.vue";

const store = useStore();

function onBtnWithActive(btnRef: Ref<boolean>) {
  store.commit("explore/transformRef");
  store.commit("explore/setActiveRef", btnRef);
}
</script>
<style scoped lang="scss"></style>
