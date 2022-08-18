<template>
  <div
    class="overflow-hidden relative bg-white"
    :style="{ height: viewportHeight + 'px' }"
    ref="viewport"
  >
    <div
      class="content w-full"
      :style="{
        height: (isminusviewposth ? scrollCapHeight() : capHeight) + 'px',
        ...style,
      }"
      :class="class"
      @load.capture="debounce_LoadImages"
      ref="container"
    >
      <slot v-if="!openHRender"></slot>
      <div :internal="true" style="height: 1px" class="w-full absolute"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  render,
  watch,
  watchEffect,
  computed,
  shallowRef,
} from "vue";
import fd from "fastdom";

import { debounce } from "../../utils/debounce";
import useLoadNetworkRes from "../../utils/useLoadNetworkRes";

import bottomLoading_H from "./bottomLoading_H";

export default defineComponent({
  props: {
    class: String,
    style: Object,
    scrollToEl: {
      type: Object,
    },
    BsOptions: {
      type: Object,
      default: {},
    },
    openUpload: {
      type: Boolean,
      default: false,
    },
    itemLen: {
      type: Number,
      default: Infinity,
    },
    openHRender: {
      type: Boolean,
      default: true,
    },
    scrollFn: Function,
    isminusviewposth: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["pullUpLoad", "hook:update", "mousewheelMove"],
  setup(props, { expose, slots, emit: ctxEmit }) {
    let BS = null;
    let mutation = null;
    const capHeight = ref(0);
    const viewportHeight = ref(0);
    let statusPrmosie = ref(null);
    const allTotalHeightLists: number[] = [];
    const isPullUpLoad = ref(false);
    let isMountOneUpLoadIcon = false;
    const ctx = getCurrentInstance();
    const viewport = shallowRef(null);
    const container = shallowRef(null);
    let thenStatus = ref<"pending" | "fulfilled">("pending");
    const src = "https://cdnjs.cloudflare.com/ajax/libs/better-scroll/2.4.2/better-scroll.esm.js";

    let mountRefreshFn: (bs) => void = null;

    const BSRefresh = () => (BS ? BS.refresh() : (mountRefreshFn = (bs) => bs.refresh()));

    function disable() {
      BS.disable();
    }

    function enable() {
      BS.enable();
    }

    const debounce_LoadImages = debounce(loadImages, 100);

    function loadImages(ev) {
      ev.stopPropagation();
      getContainerScrollHeight(container.value);
      BS && BS.refresh();
      ctxEmit("hook:update");
    }

    function getContainerScrollHeight(c: HTMLElement) {
      fd.measure(async () => {
        const setList = [];

        const tsh = [].reduce.call(
          c.children,
          (totalh: number, el: HTMLElement) => {
            const rect = el.getBoundingClientRect();
            const eh = rect.height;

            if (setList.indexOf(rect.y) === -1) {
              setList.push(rect.y);
              return (totalh += eh);
            } else {
              return totalh;
            }
          },
          0
        );

        if (allTotalHeightLists.indexOf(tsh) === -1) {
          allTotalHeightLists.push(tsh);
        }

        const maxH = Math.max(...allTotalHeightLists);
        capHeight.value = maxH;

        await nextTick();
        BS && BSRefresh();
      });
    }

    useLoadNetworkRes(src).then(
      ({ loadResult, module, message }) => {
        betterBscroll(module.value, loadResult.value, message);
      },
      (err) => {
        console.log(err);
      }
    );

    async function betterBscroll(module, loadResult, message) {
      if (typeof loadResult === "boolean" && loadResult && module) {
        if (!viewport.value) return;
        const BScroll = module;
        BS = new BScroll(
          viewport.value,
          Object.assign(
            {},
            {
              mouseWheel: true,
              bounce: false,
              click: true,
              pullUpLoad: props.openUpload,
            },
            props.BsOptions
          )
        );

        props.openUpload && BS.on("pullingUp", pullingUpHandler);

        const debounce_correction = debounce(correction, 100);

        BS.on(
          "mousewheelMove",
          (position: any) => {
            ctxEmit("mousewheelMove", position.y);
            debounce_correction(
              //动点y1
              position.y
            );
          },
          BS
        );

        let stopPoint = 0;

        BS.on(
          "mousewheelMove",
          (position: any) => {
            stopPoint = position.y;
          },
          BS
        );

        BS.on("mousewheelEnd", (mousewheel) => {
          //已经到底部，停止滑动
          if (mousewheel.directionY === 1) {
            BS.scrollTo(0, stopPoint, 0, {});
          }
        });

        let prevhch = 0;

        function correction(y1: number) {
          const maxH = Math.max(...allTotalHeightLists);
          const totalScrollHeight = maxH;
          const viewportHeightAddTotalScrollHeight = maxH + viewportHeight.value;

          //补上差值的y值高度
          const y2 =
            Number((1 - viewportHeightAddTotalScrollHeight / totalScrollHeight).toFixed(4)) *
            Math.abs(y1);

          capHeight.value = capHeight.value - prevhch + Math.abs(y2);
          prevhch = Math.abs(y2);

          BS && BSRefresh();
        }

        const stop = watchEffect(() => {
          if (
            statusPrmosie.value &&
            statusPrmosie.value instanceof Promise &&
            thenStatus.value === "fulfilled" &&
            capHeight.value > 0
          ) {
            statusPrmosie.value.then(() => {
              BS.refresh();
              Promise.resolve(() => stop());
            });
          }
        });

        mountRefreshFn && mountRefreshFn(BS);
        BSRefresh();
      }
      if (typeof loadResult === "boolean" && !loadResult) {
        console.warn("better-scrol:" + message);
      }
    }

    function mutationSubtree(contentport) {
      return new Promise((resolve) => {
        if (contentport) {
          let timer = null;
          if (mutation) {
            mutation.disconnect();
            mutation.takeRecords();
            mutation = null;
          }

          mutation = new MutationObserver((mutationlists) => {
            if (timer) {
              clearTimeout(timer);
              timer = null;
            }

            timer = setTimeout(() => {
              resolve((thenStatus.value = "fulfilled"));
            }, 20);
          });

          mutation.observe(contentport, {
            subtree: true,
            childList: true,
            characterData: true,
          });
        }
      });
    }

    function bottomPos(el: HTMLElement) {
      const height = el.getBoundingClientRect().bottom;
      return height;
    }

    //计算滑动总高度
    function capTotalHeight() {
      const lists = viewport.value.children[0].children as HTMLElement[];
      capHeight.value = Math.max(bottomPos(lists[lists.length - 1]), capHeight.value);
    }

    async function pullingUpHandler() {
      try {
        isPullUpLoad.value = true;

        //请求数据
        function requestData() {
          return new Promise((resolve, reject) => {
            ctxEmit("pullUpLoad", [resolve, reject]);
          });
        }

        await requestData();
      } catch (error) {
        console.error(error);
      } finally {
        BS.finishPullUp();
        isPullUpLoad.value = false;
      }
    }

    function afterDiv(mountpos) {
      const div = document.createElement("div");
      div.classList.add("h-10", "w-full");
      div.setAttribute("internal", "true");
      mountpos.appendChild(div);
      return div;
    }

    function watchRenderBottomLoading() {
      const mount = afterDiv(viewport.value.children[0]);
      watch(isPullUpLoad, (newavalue) => render(bottomLoading_H({ isPullUpLoad }), mount));
    }

    function templateHVnode(slotss) {
      return h(
        defineComponent({
          render: () => slotss,
        })
      );
    }

    async function renderNode() {
      !props.openHRender && (await nextTick());

      if (viewport.value) {
        if (props.openHRender) {
          const slotss = slots.default.call(null, ctx.appContext);
          render(templateHVnode(slotss), viewport.value.children[0]);
        }

        statusPrmosie.value = mutationSubtree(viewport.value.children[0]);

        !isMountOneUpLoadIcon && props.openUpload && watchRenderBottomLoading();
        isMountOneUpLoadIcon = true;

        await nextTick();
        capTotalHeight();
      } else {
        console.error("无法获取viewport视口，无法实例化BScroll。viewport：", viewport.value);
      }
    }

    const stopRenderNode = watch(() => props.itemLen, renderNode);

    //修改滑动高度
    const scrollCapHeight = () => {
      const diffh = diffCapHeight(Math.abs(capHeight.value - viewportHeight.value));
      const totalh =
        Math.abs(capHeight.value - viewportHeight.value * diffh) + (100 + Math.ceil(diffh) * 10);

      //@ts-ignore
      window.meibsh[window.meibsh.length - 1].push(totalh);
      //@ts-ignore

      console.log(window.meibsh);

      return totalh;
    };

    function diffCapHeight(h: number) {
      const vposth = viewportHeight.value;
      const diffh = Math.floor(h / vposth) / 3;

      //@ts-ignore

      if (!window.meibsh) {
        //@ts-ignore

        window.meibsh = [];
      }

      //@ts-ignore

      window.meibsh.push([vposth, diffh]);

      return diffh > 1 ? 1 : diffh;
    }

    const toScrollTopStop = watch(
      () => props.scrollToEl,
      (el) => el && BS && BS.scrollToElement(el, 250, true, true, {})
    );

    onMounted(async () => {
      renderNode();

      //这里是上层组件的的默认高度
      nextTick(() => {
        //@ts-ignore
        const el = ctx.parent.ctx["$el"];

        const clientHeight = el.clientHeight;

        if (el) {
          viewportHeight.value =
            clientHeight > 0 ? clientHeight : document.documentElement.clientHeight;
        }
      });

      await nextTick();
      getContainerScrollHeight(container.value);
    });

    onUnmounted(() => {
      BS.destroy();
      stopRenderNode();
      toScrollTopStop();
    });

    expose({
      disable,
      enable,
      scrollHeightRefresh() {
        BSRefresh();
      },
    });

    return {
      viewport,
      viewportHeight,
      capHeight,
      loadImages,
      isPullUpLoad,
      scrollCapHeight,
      container,
      debounce_LoadImages,
    };
  },
});
</script>
<style scoped lang="scss"></style>
