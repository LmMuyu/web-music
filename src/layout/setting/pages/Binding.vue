<template>
  <ElContainer>
    <ElHeader height="48px" class="flex items-center">
      <FontIcon
        @click="router.go(-1)"
        size="24"
        class="cursor-pointer"
        icon="iconarrow-right-copy"
      />
    </ElHeader>
    <ElMain>
      <div class="text-sm font-bold py-4">注册账号</div>
      <div class="p-4">
        <div class="flex">
          <FontIcon size="42" color="#ff9d1c" icon="iconshoujichongzhi" />
          <div class="flex flex-col justify-center w-full ml-4">
            <span class="text-sm">手机</span>
            <span class="text-xs"
              >使用手机号注册：{{
                userBindingInfo["bindingInfo"] &&
                phoneStars(
                  userBindingInfo["bindingInfo"].find((info) => info.type === 1)?.tokenJsonStr
                    .cellphone
                )
              }}</span
            >
          </div>
          <div class="w-full flex justify-end items-center">
            <ElButton round @click="centerDialogVisible = true"> 修改密码 </ElButton>

            <el-dialog v-model="centerDialogVisible" title="修改密码" width="40%" center>
              <div class="py-4">
                您的手机号为：
                {{
                  userBindingInfo["bindingInfo"] &&
                  phoneStars(
                    userBindingInfo["bindingInfo"].find((info) => info.type === 1)?.tokenJsonStr
                      .cellphone
                  )
                }}
              </div>
              <div>
                <el-input
                  v-model="pass"
                  type="password"
                  placeholder="设置新的登陆密码，需8-20位，至少包含字母/数字/字符2中组合"
                />
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="danger" @click="centerDialogVisible = false">下一步</el-button>
                  <el-button @click="centerDialogVisible = false"> 取消 </el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </div>
      </div>
      <div class="text-sm font-bold">其他登录方式</div>
      <div class="flex flex-col justify-center p-4">
        <div class="py-4 flex justify-between" v-for="icon in iconclass" :key="icon.icon">
          <div class="flex items-center">
            <FontIcon
              size="42"
              :color="bindingToComplete(icon.type) ? icon.color : '#607d8b'"
              :icon="icon.icon"
            />
            <div
              class="flex flex-col h-full ml-1"
              :class="bindingToComplete(icon.type) ? 'justify-around' : 'justify-center'"
            >
              <span class="text-xs">{{ icon.name }}</span>
              <span class="text-xs" v-if="bindingToComplete(icon.type)">
                ID：{{ bindingFn(icon.name, findBinding(icon.type)) }}
              </span>
            </div>
          </div>
          <el-button
            v-if="!bindingToComplete(icon.type)"
            size="small"
            round
            class="flex items-center"
          >
            <FontIcon size="16" color="#f89898" icon="iconadd-select" />
            <span class="px-1">绑定</span>
          </el-button>
          <el-button v-else size="small" round> 已绑定 </el-button>
        </div>
      </div>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { ElContainer, ElMain, ElButton, ElHeader, ElInput, ElDialog } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const store = useStore();
const router = useRouter();
const centerDialogVisible = ref(false);
const pass = ref("");
const iconclass = ref([
  { type: 4, icon: "iconweixin", color: "rgb(0,172,132)", name: "微信" },
  { type: 5, icon: "iconv3-fuben_QQ", color: "#C0EAF7", name: "QQ" },
]);

const userBindingInfo = computed(store.getters["login/getUserBindingInfo"]);
console.log(userBindingInfo.value);

function bindingToComplete(type: number) {
  return userBindingInfo.value["bindingType"].indexOf(type) > -1 ? true : false;
}

function findBinding(type: number) {
  const bindinginfo = userBindingInfo.value["bindingInfo"].find((binding) => binding.type === type);
  return bindinginfo;
}

function bindingFn(bindingname: string, data: any) {
  switch (bindingname) {
    case "QQ":
      return bindingQQ(data);
    default:
      return "";
  }
}

function bindingQQ(data: any) {
  return data.tokenJsonStr.nickname;
}

function phoneStars(cellphone: string) {
  const left = cellphone.slice(0, 3);
  const right = cellphone.slice(7);

  return left.padEnd(7, "*") + right;
}
</script>
<style scoped lang="scss"></style>
