<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <p class="hover">
        <router-link
          style="color:#74b9ff"
          :to="{
            path: '/user/home',
            query: userinfo.userId
          }"
        >{{ userinfo.nickname }}</router-link>
      </p>
      <p class="text-sm mx-2" style="color: #b2bec3">{{ eventType(type) }}</p>
    </div>
    <div>
      <p class="text-sm">{{ diffTime(showTime, Date.now()) }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

import { diffTime } from "../../hooks/diffTime";
import { eventType } from "../../hooks/eventType";


const props = defineProps({
  userinfo: {
    type: Object,
    default: () => { },
  },
  showTime: {
    type: Number,
    required: true
  },
  type: {
    type: Number,
    required: true,
  },
});
</script>
<style scoped lang="scss">
.hover {
  text-decoration: none;
}

.hover:hover {
  text-decoration: underline;
}
</style>

