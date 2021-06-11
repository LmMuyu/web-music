<template></template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { getArtists } from "../../../../api/discover";

const activeNames = ref("1");

const handleChange = (val: any) => {
  console.log(val);
};

const renderList = ref([]);

getArtists().then(({ data }) => (renderList.value = data.data));
</script>
<style scoped lang="scss"></style>
