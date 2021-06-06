<template>
  <ul class="flex justify-around">
    <li v-for="(tagItem, index) in contentTags" :key="tagItem._id">
      <span>
        {{ tagItem.tagname }}
      </span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { contentTags } from "../hooks/data";
</script>
<style scoped lang="scss"></style>
