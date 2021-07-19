<template>
  <writer-box
    :returnresdata="returnresdata"
    class="w-1/2 justify-start"
    inputClass="border border-solid border-gray-700 rounded-lg"
    :is-icon="false"
  ></writer-box>
</template>
<script setup lang="ts">
import { defineEmit, watch } from "@vue/runtime-core";

import WriterBox from "../../../components/search/Search.vue";

const ctxEmit = defineEmit(["portmsg", "update:vlaue"]);

const props = defineProps({
  vlaue: {
    type: String,
    default: "",
  },
});

// let data = ""

// const onInput = (e: InputEvent) => {
//   const inputData = e?.data

//   const str = inputData === null ? data.substring(0, data.length - 1) : data += inputData

//   return str
// }

const returnresdata = (msg: string) => {};
</script>
<style scoped lang="scss"></style>
