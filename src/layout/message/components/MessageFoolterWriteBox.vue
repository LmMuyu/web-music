<template>
  <!-- <writer-box :returnresdata="returnresdata" :disabled="true" :is-icon="false"></writer-box> -->
  <input type="text" :value="vlaue" @input="onInput" />
</template>
<script setup lang='ts'>
import { defineEmit, watch } from "@vue/runtime-core";

import WriterBox from "../../../components/search/Search.vue"
import { useModel } from "../../../utils/vue/useModel";

const ctxEmit = defineEmit(["portmsg", "update:vlaue"])

const props = defineProps({
  vlaue: {
    type: String,
    default: ""
  }
})


const onInput = useModel(ctxEmit, "update:value")


const returnresdata = (msg: string) => {

}

</script>
<style scoped lang='scss'></style>
