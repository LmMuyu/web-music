<template>
  <div class="flex items-center justify-center px-10">
    <FontIcon @click.capture="ctxEmit('pre')" icon="iconarrow-right-copy" class="px-3" size="24" />
    <div>
      <FontIcon
        @click.capture="ctxEmit(status ? 'pause' : 'play')"
        :icon="status ? 'iconpause' : 'iconbofang1'"
        size="24"
        class="px-3"
      />
    </div>
    <FontIcon @click.capture="ctxEmit('next')" icon="iconmore" size="24" class="px-3" />
  </div>
</template>
<script setup lang="ts">
import FontIcon from "../../fonticon/FontIcon.vue";

const ctxEmit = defineEmits(["pre", "play", "next", "pause"]);

const props = defineProps({
  status: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss"></style>
