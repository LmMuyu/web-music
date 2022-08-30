<template>
  <el-container ref="asidetags" class="h-full">
    <el-header class="flex items-center justify-center">
      <span style="color: #409eff" class="text-lg" > 余音音乐 </span>
    </el-header>
    <el-main>
      <MainTag />
    </el-main>
    <el-footer height="150px" ref="footer" class="flex itmes-start justify-center px-4 pb-4">
      <div v-if="watchUserData.loginUserData.tramsformButton" class="w-full h-3/4">
        <MainAsideCard :infoData="watchUserData.loginUserData.userdata" />
      </div>
      <ButtonEnter v-else-if="windowResize" />
      <AvatarEnter v-else />
    </el-footer>
  </el-container>
</template>
<script setup lang="tsx">
import { nextTick, onMounted, ref } from "@vue/runtime-core";
import { inject } from "vue";
import { useStore } from "vuex";

import { watchUserData } from "../hooks/methods";
import { AvatarEnter, ButtonEnter } from "./LoginModule";

import MainTag from "./MainTag.vue";
import MainAsideCard from "./MainAsideCard.vue";
import { ElContainer, ElMain, ElHeader, ElFooter } from "element-plus";

const store = useStore();
const asidetags = ref(null);
const footer = ref(null);

const windowResize = inject("windowResize");

function setButtonStyle() {
  const btn = document.querySelector(".el-button") as HTMLElement;

  if (btn) {
    btn.style.outline = "none";
    btn.classList.add(...["justify-center", "w-1/2"]);
  }
}

function reviseButtonPos() {
  const mainheight = asidetags.value.clientHeight;
  const mainwidth = asidetags.value.clientWidth;

  const cardheight = footer.value.clientHeight;
  const cardwidth = footer.value.clientWidth;

  store.commit("maintags/setPosInfo", {
    x: mainwidth - cardwidth - 8,
    y: mainheight - cardheight,
    width: cardwidth + 16,
  });
}

onMounted(() => {
  nextTick().then(() => {
    reviseButtonPos();
    setButtonStyle();
  });
});
</script>
<style scoped lang="scss"></style>
