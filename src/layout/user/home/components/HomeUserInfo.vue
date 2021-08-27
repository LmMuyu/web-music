<template>
  <div class="flex w-full">
    <div class="relative">
      <ElAvatar :size="125.6" :src="profile.avatarUrl" />
      <ElImage
        :src="profile.avatarDetail?.identityIconUrl"
        class="absolute right-0 bottom-0 w-6 h-6"
      />
    </div>
    <div class="flex flex-col w-full ml-6">
      <div>
        <p>{{ profile.nickname }}</p>
      </div>
      <div class="border_bottom flex py-6">
        <div class="w-1/2">aldwadawd</div>
        <div class="flex items-center justify-end w-1/2">
          <span
            v-for="(model, index) in models"
            :key="index"
            class="px-6 py-2 mx-6 cursor-pointer border_round rounded-lg"
            @click="model.click"
            @mouseenter="
              (model?.isfollows?.countRef ?? false) && model.isfollows.negate
            "
            @mouseleave="
              (model?.isfollows?.countRef ?? false) && model.isfollows.negate
            "
          >
            <p v-if="!model.hovername ?? false">
              {{ model.isfollows.countRef ? model.hovername : model.name }}
            </p>
            <p v-else>{{ model.name }}</p>
          </span>
        </div>
      </div>
      <div class="flex py-2">
        <div
          v-for="(info, index) in infolist"
          :key="index"
          class="flex items-center"
        >
          <span class="flex flex-col items-center justify-center">
            <p>{{ profile[info.key] }}</p>
            <p>{{ info.name }}</p>
          </span>
          <span
            v-if="info.gang ?? false"
            class="
              flex
              items-center
              justify-center
              text-4xl
              transform
              scale-x-50
              px-6
            "
            >|</span
          >
        </div>
      </div>
      <div>
        <p class="py-2">社交网络：微博</p>
        <p class="py-2">个人介绍：抖动</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";

import { ElAvatar, ElImage } from "element-plus";

import { useRefNegate } from "../../../../utils/useRefNegate";

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

const infolist = ref([
  {
    name: "动态",
    key: "eventCount",
    gang: true,
  },
  {
    name: "关注",
    key: "follows",
    gang: true,
  },
  {
    name: "粉丝",
    key: "followeds",
  },
]);

const models = [
  {
    name: "歌手页",
    click(e: Event) {
      console.log(e);
    },
  },
  {
    name: "发私信",
    click(e: Event) {
      console.log(e);
    },
  },
  {
    name: "关注",
    hovername: "取消关注",
    isfollows: useRefNegate(false),
    click(e: Event) {
      console.log(e);
    },
  },
];
</script>
<style scoped lang="scss">
.border_bottom {
  border-bottom: 1px solid #f5f5f5;
}

.border_round {
  border: 1px solid #ecf0f1;
}
</style>
