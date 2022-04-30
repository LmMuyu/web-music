<template>
  <div class="flex flex-col py-6 bottom_solid">
    <div class="flex" style="white-space: nowrap">
      <p class="text-sm">动态：20</p>
      <p class="px-4 text-sm">关注：20</p>
      <p class="px-4 text-sm">订阅：20</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";

import { ElAvatar } from "element-plus";
import { computed, reactive, watchEffect } from "vue";
// import { getUserDetail } from "../../../../api/subscription";

const store = useStore();

const userInfo = computed(store.getters["login/getUserData"]);

// const userdetail = reactive({
//   uid: 0,
//   avatar: "",
//   nickname: "",
//   other: {},
// });

// watchEffect(() => {
//   if (userInfo.value) {
//     //@ts-ignore
//     const userdata = userInfo.value.data;
//     console.log(userdata);

//     userdetail.uid = userdata.id;
//     userdetail.avatar = userdata.avatarUrl;
//     userdetail.nickname = userdata.nickname;
//   }
// });
</script>
<style scoped lang="scss">
.bottom_solid {
  border-bottom: 1px solid #dfe6e9;
}
</style>
