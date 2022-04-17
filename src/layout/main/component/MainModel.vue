<template>
  <section ref="model" class="rounded-md z-10 absolute -left-4 opacity shadow" :style="nodeinfo">
    <el-row class="p-4 bordert">
      <MainInfoCard :infoData="infoData" />
    </el-row>
    <div class="whitespace-nowrap p-4 bordert">
      <button class="outline border-none text-sm font-medium" @click="updateLogout">
        <span class="font-bold text-lg">退出登录</span>
        <span style="color: #1da1f2"> @{{ userdata.nickname }} </span>
      </button>
    </div>

    <svg width="12" height="8" class="absolute -bottom-2 left">
      <polygon
        points="0,0 12,0 6,8"
        style="stroke: #ebeef0; stroke-width: 1px; fill: #ebeef0"
      ></polygon>
    </svg>
  </section>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, useAttrs } from "@vue/runtime-core";

import MainInfoCard from "./MainInfoCard.vue";
import { ElRow } from "element-plus";
import { useStore } from "vuex";

import { logout } from "../../../api/app/login";
import { computed } from "vue";

const attrs = useAttrs();
const ctxEmit = defineEmits(["logout"]);
const store = useStore();

const infoData = attrs["infoData"];
const model = ref(null);

const node = store.getters["maintags/getPosInfo"];
const nodeinfo = reactive({
  left: "",
  top: "",
  width: "",
  background: "#F7F9FA",
});

async function updateLogout() {
  await logout();
  ctxEmit("logout");
}

const userdata = computed(() => {
  const storedata = store.getters["login/getUserData"]();
  return storedata.data;
});

onMounted(() => {
  nextTick(() => {
    nodeinfo.left = "16px";

    const height = model.value.clientHeight;

    let y = parseInt(node.y);
    y = y - height;

    nodeinfo.top = y + "px";
    nodeinfo.width = node.width + "px";

    nextTick(() => {
      const rect = model.value.getBoundingClientRect();

      store.commit("maintags/setPosInfo", {
        mx: rect.left,
        my: rect.top,
        maxX: rect.right,
        maxY: rect.bottom,
      });
    });
  });
});
</script>
<style scoped lang="scss">
.opacity {
  opacity: 0;
  animation: opac 0.2s cubic-bezier(0.06, 0.68, 1, 0.89) forwards;
}

@keyframes opac {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.shadow {
  box-shadow: 0 0 8px 0px #dfe4ea;
}

.outline {
  outline: none;
}

.bordert {
  border-top: 1px solid #beddfc;
}

.left {
  left: calc(50% - 12px);
}
</style>
