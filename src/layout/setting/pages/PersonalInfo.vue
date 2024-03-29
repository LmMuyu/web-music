<template>
  <el-container>
    <el-header height="36px" class="flex justify-center flex-col">
      <div>
        <RouteGo />
      </div>
    </el-header>
    <el-main>
      <div class="text-xl font-bold">编辑个人信息</div>
      <el-row>
        <el-col :span="14">
          <el-form :model="form" label-width="120px">
            <el-form-item label="昵称：">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="介绍：">
              <el-input v-model="form.desc" type="textarea" :rows="5" maxlength="300" />
            </el-form-item>
            <el-form-item label="出生日期：">
              <el-col :span="11">
                <el-date-picker v-model="form.birthday" type="date" style="width: 100%" />
              </el-col>
              <el-col :span="2" class="text-center">
                <span class="text-gray-500">-</span>
              </el-col>
            </el-form-item>
            <el-form-item label="地区：">
              <el-select v-model="chinaUrban.shi" class="m-2" placeholder="Select">
                <el-option
                  v-for="(shi, index) in chinaUrban.chinaShiJi"
                  :key="index"
                  :value="shi.name"
                  @click="shiOrQu(shi.id, 'shi')"
                />
              </el-select>
              <el-select v-model="chinaUrban.qu" class="m-2" placeholder="Select">
                <el-option
                  v-for="(value, key) in chinaUrban.chinaQuJi"
                  :key="key"
                  :value="value"
                  @click="shiOrQu(Number(key), 'qu')"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="form.gender">
                <el-radio label="保密" />
                <el-radio label="男" />
                <el-radio label="女" />
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="disabled" type="danger" @click="onSubmit">保存</el-button>
              <el-button @click="router.go(-1)">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" class="w-full flex flex-col items-center">
          <el-image class="w-40 h-40" :src="form.avatarUrl" />
          <div class="py-4">
            <el-upload
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :limit="1"
              class="flex justify-center flex-col items-center"
              :on-change="imgFileChange"
            >
              <el-button type="danger">修改图像</el-button>
              <template #tip>
                <div class="el-upload__tip">限定jpg/png图片，大小为500KB.</div>
              </template>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, reactive, watchEffect, onUnmounted, watch, ref, h } from "vue";

import { notContent } from "../hooks";
import { formatTime } from "../../../utils/filterDate";
import { updateUser, uploadAvatar } from "../../../api/setting";
import chinaCode from "../../../assets/“省份、城市” 二级联动编码数据.json";

import {
  ElContainer,
  ElHeader,
  ElMain,
  ElButton,
  ElFormItem,
  ElRadio,
  ElForm,
  ElRow,
  ElCol,
  ElDatePicker,
  ElInput,
  ElRadioGroup,
  ElImage,
  ElUpload,
  ElOption,
  ElSelect,
  ElMessage,
  ElNotification,
  NotificationHandle,
} from "element-plus";
import RouteGo from "./RouteGo.vue";

import type { Message } from "element-plus/lib/components/message";

const store = useStore();
const router = useRouter();

const disabled = ref(true);

const form = reactive({
  name: "",
  region: "",
  birthday: "",
  gender: "",
  desc: "",
  avatarUrl: "",
});

const chinaUrban = reactive({
  chinaShiJi: chinaCode,
  chinaQuJi: chinaCode[0].cities,
  shiId: chinaCode[0].id,
  quId: Number(Object.keys(chinaCode[0].cities)[0]),
  shi: chinaCode[0].name,
  qu: chinaCode[0].cities["110000"],
});

class lodingUpdate {
  private notHandle: NotificationHandle | undefined;
  updateing() {
    this.notHandle = ElNotification({
      title: "图片",
      duration: 0,
      customClass: "image_not",
      showClose: false,
      message: notContent(),
    });

    this.groupNode();
  }

  updatesourcess() {
    this.notHandle && this.notHandle.close();
  }

  private groupNode() {
    const notclass = document.getElementsByClassName("image_not");
    notclass[0] && this.putClass(notclass[0].children[0]);
  }

