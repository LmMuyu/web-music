<template>
  <div class="flex justify-center items-center h-full">
    <span class="icon_text bg-white py-1 px-1 rounded-l-lg">
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
      class="text-black w-48 py-2 px-2 border-none outline-none rounded-r-lg"
    />
    <div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmit, defineProps, customRef } from "vue";

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
    default: true
  }
});

const ctxEmit = defineEmit(["change", "focus", "blur"]);
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
</style>
