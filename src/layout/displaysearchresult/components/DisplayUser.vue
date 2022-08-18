<template>
  <BetterScroll :isminusviewposth="true" :open-h-render="false">
    <router-link
      v-for="(user, index) in data"
      :key="index"
      :to="{
        path: '/user/home',
        query: {
          uid: user.userId,
        },
      }"
    >
      <ElRow
        class="py-2 cursor-pointer"
        :align="'middle'"
        :style="{
          backgroundColor:
            activeIndex === index ? '#F0F2F5' : index % 2 > 0 ? '#fafafa' : '#ffffff',
        }"
        @mouseenter="activeIndex = index"
        @mouseleave="activeIndex = null"
      >
        <ElCol :span="2">
          <ElAvatar :size="64" :src="user.avatarUrl + '?param=64y64'"></ElAvatar>
        </ElCol>
        <ElCol class="text-sm flex items-center" :span="22">
          <span style="color: #303133">{{ user.nickname }} </span>
          <FontIcon class="px-2" :color="user.gender === 1 ? ' #79bbff' : '#F56C6C'" :icon="user.gender === 1 ? 'iconxingbienan' : 'iconxingbienv-01'"></FontIcon>
        </ElCol>
      </ElRow>
    </router-link>
  </BetterScroll>
</template>
<script setup lang="ts">
import { User } from "..";

import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import { ElRow, ElCol, ElAvatar } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

import { PropType, ref } from "vue";

const props = defineProps({
  data: {
    type: Array as PropType<User[]>,
    default: () => [],
  },
});

const activeIndex = ref(null);
</script>
<style scoped lang="scss"></style>