  private putClass(el: Element) {
    console.log(el);

    if (el) {
      //@ts-ignore
      el.style.width = "100%";
    }
  }
}

const userLoginData = computed<any>(store.getters["login/getUserData"]);

const formUserDataWatch = watchEffect(() => {
  if (Object.keys(userLoginData.value).length > 0) {
    const data = userLoginData.value.data;
    form.avatarUrl = data.avatarUrl;
    form.name = data.nickname;
    form.birthday = formatTime(data.userinfoData.birthday, "ymd");
    form.gender = userGender()[data.userinfoData.gender];
    // console.log(userLoginData.value);
    provincecity(data.userinfoData);
  }
});

function provincecity(user: any) {
  const provinceId = user.province;
  const cityId = user.city;

  chinaUrban.shiId = provinceId;
  chinaUrban.quId = cityId;
  const shidata = chinaCode.find((prov) => prov.id === provinceId);
  chinaUrban.shi = shidata.name;
  chinaUrban.qu = shidata.cities[cityId];
}

function userGender() {
  return {
    0: "保密",
    1: "男",
    2: "女",
  };
}

function userGenderNum(genderstr: string) {
  const gender = {
    保密: 0,
    男: 1,
    女: 2,
  };

  return gender[genderstr];
}

const onSubmit = async () => {
  // gender: 性别 0:保密 1:男性 2:女性
  // birthday: 出生日期,时间戳 unix timestamp
  // nickname: 用户昵称
  // province: 省份id
  // city: 城市id
  // signature：用户签名
  const formdata = new FormData();
  formdata.append("gender", userGenderNum(form.gender));
  formdata.append("birthday", String(dayjs(form.birthday).unix()));
  formdata.append("nickname", userLoginData.value.data.nickname);
  formdata.append("signature", form.desc);
  formdata.append("province", String(chinaUrban.shiId));
  formdata.append("city", String(chinaUrban.quId));
  const putUpdate = await updateUser(formdata);

  if (putUpdate.data.code) {
    ElMessage({
      showClose: true,
      message: "个人信息修改成功!",
      type: "success",
    });
  }
};

async function imgFileChange(file) {
  if (file.status === "fail") {
    const fileform = new FormData();
    fileform.append("imgFile", file.raw);

    const imageUpinstance = new lodingUpdate();
    try {
      imageUpinstance.updateing();

      const upres = await uploadAvatar(fileform);

      if (upres.data.code === 200) {
        updateUserData(upres.data, imageUpinstance.updatesourcess.bind(imageUpinstance));
      } else {
        throw new Error(`上传失败！,code:${upres.data.code}`);
      }
    } catch (error) {
      console.log(error);
      imageUpinstance.updatesourcess();
      sourcessMessage("error", error);
    }
  }
}

function updateUserData(updateData: any, close: Function) {
  const storeUserData = computed<any>(store.getters["login/getUserData"]);
  const data = JSON.parse(JSON.stringify(storeUserData.value)).data;
  const upUrl = updateData.data.url;

  data.avatarUrl = upUrl;
  data.userinfoData.avatarUrl = upUrl;
  console.log(data);

  store.commit("login/setUserInfo", [data, storeUserData.value.type]);
  close();
  sourcessMessage("success", "修改完成");
}

function sourcessMessage(type: keyof Message, message: string) {
  return ElMessage({
    message,
    //@ts-ignore
    type,
  });
}

const watchNewChinaUrbanStop = watch(chinaUrban, (newChinaUrban) => {
  chinaUrban.chinaQuJi = chinaCode.find((qu) => qu.id == newChinaUrban.shiId).cities;
});

const updateForm = watch(form, () => (disabled.value = true) && updateForm());

function shiOrQu(id: number, type: "shi" | "qu") {
  if (type === "shi") {
    chinaUrban.shiId = id;
  } else {
    chinaUrban.quId = id;
  }
}

onUnmounted(() => {
  formUserDataWatch();
  watchNewChinaUrbanStop();
});
</script>
<style scoped lang="scss"></style>
