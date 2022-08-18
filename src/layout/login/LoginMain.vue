<template>
  <el-container class="bg-white" style="height: 100vh">
    <el-main>
      <el-row
        style="background-color: #fafafa"
        class="flex justify-center items-center w-full h-full"
      >
        <el-col :span="8" class="h-full relative">
          <keep-alive>
            <component :is="componentId"></component>
          </keep-alive>
          <Bookmark @switchLogin="switchLogin" class="absolute right-0 top-0 mt-4" />
        </el-col>
        <el-col :span="16" class="h-full py-2 bgimage"></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { shallowRef } from "@vue/reactivity";

import { createAsComponent } from "../../utils/createAsComponent";
import { ElContainer, ElMain, ElRow, ElCol } from "element-plus";
import Bookmark from "./components/Bookmark.vue";

const MobilePhone = createAsComponent(() => import("./loginWay/mobilePhone/MobilePhone.vue"));
const QR = createAsComponent(() => import("./loginWay/qr/QR.vue"));

const componentId = shallowRef(QR);

function switchLogin() {
  if (QR === componentId.value) {
    componentId.value = MobilePhone;
  } else {
    componentId.value = QR;
  }
}
</script>

<style scoped lang="scss">
.shadow {
  box-shadow: 0 0 9px #636;
}
.shadow {
  box-shadow: 0 0 9px #636e72;
}

.bgimage {
  position: relative;
  background-image: url("https://images.pexels.com/photos/991012/pexels-photo-991012.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-box-shadow: 0px 0px 10px 0px rgba(234, 234, 234, 1);
    -moz-box-shadow: 0px 0px 10px 0px rgba(234, 234, 234, 1);
    box-shadow: 0px 0px 10px 0px rgba(234, 234, 234, 1);
  }
}
</style>
