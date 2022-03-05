<template>
  <div class="w-full h-9 overflow-hidden bg-white flex items-center text-sm rounded-md div_border">
    <div class="flex items-center justify-center px-4">
      <font-icon v-if="isIcon" icon="iconsousuo"></font-icon>
    </div>
    <div class="h-full">
      <input
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.enter="keyupEnter"
        v-model="text"
        class="text-black w-full h-full border-none outline-none text-xs thecursor"
        style="z-index: 9"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, customRef } from "vue";

import { keyupEnter } from "./api/onSearch";

import type { PropType } from "vue";
import FontIcon from "../fonticon/FontIcon.vue";

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
            value = searchValue = newVlaue;
            ctxEmit("change", newVlaue);
          } else {
            value = searchValue = "";
          }

          clearTimeout(timeout);
          timeout = null;

          ctxEmit("update:modelValue", newVlaue);
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

  -webkit-box-shadow: 0px 0px 4px 3px rgba(245, 246, 250, 1);
  -moz-box-shadow: 0px 0px 4px 3px rgba(245, 246, 250, 1);
  box-shadow: 0px 0px 4px 3px rgba(245, 246, 250, 1);
}

.thecursor {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 10px;
    height: 100%;
    background-color: black;
    animation: flashing 0.25ms ease-in-out infinite;
  }

  @keyframes flashing {
    0% {
      opacity: 0;
    }

    33% {
      opacity: 1;
    }

    66% {
      opacity: 0;
    }

    100% {
      opacity: 0;
    }
  }
}
</style>
