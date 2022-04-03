<template>
  <div
    class="overflow-hidden relative bg-white"
    :style="{ height: viewportHeight + 'px' }"
    ref="viewport"
  >
    <div class="content absolute top-0 left-0 w-full" :class="class">
      <div style="height: 1px" class="w-full absolute"></div>
      <slot></slot>
    </div>
  </div>
</template>
<script lang="js">
import { defineComponent, getCurrentInstance, nextTick, onBeforeMount, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import useLoadNetworkRes from "../../utils/useLoadNetworkRes"

export default defineComponent({
  props: {
    class: String
  },
  setup(props, { expose }) {
    const src = "https://cdn.jsdelivr.net/npm/better-scroll@2.4.2/dist/better-scroll.esm.js"
    const viewport = ref(null)
    const viewportHeight = ref(0)
    let statusPrmosie = ref(null)

    const ctx = getCurrentInstance()
    let BS = null

    function disable() {
      console.log(BS);
      BS.disable()
    }

    function enable() {
      BS.enable()
    }


    nextTick(() => {
      const el = ctx.parent.ctx["$el"]
      if (el) {
        viewportHeight.value = el.clientHeight || document.documentElement.clientHeight
      }
    })



    useLoadNetworkRes(src).then(({ loadResult, module, message }) => {
      betterBscroll(module.value, loadResult.value, message)
    }, (err) => {
      console.log(err);
    })


    function betterBscroll(module, loadResult, message) {
      if (typeof loadResult === "boolean" && loadResult && module) {
        if (!viewport.value) return
        const BScroll = module
        BS = new BScroll(viewport.value, { mouseWheel: true, bounce: false, click: true })

        const stop = watchEffect(() => {
          if (statusPrmosie.value && statusPrmosie.value instanceof Promise) {
            console.log(true);
            statusPrmosie.value.then(() => {
              console.log("statusPrmosie then");
              BS.refresh()
            })

            Promise.resolve(() => stop())
          }
        })

      } if (typeof loadResult === "boolean" && !loadResult) {
        console.warn("better-scrol:" + message);
      }
    }

    function mutationSubtree(contentport) {
      return new Promise((resolve) => {
        console.log(contentport);
        if (contentport) {
          let timer = null
          const mutation = new MutationObserver((mutationlists) => {
            console.log(mutationlists);
            if (timer) {
              clearTimeout(timer)
              timer = null
            }

            timer = setTimeout(() => {
              resolve(true)
            }, 20);
          })


          mutation.observe(contentport, {
            subtree: true,
            childList: true,
            characterData: true
          })
        }

      })

    }


    onBeforeMount(() => {
      if (viewport.value) {
        statusPrmosie.value = mutationSubtree(viewport.value.children[0])
        const div = document.createElement("div")
        viewport.value.children[0].appendChild(div)
      } else {
        console.error("无法获取viewport视口，无法实例化BScroll。viewport：", viewport.value);
      }
    })

    expose({
      disable,
      enable
    })

    onUnmounted(() => {
      BS.destroy()
    })

    return {
      viewport,
      viewportHeight,
    }
  }
})
</script>
<style scoped lang="scss"></style>
