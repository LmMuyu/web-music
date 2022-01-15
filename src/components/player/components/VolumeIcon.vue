<template>
  <div class="w-full h-full">
    <font-icon :icon="fonticonclass" size="20"></font-icon>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import FontIcon from "../../fonticon/FontIcon.vue";

const props = defineProps({
  volume: {
    type: Number,
    required: true,
  },
});

const fonticonclass = ref("");

const ifmethods = {
  quit(volume: number) {
    if (volume === 0) {
      return "icon24gl-volumeCross";
    }
  },

  xiaoyu30(volume: number) {
    if (volume <= 30) {
      return "icon24gl-volumeLow";
    }
  },
  xiaoyu50(volume: number) {
    if (volume <= 60) {
      return "icon24gl-volumeMiddle";
    }
  },
  xiaoyu100(volume: number) {
    if (volume <= 100) {
      return "icon24gl-volumeHigh";
    }
  },
};

watchEffect(() => {
  console.log(props.volume);

  for (const key in ifmethods) {
    if (Object.prototype.hasOwnProperty.call(ifmethods, key)) {
      const iconclass = ifmethods[key](props.volume);

      if (iconclass) {
        fonticonclass.value = iconclass;
        break;
      }
    }
  }
});
</script>
<style scoped lang="scss"></style>
