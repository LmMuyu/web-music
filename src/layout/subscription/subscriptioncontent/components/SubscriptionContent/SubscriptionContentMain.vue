<template>
  <div v-if="countRef">
    <section
      class="flex pt-5 border_style"
      v-for="event in events"
      :key="event.id"
    >
      <div style="width: 10%">
        <el-avatar :src="event.user.avatarUrl"></el-avatar>
      </div>
      <div style="width: 90%">
        <mainContent :event="event" />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";

import { getSubScriptDynamic } from "../../../../../api/subscription";
import { useRefNegate } from "../../../../../utils/useRefNegate";

import mainContent from "./components/mainContent.vue";
import { ElAvatar } from "element-plus";

const store = useStore();

const { countRef, negate } = useRefNegate(false);
//@ts-ignore
const events = ref([]);

store.watch(
  () => store.state.userInfo,
  async (value) => {
    if (!value) return;

    const res = await getSubScriptDynamic(value.id);
    events.value = res.data.event;

    negate();
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
.border_style {
  position: relative;
  & ::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    width: 100%;
    background-color: #dfe6e9;
  }
}
</style>
