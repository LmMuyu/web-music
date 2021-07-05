<template>
  <video class="w-full" ref="videoNode" controls src=""></video>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { nextTick } from "@vue/runtime-core";
import axios from "axios";

import { getMvUrl, mvRecommend } from "../../../api/explore";

const videoNode = ref<HTMLVideoElement | null>(null);

mvRecommend()
  .then(({ data }) => data.result[0])
  .then((data) => initVideoPlayer(data.id, data.duration));

async function initVideoPlayer(id: number, duration: number) {
  const res = await getMvUrl(id);

  let url: string = res.data.data.url;
  const bytes = {
    start: 0,
    end: 1024 * 1024,
  };

  if (
    "MediaSource" in window &&
    MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
  ) {
    // console.log(url);

    const index = url.match(/\.net/)?.index || 0;
    url = url.slice(index + 4);
    // console.log(url);

    try {
      const mvplaydata = await axios({
        method: "GET",
        url: "/mvplay" + url,
        responseType: "arraybuffer",
        headers: { Range: `bytes=${bytes.start}-${bytes.end}` },
      });

      mediasource(mvplaydata.data, duration);
    } catch (error) {
      console.log(error);
    }
  } else {
    nextTick(() => videoNode.value && (videoNode.value.src = url));
  }
}

function mediasource(arraybuffer: ArrayBuffer, duration: number) {
  if (!videoNode.value) return new Error("videoNode for null");

  const mse = new MediaSource();
  videoNode.value.src = URL.createObjectURL(mse);

  mse.addEventListener(
    "sourceopen",
    sourceOpen.bind(mse, mse, duration),
    false
  );

  function sourceOpen(mediasource: MediaSource, duration: number) {
    URL.revokeObjectURL(videoNode.value!.src);

    const mime = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    const sourceBuffer = mediasource.addSourceBuffer(mime);

    sourceBuffer.addEventListener(
      "updateend",
      () => {
        if (mediasource.readyState === "open") {
          mediasource.endOfStream();
          videoNode.value?.play();
        }
      },
      false
    );

    sourceBuffer.appendBuffer(new Uint8Array(arraybuffer));
  }
}
</script>
<style scoped lang="scss"></style>
