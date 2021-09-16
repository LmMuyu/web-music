import { computed, ComputedRef, ref } from "@vue/runtime-core";

import { Ref, unref } from "vue";

interface Options {
  style: "background" | "color";
  defaultActiveColor: string;
  initColor: string;
  enterColor: string;
  isMove: boolean;
  initSetStyle: boolean;
}

function isType(data: any) {
  return Object.prototype.toString.call(data).match(/\[\w+\s(.+)\]/)?.[1];
}

function initIndex(index: Ref<keyof any> | null | undefined) {
  return isType(unref(index)) === "Null" || typeof unref(index) === "undefined"
    ? ref(0)
    : index!;
}

export class activeIndex {
  private mark: Ref<"current" | "enter" | "default">;
  private currentIndex: Ref<keyof any>;
  private moveIndex: Ref<keyof any>;
  private initSetStyle!: boolean;
  public clickActive: (curIndex: keyof any) => void;
  public leaveActive: (curIndex: keyof any) => void;
  public moveActive: (curIndex: keyof any) => void;
  public activeStyle: ComputedRef<
    (index: keyof any) => { [x: string]: string }
  >;

  constructor(
    currentIndex?: Ref<keyof any> | null,
    moveIndex?: Ref<keyof any> | null,
    options?: Partial<Options>
  ) {
    this.mark = ref<"current" | "enter" | "default">("current");
    this.currentIndex = initIndex(currentIndex);
    this.moveIndex = initIndex(moveIndex);

    this.clickActive = this.currentStyle(this.currentIndex);
    this.moveActive = this.centerStyle(this.currentIndex, this.moveIndex);
    this.leaveActive = this.leaveStyle(this.currentIndex);

    this.activeStyle = this.activeIndex(options);
  }

  private activeIndex(options?: Partial<Options>) {
    const optionsData = this.isOptions(options);

    const { initColor, enterColor, initSetStyle, defaultActiveColor } =
      optionsData;
    this.initSetStyle = initSetStyle;

    const styleKey = optionsData.style;
    const isMove = optionsData.isMove;

    const activeStyle = computed(() => (index: keyof any) => {
      if (!isMove && this.initSetStyle) {
        if (
          this.mark.value === "current" ||
          this.currentIndex.value === index
        ) {
          if (optionsData.style !== "color" && this.mark.value !== "default") {
            this.mark.value = "enter";
          }

          return this.setColor(
            this.currentIndex,
            index,
            defaultActiveColor,
            styleKey
          );
        }
      } else {
        this.initSetStyle && (this.mark.value = "enter");
      }

      return this.mark.value === "enter"
        ? this.setColor(this.moveIndex, index, enterColor, styleKey)
        : {
            [styleKey]: styleKey === "color" ? "#636e72" : initColor,
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

  private leaveStyle(currentIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (that.initSetStyle && currentIndex.value === curIndex) return;
      that.mark.value = "default";
    };
  }

  private centerStyle(currentIndex: Ref<keyof any>, moveIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (that.initSetStyle && currentIndex.value === curIndex) return;

      that.mark.value = "enter";
      moveIndex.value = curIndex;
    };
  }

  private currentStyle(currentIndex: Ref<keyof any>) {
    const that = this;
    return function (curIndex: keyof any) {
      if (currentIndex.value === curIndex) {
        return;
      }

      that.mark.value = "current";
      currentIndex.value = curIndex;
    };
  }

  private isOptions(data: Partial<Options> | undefined): Options {
    const newData: Options = {
      defaultActiveColor: "#74b9ff",
      initColor: "#74b9ff",
      enterColor: "#74b9ffb3",
      style: "color",
      isMove: false,
      initSetStyle: true,
    };

    const result: Options = data ? (data as Options) : newData;
    return Object.assign(newData, result);
  }
}
