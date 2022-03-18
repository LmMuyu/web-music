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
import { defineComponent, getCurrentInstance, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import useLoadNetworkRes from "../../utils/useLoadNetworkRes"


export default defineComponent({
  props: {
    class: String
  },
  setup(props, { expose }) {
    const viewport = ref(null)
    const viewportHeight = ref(0)
    const { loadnetworkmes, loading, instance } = useLoadNetworkRes("https://cdn.jsdelivr.net/npm/better-scroll@2.4.2/dist/better-scroll.esm.js")
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

    function mutationSubtree(contentport, BS) {
      if (contentport) {
        let timer = null

        const mutation = new MutationObserver((mutationlists) => {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }

          timer = setTimeout(() => {
            BS.refresh()
          }, 20);
        })


        nextTick().then(() => {
          mutation.observe(contentport, {
            subtree: true,
            childList: true,
            characterData: true
          })
        })
      }
    }


    function betterBscroll() {
      const stop = watchEffect(() => {
        if (typeof loading.value === "boolean" && loading.value && loadnetworkmes.sources) {
          if (!viewport.value) return


          const BScroll = instance.value
          BS = new BScroll(viewport.value, {
            mouseWheel: true,
            bounce: false,
            click: true
          })

          const content = viewport.value.children[0]
          mutationSubtree(content, BS)

          nextTick(stop)
        } if (typeof loading.value === "boolean") {
          console.warn(loadnetworkmes.message);
          nextTick(() => stop())
        }
      })
    }

    onMounted(() => {
      nextTick(betterBscroll)
    })


    onUnmounted(() => {
      BS.destroy()
    })


    expose({
      disable,
      enable
    })


    return {
      viewport,
      viewportHeight,
    }
  }
})
</script>
<style scoped lang="scss"></style>
