<template>
  <section class="w-full h-12 my-6 flex items-center">
    <div class="w-12 h-full">
      <img :src="musicDetail.picUrl" class="object-cover" alt="" />
    </div>
    <div class="flex flex-col justify-around ml-4 decor">
      <router-link
        style="color: #74b9ff"
        :to="{ path: '/playlist', query: { id: musicDetail.id } }"
        class="decoration"
        target="_blank"
      >
        {{ musicDetail.name }}
      </router-link>
      <div class="flex items-center decor">
        <router-link
          style="color: #74b9ff"
          class="decoration"
          v-for="(singer, index) in musicDetail.singerInfo"
          :key="singer.id"
          :to="{ path: '/user/home', query: { uid: singer.id } }"
        >
          {{ singer.name }}{{ addIdentifier(index) }}
        </router-link>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  musicDetail: {
    type: Object,
    default: () => ({}),
  },
});

const addIdentifier = computed(() => {
  return function (index: any) {
    return index < props.musicDetail.singerInfo.length - 1 && "/";
  };
});
</script>
<style scoped lang="scss">
.decor {
  &:deep(.decoration) {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
