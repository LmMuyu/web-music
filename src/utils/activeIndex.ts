import { computed, ComputedRef, ref } from "@vue/runtime-core";

import type { Ref } from "vue";

interface Options {
  style: "background" | "color";
  clickColor: string;
  moveColor: string;
}

export class activeIndex {
  private mark: Ref<"click" | "move" | "default">;
  private currentIndex: Ref<keyof any>;
  private moveIndex: Ref<keyof any>;
  clickActive: (curIndex: keyof any) => void;
  leaveActive: (curIndex: keyof any) => void;
  moveActive: (curIndex: keyof any) => void;
  activeStyle: ComputedRef<(index: keyof any) => { [x: string]: string }>;

  constructor(
    currentIndex?: Ref<keyof any>,
    moveIndex?: Ref<keyof any>,
    options?: Partial<Options>
  ) {
    this.mark = ref<"click" | "move" | "default">("click");
    this.currentIndex = currentIndex || ref(0);
    this.moveIndex = moveIndex || ref(0);

    this.clickActive = this.clickClass(this.currentIndex);
    this.moveActive = this.moveClass(this.currentIndex, this.moveIndex);
    this.leaveActive = this.leaveClass(this.currentIndex);

    this.activeStyle = this.activeIndex(options);
  }

  private activeIndex(options?: Partial<Options>) {
    const optionsData = this.isOptions(options);

    const { clickColor, moveColor } = optionsData;
    const styleKey = optionsData.style;

    const activeStyle = computed(() => (index: keyof any) => {
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

    return activeStyle;
  }

  private setColor(
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

  private leaveClass(currentIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (currentIndex.value === curIndex) return;
      that.mark.value = "default";
    };
  }

  private moveClass(currentIndex: Ref<keyof any>, moveIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (currentIndex.value === curIndex) return;

      that.mark.value = "move";
      moveIndex.value = curIndex;
    };
  }

  private clickClass(currentIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (currentIndex.value === curIndex) {
        return;
      }

      that.mark.value = "click";
      currentIndex.value = curIndex;
    };
  }

  private isOptions(data: Partial<Options> | undefined): Options {
    const newData: Options = {
      clickColor: "#74b9ff",
      moveColor: "#74b9ffb3",
      style: "color",
    };

    const result: Options = data ? (data as Options) : newData;

    return Object.assign(newData, result);
  }
}
