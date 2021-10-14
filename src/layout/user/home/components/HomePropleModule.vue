<template>
  <span
    v-for="(model, index) in models"
    :key="index"
    class="px-4 py-2 mx-4 cursor-pointer border_round rounded-lg"
    @click="model.click"
    @mouseenter="model.isfollows ? model.isfollows.negate : () => {}"
    @mouseleave="model.isfollows ? model.isfollows.negate : () => {}"
  >
    <p v-if="model.isfollows?.countRef ?? false">
      {{ model.hovername }}
    </p>
    <p v-else>{{ model.name }}</p>
  </span>
</template>
<script setup lang="ts">
import { useRefNegate } from "../../../../utils/useRefNegate";

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

const models = [
  {
    name: "歌手页",
    click(e: Event) {
      console.log(e);
    },
  },
  {
    name: "发私信",
    click(e: Event) {
      console.log(e);
    },
  },
  {
    name: "关注",
    ...(props.profile.followed
      ? { hovername: "取消关注", isfollows: useRefNegate(false) }
      : {}),
    click(e: Event) {
      console.log(e);
    },
  },
];
</script>
<style scoped lang="scss">
.border_round {
  border: 1px solid #ecf0f1;
}

.border_round:hover {
  background: #fafafa;
}
</style>
