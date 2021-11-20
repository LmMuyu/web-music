<template>
  <div class="flex items-center relative h-full w-full">
    <div class="flex items-center h-full w-full">
      <!-- <div class="flex flex-1 px-2">
        <div>
          <img class="object-cover" :src="musicImage + '?param=60y60'" :alt="musicName" />
        </div>
        <span class="flex justify-center flex-col ml-4 text-gray-700">
          <span class="flex-1 decoration">{{ musicName }}</span>
          <span class="text-sm flex-1 decoration">{{ nickName }}</span>
        </span>
      </div>-->
      <div class="flex flex-col mx-4" style="flex: 3">
        <div>
          <AudioAndVideoControls @play="controlsMethods.play" @pause="controlsMethods._pause"></AudioAndVideoControls>
        </div>
        <PlayMusicTime :starttime="starttime" :maxtime="maxtime" class="w-full">
          <PlaySlider />
        </PlayMusicTime>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router"
import { onMounted } from "vue-demi";
import { reactive, ref, customRef } from "vue";

//@ts-ignore
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import PlaySlider from "../../components/slider/Slider.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";

import Howl from "./play"


const maxtime = ref(0)
const starttime = ref(0)

const controlsMethods = reactive({
  pre: () => { },
  play: () => { },
  _pause: () => { },
  next: () => { }
})

const musicHowler = new Howl()

const playHowl = new Proxy(musicHowler, {
  set(target, key, value) {
    (async function () {
      if (key === "playid") {
        await target.setSrc(value)
        replaceMethods(controlsMethods, target)
      }
    })()
    return true
  }
});


function interceptFnApply(Fn: Function) {
  if (Fn.name.indexOf("play") > 0) {
    // duration(playHowl)
    playHowl._seek(function (curtime) {
      starttime.value = curtime;
    })
  }

}

function handler<T extends Function>(): ProxyHandler<any> {
  return {
    apply(target: T, thisarg: any, args: any) {
      target.call(playHowl)
      interceptFnApply(target)
    }
  }
}

function replaceMethods(methods: Record<string, Function>, howler: Howl) {
  ["play", "_pause"].map(mdsname => {
    const newBindFn: Function = howler[mdsname].bind(howler)
    const proxyFn = new Proxy(newBindFn, handler())
    methods[mdsname] = proxyFn

    return proxyFn
  })
}

const id = useRoute().query.id as unknown as number

function duration(howl: Howl) {
  maxtime.value = howl.duration
}

// const curCustomRef = (function () {
//   return customRef((track, trigger) => {
//     return {
//       set(value) {

//       },
//       get() {
//         return ""
//       }
//     }
//   })
// })()

onMounted(() => {
  playHowl.playid = id
})

</script>
<style scoped lang="scss">
.decoration {
  text-decoration: none !important;

  &:hover {
    text-decoration: underline !important;
  }
}
</style>
