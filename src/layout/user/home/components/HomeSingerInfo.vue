<template>
  <el-row class="flex w-full m-4">
    <el-col :span="5">
      <el-image
        style="border-radius: 96px"
        class="w-48 h-48 object-cover"
        :src="singerinfo.avatarUrl"
      ></el-image>
    </el-col>
    <el-col :span="19" class="pl-6">
      <div class="text-lg font-medium">{{ singerinfo.nickname }}</div>
      <el-row class="pb-2 flex justify-between border-b-2 border-solid border-x-neutral-300">
        <el-col class="flex items-center" :span="12">
          <div class="rounded-xl px-2" style="background-color: #fab6b6">
            <el-avatar
              v-if="singerinfo?.other?.wyiyuntubiaoUrl"
              :size="14"
              :src="singerinfo?.other?.wyiyuntubiaoUrl ?? ''"
              class="px-2"
            />
            <span class="text-sm" style="color: #fde2e2">{{ singerinfo.tags }}</span>
          </div>
        </el-col>
        <el-col :span="12" class="flex justify-end">
          <el-button
            v-for="(_, key) in module"
            :key="key"
            class="mx-4"
            size="small"
            type="primary"
            plain
          >
            <font-icon colos="#f89898" icon="iconjia" size="14"></font-icon>
            <span class="px-2"> {{ module[key] }} </span>
          </el-button>
        </el-col>
      </el-row>
      <div class="flex items-center">
        <div class="px-2 text-sm" v-for="(_, key) in singerModuleInfo" :key="key">
          {{ singerModuleInfo[key] }}数：{{ singerinfo.artist?.[key] }}
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { module, singerModuleInfo } from "../hooks/singer";
import { useWatchRoutePath } from "../../../../utils/useWatchHost";
import { watch } from "vue";

import { ElImage, ElRow, ElCol, ElAvatar, ElButton } from "element-plus";
import FontIcon from "../../../../components/fonticon/FontIcon.vue";

const props = defineProps({
  singerinfo: {
    type: Object,
    default: () => ({}),
  },
});

const watchRoute = useWatchRoutePath();

const stop = watch(watchRoute, (newroute) => {
  console.log(newroute);

  if (newroute.path.indexOf("/user") === -1) {
    props.singerinfo.stop();
    stop();
  }
});
</script>
<style scoped lang="scss"></style>
