<template>
  <section
    ref="model"
    style="background-color: #99ccff"
    class="rounded-md z-10 absolute opacity shadow"
    :style="nodeinfo"
  >
    <el-row class="p-4">
      <MainInfoCard :infoData="infoData" />
    </el-row>
    <div class="whitespace-nowrap p-4 bordert">
      <button class="outline border-none" @click="updateLogout">
        退出登录
      </button>
    </div>

    <svg width="12" height="8" class="absolute -bottom-2 left">
      <polygon
        points="0,0 12,0 6,8"
        style="stroke: #99ccff; stroke-width: 1px; fill: #99ccff"
      ></polygon>
    </svg>
  </section>
</template>
<script setup lang="ts">
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  useAttrs,
} from "@vue/runtime-core";

import MainInfoCard from "./MainInfoCard.vue";
import { ElRow } from "element-plus";
import { useStore } from "vuex";

import { logout } from "../../../api/app/login";

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
});

async function updateLogout() {
  await logout();
  ctxEmit("logout");
}

onMounted(() => {
  nextTick(() => {
    nodeinfo.left = node.x + "px";

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
  border-top: 1px solid #b3d5f8;
}

.left {
  left: calc(50% - 12px);
}
</style>
