<template>
  <ul>
    <li v-for="(message, index) in privateLetterList" :key="index">
      {{ message }}
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";

import dayjs from "dayjs";

interface dayAttribute {
  $D: number;
  $H: number;
  $L: string;
  $M: number;
  $W: number;
  $d: string;
  $m: 40;
  $ms: 300;
  $s: 35;
  $u: undefined;
  $x: Object;
  $y: number;
}

const props = defineProps({
  privateLetterList: {
    type: Array,
    default: () => [],
  },
});

const returnDateList = (dateAttribute: dayAttribute) => [
  dateAttribute.$y,
  dateAttribute.$M + 1,
  dateAttribute.$D,
  dateAttribute.$H,
  dateAttribute.$m,
  dateAttribute.$s,
];

const now_one = dayjs(1621480414790) as unknown as dayAttribute;
const now_two = dayjs() as unknown as dayAttribute;

const now_one_list = returnDateList(now_one);
const now_two_list = returnDateList(now_two);

const list = now_one_list.filter((v) => !now_two_list.includes(v));

const len = list.length;

// if (len === 1) {
//   return list.join("")+"秒前"
// }else if(len === 2){
//   return list[0]+"分前"
// }else if(len === 3){
//   return list[0] +"小时前"
// }else if(len === 4){
//   return list[0] +"天前"
// } else if(len === 5){

// }

const diffTime = computed(() => {
  return function (time: number) {};
});
</script>
<style scoped lang="scss"></style>
