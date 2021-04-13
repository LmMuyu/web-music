<template>
  <div class="inline-flex justify-between bottom_line">
    <p class="text-left text-xl">热门主播</p>
  </div>
  <div class="mt-3"></div>
  <div>
    <ul class="list-none ml-6 mr-6">
      <li v-for="anchors in anchorsList" :key="anchors.id" class="pt-2 pb-2">
        <a href=";;" class="flex z-50">
          <div>
            <img :src="anchors.avatarUrl + '?param=40y40'" alt="" draggable="false" />
          </div>
          <div
            class="flex flex-col ml-3"
            :class="{
              'justify-center': !!anchors.anchorsdetail.profile.mainAuthType
                .desc,
            }"
            style="width: 150px"
          >
            <p>{{ anchors.nickName }}</p>
            <p class="text-base text-gray-500">
              {{ title(anchors.anchorsdetail.profile.mainAuthType) }}
            </p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { getPopularAnchors } from "../../../../api/indexasideright/index";

interface anchorsType {
  desc: string;
  tags: Array<string>;
}

const anchorsList = ref<any[]>([]);

const title = computed(() => {
  return function (mainAuthType: anchorsType) {
    if (mainAuthType.desc === "") return "";

    return (
      mainAuthType.desc +
      (!!mainAuthType.tags
        ? mainAuthType.tags.reduce((pre, cur) => (pre += `、${cur}`), "")
        : "")
    );
  };
});

getPopularAnchors({
  method: "get",
  url: "/dj/toplist/popular",
  params: {
    limit: 5,
  },
}).then((res) => {
  console.log(res);

  anchorsList.value = res;
});
</script>
<style lang="scss" scoped>
.bottom_line {
  position: relative;
  width: calc(100% - 24px - 24px);
  ::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    display: block;
    border: 1px solid #ecf0f1;
  }
}
</style>
