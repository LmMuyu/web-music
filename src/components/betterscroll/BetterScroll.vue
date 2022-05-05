<template>
  <div
    class="overflow-hidden relative bg-white"
    :style="{ height: viewportHeight + 'px' }"
    ref="viewport"
  >
    <div
      class="content absolute top-0 left-0 w-full"
      :style="{ height: capHeight + 'px' }"
      :class="class"
      @load.capture="loadImages"
    >
      <div style="height: 1px" class="w-full absolute"></div>
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
} from "vue";
import useLoadNetworkRes from "../../utils/useLoadNetworkRes";
import bottomLoading_H from "./bottomLoading_H";

export default defineComponent({
  props: {
    class: String,
    BsOptions: {
      type: Object,
      default: {},
    },
    openUpload: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["pullUpLoad"],
  setup(props, { expose, slots, emit: ctxEmit }) {
    const src = "https://cdn.jsdelivr.net/npm/better-scroll@2.4.2/dist/better-scroll.esm.js";
    const viewport = ref(null);
    const viewportHeight = ref(0);
    const capHeight = ref(0);
    let statusPrmosie = ref(null);
    let thenStatus = ref<"pending" | "fulfilled">("pending");
    const isPullUpLoad = ref(false);

    const ctx = getCurrentInstance();
    let BS = null;
    let mountRefreshFn: (bs) => void = null;

    function disable() {
      console.log(BS);
      BS.disable();
    }

    function enable() {
      BS.enable();
    }

    function heightAdd() {
      const lists = viewport.value.children[0].children as HTMLElement[];
      console.log(lists);

      const totalHeight = Array.prototype.reduce.apply(lists, [
        (pre, next) => {
          return (pre += next.getBoundingClientRect().height);
        },
        0,
      ]);

      const maxHeight = Math.max(totalHeight, capHeight.value);
      const preHeight = capHeight.value;
      capHeight.value = maxHeight;

      if (preHeight !== capHeight.value) {
        BS ? BS.refresh() : (mountRefreshFn = (bs) => bs.refresh());
      }
    }

    function loadImages(ev) {
      ev.stopPropagation();
      heightAdd();
    }

    nextTick(() => {
      //@ts-ignore
      const el = ctx.parent.ctx["$el"];
      const offsetTop = el.offsetTop;
      const clientHeight = el.clientHeight;

      if (el) {
        viewportHeight.value =
          clientHeight > offsetTop
            ? clientHeight - offsetTop
            : document.documentElement.clientHeight;
      }
    });

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
            { mouseWheel: true, bounce: false, click: true, pullUpLoad: props.openUpload },
            props.BsOptions
          )
        );

        props.openUpload && BS.on("pullingUp", pullingUpHandler);

        const stop = watchEffect(() => {
          if (
            statusPrmosie.value &&
            statusPrmosie.value instanceof Promise &&
            thenStatus.value === "fulfilled" &&
            capHeight.value > 0
          ) {
            statusPrmosie.value.then(() => {
              // console.log("statusPrmosie then");
              BS.refresh();
              Promise.resolve(() => stop());
            });
          }
        });

        mountRefreshFn && mountRefreshFn(BS);
      }
      if (typeof loadResult === "boolean" && !loadResult) {
        console.warn("better-scrol:" + message);
      }
    }

    function mutationSubtree(contentport) {
      return new Promise((resolve) => {
        if (contentport) {
          let timer = null;
          const mutation = new MutationObserver((mutationlists) => {
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
      return el.getBoundingClientRect().bottom;
    }

    function capTotalHeight() {
      const lists = viewport.value.children[0].children as HTMLElement[];
      capHeight.value = bottomPos(lists[lists.length - 1]);
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
      mountpos.appendChild(div);
      return div;
    }

    function watchRenderBottomLoading() {
      const mount = afterDiv(viewport.value.children[0]);
      watch(isPullUpLoad, (newavalue) => {
        render(bottomLoading_H({ isPullUpLoad }), mount);
      });
    }

    onMounted(async () => {
      if (viewport.value) {
        const vnode = slots.default()[0];
        statusPrmosie.value = mutationSubtree(viewport.value.children[0]);
        render(vnode, viewport.value.children[0]);
        watchRenderBottomLoading();

        await nextTick();
        capTotalHeight();
      } else {
        console.error("无法获取viewport视口，无法实例化BScroll。viewport：", viewport.value);
      }
    });

    onUnmounted(() => {
      BS.destroy();
    });

    expose({
      disable,
      enable,
    });

    return {
      viewport,
      viewportHeight,
      capHeight,
      loadImages,
      isPullUpLoad,
    };
  },
});
</script>
<style scoped lang="scss"></style>
