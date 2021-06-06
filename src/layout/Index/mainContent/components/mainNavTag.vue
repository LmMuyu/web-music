<template>
  <ul class="flex justify-around">
    <li v-for="(tagItem, index) in contentTags" :key="tagItem._id">
      <span
        @click="() => ctxEmit('click', tagItem.comname)"
        class="cursor-pointer"
      >
        {{ tagItem.tagname }}
      </span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { defineEmit } from "@vue/runtime-core";
import { contentTags } from "../hooks/data";

const ctxEmit = defineEmit(["click"]);
</script>
<style scoped lang="scss"></style>
