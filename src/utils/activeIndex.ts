import { computed, ComputedRef, ref } from "@vue/runtime-core";

import type { Ref } from "vue";

interface Options {
  style: "background" | "color";
  clickColor: string;
  moveColor: string;
}

export class activeIndex {
  mark: Ref<"click" | "move" | "default">;
  currentIndex: Ref<keyof any>;
  moveIndex: Ref<keyof any>;
  clickActive: (curIndex: keyof any) => void;
  leaveActive: (curIndex: keyof any) => void;
  moveActive: (curIndex: keyof any) => void;
  activeClass: ComputedRef<(index: keyof any) => { [x: string]: string }>;

  constructor(
    currentIndex: Ref<keyof any>,
    moveIndex: Ref<keyof any>,
    options?: Partial<Options>
  ) {
    this.mark = ref<"click" | "move" | "default">("click");
    this.currentIndex = currentIndex;
    this.moveIndex = moveIndex;

    this.clickActive = this.clickClass(this.currentIndex);
    this.moveActive = this.moveClass(this.currentIndex, this.moveIndex);
    this.leaveActive = this.leaveClass(this.currentIndex);

    this.activeClass = this.activeIndex(options);
  }

  activeIndex(options?: Partial<Options>) {
    const optionsData = this.isOptions(options);

    const { clickColor, moveColor } = optionsData;
    const styleKey = optionsData.style;

    const activeClass = computed(() => (index: keyof any) => {
      if (this.mark.value === "click" || this.currentIndex.value === index) {
        if (optionsData.style !== "color" && this.mark.value !== "default") {
          this.mark.value = "move";
        }

        return this.setColor(this.currentIndex, index, clickColor, styleKey);
      }

      return this.mark.value === "move"
        ? this.setColor(this.moveIndex, index, moveColor, styleKey)
        : {
            [styleKey]: styleKey === "color" ? "#636e72" : "#fff",
          };
    });

    return activeClass;
  }

  setColor(
    curIndex: Ref<keyof any>,
    index: keyof any,
    color: string,
    styleKey: string
  ) {
    return {
      [styleKey]:
        curIndex.value === index
          ? color
          : styleKey === "color"
          ? "#636e72"
          : "#fff",
    };
  }

  leaveClass(currentIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (currentIndex.value === curIndex) return;
      that.mark.value = "default";
    };
  }

  moveClass(currentIndex: Ref<keyof any>, moveIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (currentIndex.value === curIndex) return;

      that.mark.value = "move";
      moveIndex.value = curIndex;
    };
  }

  clickClass(currentIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (currentIndex.value === curIndex) {
        return;
      }

      that.mark.value = "click";
      currentIndex.value = curIndex;
    };
  }

  isOptions(data: Partial<Options> | undefined): Options {
    const newData: Options = {
      clickColor: "#74b9ff",
      moveColor: "#74b9ffb3",
      style: "color",
    };

    const result: Options = data ? (data as Options) : newData;

    return Object.assign(newData, result);
  }
}
