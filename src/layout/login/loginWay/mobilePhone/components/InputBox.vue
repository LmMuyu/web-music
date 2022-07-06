<template>
  <section :class="class" class="flex items-center relative">
    <div class="flex items-center justify-center w-full">
      <div ref="inputbox" :style="returnStyleOptions" class="root flex pr-4 p-2 w-full rounded-lg">
        <div class="icon px-4" v-if="isIcon">
          <i class="iconfont" :class="iconfont"></i>
        </div>
        <input
          class="w-full input"
          :type="type"
          :placeholder="placeholder"
          v-model="text"
          @blur="onBlur"
          @focus="onFocus"
        />
      </div>
    </div>
    <div class="absolute left-0 bottom-0">
      <span
        v-if="isErrorInfo"
        class="flex items-center whitespace-nowrap text-sm absolute left-0 bottom-0 transform-gpu translate-y-5 icon"
      >
        <i style="color: #d63031" class="iconfont icondel"></i>
        <p style="color: #d63031">{{ errorInfo }}</p>
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
import { customRef, ref } from "@vue/reactivity";
import { nextTick, onMounted, useAttrs } from "vue";

import { useStyle } from "../../../hooks/useStyle";

import type { Ref } from "vue";

const attrs = useAttrs();

defineExpose({
  showErrorInfo,
  reviseStyle,
});

const ctxEmits = defineEmits(["update:modelValue", "change"]);

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  iconfont: {
    type: String,
    default: "iconwode",
  },
  isIcon: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  class: String,
});

const inputbox = ref<HTMLElement | null>(null);
const isErrorInfo = ref(false);
const errorInfo = ref("");

const { style, returnStyleOptions } = useStyle();

function onBlur(e: Event) {
  const result = strategy((e.target as HTMLInputElement).value);

  if (result) {
    ctxEmits("change", result);
  }
}

function onFocus() {
  if (isErrorInfo.value) {
    showErrorInfo("");
  }
}

const text = (function (value: number | string, delay = 150) {
  let timeout;

  return customRef((track, tigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue: number | string) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          value = newValue;
          ctxEmits("update:modelValue", newValue);
          timeout = null;
          tigger();
        }, delay);
      },
    };
  });
})("") as Ref<string>;

function setAttrs() {
  nextTick(() => {
    for (const key in attrs) {
      if (key === "class") {
        const strclass = inputbox.value.getAttribute("class");

        if (strclass) {
          inputbox.value.setAttribute("class", strclass + " " + attrs[key]);
        }
      }

      inputbox.value.setAttribute(key, attrs[key] + "");
    }
  });
}

function showErrorInfo(info: string) {
  errorInfo.value = info;
  isErrorInfo.value = !isErrorInfo.value;
}

function crcMethods() {
  this.phone_ifphonewrite = function (data: string) {
    return /^(\+(0|86|17951))?\w/g.test(data);
  };

  this.phone_ifphonelen = function (data: string) {
    return /^(\+(0|86|17951))?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
      data
    );
  };

  this.pass_ifpasswordlen6wei = function (data: string) {
    return /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/.test(data);
  };
}

function strategy(data: number | string) {
  if (String(data).length === 0) return;

  const verifyMethods = new crcMethods();

  for (const key in verifyMethods) {
    if (props.type === "text") {
      if (key.startsWith("phone") && !verifyMethods[key](data)) {
        if (key === "phone_ifphonelen") {
          showErrorInfo("请输入11位数手机号码!");
        } else if (key === "phone_ifphonewrite") {
          showErrorInfo("请输入正确的手机号码!");
        }

        return false;
      }
    } else if (props.type === "password") {
      if (key.startsWith("pass") && !verifyMethods[key](data)) {
        if (key === "pass_ifpasswordlen6wei") {
          showErrorInfo("请输入密码包含 数字,英文,字符中的两种以上，长度6-20密码!");
        }

        return false;
      }
    }
  }

  return true;
}

type read<T> = { [P in keyof T]?: T[P] };

function reviseStyle(options: read<CSSStyleDeclaration>) {
  style.value = options;
}

onMounted(() => {
  setAttrs();
});
</script>
<style scoped lang="scss">
.root {
  border: 1px solid #b2bec3;
}

.input {
  outline: none;
}

.icon {
  @include Iconfont(#2d3436, 20);
}
</style>
