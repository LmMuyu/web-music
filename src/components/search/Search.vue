<template>
  <div class="w-full flex items-center justify-center pr-4 py-2 text-sm rounded-sm div_border">
    <span class="bg-white px-4 ip_icon" v-if="isIcon">
      <i class="iconfont iconsousuo"></i>
    </span>
    <input
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="keyupEnter"
      v-model="text"
      class="text-black w-full h-full border-none outline-none"
      style="z-index: 9"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, customRef } from "vue";

import { keyupEnter } from "./api/onSearch";

import type { PropType } from "vue";

const ctxEmit = defineEmits(["change", "focus", "blur", "update:modelValue"]);

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "xx",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isIcon: {
    type: Boolean,
    default: true,
  },
  class: [String, Array],
  inputClass: {
    type: [String, Array] as PropType<string | string[]>,
  },
  isrootClass: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
});

let searchValue = "";

function onFocus() {
  if (searchValue === "") return;
  ctxEmit("focus", searchValue || props.placeholder || "");
}

function onBlur() {
  ctxEmit("blur", false);
}

const changeModel = (value?: any, delay: number = 300) => {
  let timeout: number | null = null;

  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newVlaue: string) {
        const kongke = /\s/.test(newVlaue);

        if (newVlaue === "" && !kongke) {
          ctxEmit("blur", false);
        }

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          if (newVlaue != "") {
            searchValue = newVlaue;
            ctxEmit("change", newVlaue);
          }
          timeout = null;
        }, delay);
      },
    };
  });
};

const text = changeModel();
</script>

<style scoped lang="scss">
.ip_icon {
  @include Iconfont(#c9c9c9, 24);
  transform: translate(-2px, 2px);
}

.div_border {
  position: relative;
  border: #fff;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid #f5f5f5;
    border-radius: 10px;
    transform-origin: 0 0;
    transform: scale(0.5);
    width: 200%;
    height: 200%;
    box-sizing: border-box;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.03);
  }
}
</style>
