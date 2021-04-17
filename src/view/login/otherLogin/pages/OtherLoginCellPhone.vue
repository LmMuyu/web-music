<template>
  <div style="margin-top: 15px" class="absolute top-1/2 left-1/2">
    <el-input
      placeholder="请输入内容"
      v-model="phoneNumber"
      class="input-with-select"
    >
      <template v-slot:prepend>
        <el-select class="select" v-model="countries" :placeholder="countries">
          <el-option class="input" label="餐厅名" value="1"></el-option>
          <el-option class="input" label="订单号" value="2"></el-option>
          <el-option class="input" label="用户电话" value="3"></el-option>
        </el-select>
      </template>
    </el-input>
  </div>
</template>
<script setup lang="ts">
import { ref, toRaw } from "@vue/reactivity";
import { computed, getCurrentInstance } from "@vue/runtime-core";
import { ElInput, ElSelect, ElOption } from "element-plus";

interface CuntriesCode {
  data: Array<Record<string, any>>;
}

const countriesCode: CuntriesCode = toRaw(
  getCurrentInstance()?.appContext.config.globalProperties.$store.state
    .countriesCode
);
const countries = ref("+" + countriesCode.data[0].countryList[0].code);
const phoneNumber = ref("");

const countryList = computed(() => {
  return countriesCode.data.reduce(
    (pre, cur) => pre.concat(...cur.countryList),
    []
  );
});

console.log(countryList.value);
</script>
<style lang="scss" scoped>
.select .input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
