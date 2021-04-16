<template>
  <div style="margin-top: 15px">
    <el-input
      placeholder="请输入内容"
      v-model="phoneNumber"
      class="input-with-select"
    >
      <template #prepend>
        <el-select v-model="countries" placeholder="请选择">
          <el-option label="餐厅名" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
      </template>
    </el-input>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { ElInput, ElSelect, ElOption } from "element-plus";
import { mapState } from "vuex";

const state = { ...mapState(["countriesCode"]) };

console.log(state);

const countries = ref("");
const phoneNumber = ref("");
</script>
<style lang="scss" scoped></style>
