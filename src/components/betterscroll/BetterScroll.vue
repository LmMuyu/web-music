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
import { defineComponent, getCurrentInstance, nextTick, onMounted, ref, watchEffect } from 'vue';
import useLoadNetworkRes from "../../utils/useLoadNetworkRes"


export default defineComponent({
  props: {
    class: String
  },
  setup() {
    const viewport = ref(null)
    const viewportHeight = ref(0)
    const { loadnetworkmes, loading, instance } = useLoadNetworkRes("https://cdn.jsdelivr.net/npm/better-scroll@2.4.2/dist/better-scroll.esm.js")
    const ctx = getCurrentInstance()



    nextTick(() => {
      const el = ctx.parent.parent.ctx["$el"]
      if (el) {
        viewportHeight.value = el.clientHeight || document.documentElement.clientHeight
      }
    })

    function mutationSubtree(contentport, BS) {
      if (contentport) {
        let refresh = false
        const mutation = new MutationObserver((mutationlists) => {
          if (!refresh) {
            BS.refresh()
            refresh = true
          }
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
          const BS = new BScroll(viewport.value, {
            mouseWheel: true,
            bounce: false
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
    return {
      viewport,
      viewportHeight
    }
  }
})
</script>
<style scoped lang="scss"></style>
