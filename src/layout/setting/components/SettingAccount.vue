<template>
  <el-button v-if="!islogin" color="#fab6b6" :dark="true" round @click="" size="small"
    >立即登录</el-button
  >
  <div v-else>
    <div class="flex items-center">
      <FontIcon
        v-for="icon in iconclass"
        :key="icon.icon"
        :icon="icon.icon"
        size="28"
        :color="userBindingInfo['bindingType'].indexOf(icon.type) > -1 ? icon.color : '#EBEDF0'"
        class="px-2"
      />
      <router-link to="/setting/binding" class="text-sm">绑定账号>></router-link>
    </div>
    <div class="py-4">
      <el-button size="small" round>
        <router-link to="/setting/personalinfo"> 修改个人信息 </router-link>
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";

import { ElButton } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const store = useStore();
const iconclass = ref([
  { type: 4, icon: "iconweixin", color: "rgb(0,172,132)" },
  { type: 5, icon: "iconv3-fuben_QQ", color: "#C0EAF7" },
]);

const islogin = computed(() => {
  return store.getters["login/getIslogin"];
});

const userBindingInfo = computed(store.getters["login/getUserBindingInfo"]);
</script>
<style scoped lang="scss"></style>
