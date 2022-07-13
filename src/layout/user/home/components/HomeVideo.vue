<template>
  <card-row :playlist="videos">
    <template #default="{ custom }">
      <video-box :videoinfo="custom.playitem" :index="custom.index" />
    </template>
  </card-row>
</template>
<script setup lang="ts">
import CardRow from "../../../../components/card/CardRow.vue";
import VideoBox from "../../../../components/videobox/VideoBox.vue";

const props = defineProps({
  videos: Array,
});
</script>
<style scoped lang="scss"></style>
