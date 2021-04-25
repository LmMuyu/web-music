<template>
  <el-row class="mt-24">
    <el-col :span="4"> </el-col>
    <el-col :span="16">
      <div class="flex">
        <nav class="shadow w-1/5 pl-6 pt-8">
          <ul
            class="list-none"
            v-for="(navItem, index) in listTitle"
            :key="index"
          >
            <li>
              <div class="py-6 text-xl">{{ navItem.title }}</div>
              <ul class="list-none">
                <li></li>
              </ul>
            </li>
          </ul>
        </nav>
        <div></div>
      </div>
    </el-col>
    <el-col :span="4"> </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ElRow, ElCol } from "element-plus";
import data from "./hooks/data";

const { listTitle } = data;
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}
</style>
