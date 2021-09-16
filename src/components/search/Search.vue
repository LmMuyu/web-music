<template>
  <div class="w-3/4 flex items-center justify-center pr-4 border">
    <span class="icon_text h-full bg-white px-4" v-if="isIcon">
      <i class="iconfont iconsousuo"></i>
    </span>
    <input
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="keyupEnter"
      v-model="text"
      class="text-black w-full p-2 border-none outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, customRef } from "vue";

import { keyupEnter } from "./api/onSearch";

import type { PropType } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  returnresdata: {
    type: Function,
    required: true,
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

const ctxEmit = defineEmits(["change", "focus", "blur", "update:modelValue"]);
let searchValue = "";

function onFocus() {
  if (searchValue === "") return;
  ctxEmit("focus", searchValue || props.placeholder || "", props.returnresdata);
}

function onBlur() {
  ctxEmit("blur", false);
}

const changeModel = (value?: any, delay: number = 300) => {
  let timeout: NodeJS.Timeout | null = null;

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
            ctxEmit("change", newVlaue, props.returnresdata);
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
@include Iconfont(rgb(204, 204, 204, 1));

.icon_text {
  transform: translateX(1px);
}

.border {
  position: relative;
}

.border::before {
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
</style>
