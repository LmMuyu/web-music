<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <div>
        <router-link style="color:#409EFF" class="hover" :to="{
          path: '/user/home', query: {
            uid: userinfo.userId, isself: false, issinger: false
          }
        }">
          {{ userinfo.nickname }}
        </router-link>
      </div>
      <p class="text-sm mx-2" style="color: #b2bec3">{{ eventType(type) }}</p>
    </div>
    <div>
      <p class="text-xs" style="color: rgb(178 190 195)">{{ timestr }}</p>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { defineProps, PropType } from "vue";

import { eventType } from "../hooks/eventType";
import { DynamicEvent } from "../methods";


type includeKey<T, K extends keyof T> = keyof T extends K ? any : T[K]

const props = defineProps({
  userinfo: {
    type: Object as PropType<includeKey<DynamicEvent, "dynamicuser">>,
    default: () => ({}),
  },
  timestr: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
});

</script>
<style scoped lang="scss">
.hover {
  @include Decoration_Hover
}
</style>
