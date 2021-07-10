<template>
  <footer class="px-14 pt-10">
    <div class="inline-flex items-center">
      <input
        type="checkbox"
        v-model="protocol"
        class="outline-none border-none"
      />
      <label class="px-1">同意</label>
    </div>
    <a
      href="javascript:void(0)"
      v-for="(deal, index) in footerDeal"
      :key="index"
      class="text-blue-700"
      >{{ `《${deal.text}》` }}</a
    >
    <img
      src="../../../../assets/qr_login_icon.png"
      alt=""
      class="absolute bottom-0 right-0 w-14 h-14 cursor-pointer"
      @click="otherLogin"
    />
  </footer>
</template>
<script setup lang="ts">
import { computed, defineEmit, inject } from "@vue/runtime-dom";
import { footerDeal } from "../api/data";
import { ElMessage } from "element-plus";

const ctxEmit = defineEmit(["onOther"]);

const protocol: { value: boolean } = inject("protocol")!; //是否同意条款
let infoB = false;

const dealInfo = computed(() => {
  return footerDeal.map((str, index) => `《${str.text}》`);
});

function otherLogin() {
  if (!protocol.value && !infoB) {
    infoB = true;
    ElMessage({
      message: "dwadaw",
      onClose: () => {
        infoB = false;
      },
    });

    return;
  }
  ctxEmit("onOther", "qrlogin");
}
</script>
<style lang="scss" scoped></style>
