<template>
  <card-row topath="/songdetail" :playlist="albums"></card-row>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { albumDateil } from "../hooks/singer";
import CardRow from "../../../../components/card/CardRow.vue";

const props = defineProps({
  albums: {
    type: Array as PropType<albumDateil[]>,
  },
});
</script>
<style scoped lang="scss"></style>
