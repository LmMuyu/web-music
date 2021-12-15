<template>
  <section class="flex flex-col w-full h-full relative">
    <div class="text-center relative clearfix whauto">
      <img :src="imgsrc(playitem.coverImgUrl || playitem.al.picUrl)" class="p-1" />
      <div
        style="z-index: 99"
        class="w-full h-full flex justify-center items-center overflow-hidden play_icon"
      >
        <router-link
          :to="{ path: playitem.topath ?? '/playlist', query: { id: playitem.id } }"
          class="absolute top-0 bottom-0 left-0 right-0 w-full h-full"
          target="_blank"
          :itemid="playitem.id"
        ></router-link>
        <i class="iconfont iconbofang2"></i>
      </div>
    </div>
    <div class="px-1 hover_opacity">
      <span v-if="!!playitem.playCount" class="text_icon flex items-center py-1 text-sm">
        <i class="iconfont iconbofang1"></i>
        <p class="ml-2">{{ fromPlayCount(playitem.playCount) }}</p>
      </span>
      <span class="black">
        <p class="text-left cursor-pointer text-xs fotn_title">{{ playitem.name }}</p>
        <p v-if="playitem.subtitle">{{ playitem.subtitle }}</p>
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
  playitem: {
    type: Object,
    required: true,
  },
});

function fromPlayCount(count: number) {
  if (!count) return;
  if (count >= 100000000) {
    return `${Math.floor((count / 100000000) * 100) / 100}亿`;
  } else if (count >= 100000) {
    return `${Math.floor((count / 100000) * 100) / 100}万`;
  } else if (count >= 10000) {
    return `${Math.floor((count / 10000) * 100) / 100}万`;
  }
}

function imgsrc(url: string) {
  const xsize = props.playitem?.xsize ?? 120;
  const ysize = props.playitem?.ysize ?? 80;

  const imgsize = `?param=${xsize}y${ysize}`;
  return url + imgsize;
}
</script>
<style scoped lang="scss">
.hover_opacity {
  & > p {
    word-break: break-all;
    -ms-word-break: break-all;
    white-space: pre-wrap;
    line-height: 20px;
  }
}
.fotn_title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.text_icon {
  @include Iconfont(#747d8c, 16);
}

.play_icon {
  @include Iconfont(#ced6e0, 28);
  @include absolute;

  & > i {
    -webkit-box-shadow: 0 0 0 80px #f5f6fa60;
    -moz-box-shadow: 0 0 0 80px #f5f6fa60;
    box-shadow: 0 0 0 80px #f5f6fa60;
    background-color: #f5f6fa60;
  }
}

section {
  -webkit-box-shadow: 0px 0px 7px 0px rgba(177, 177, 179, 1);
  -moz-box-shadow: 0px 0px 7px 0px rgba(177, 177, 179, 1);
  box-shadow: 0px 0px 7px 0px rgba(177, 177, 179, 1);
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;

  & > div:nth-child(1) > img {
    border-radius: 6px 6px 6px 6px;
    -moz-border-radius: 6px 6px 6px 6px;
    -webkit-border-radius: 6px 6px 6px 6px;
    border: 0px solid #000000;
  }

  & > div:nth-child(1) > div {
    @include absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }
}

section {
  & .clearfix {
    width: auto;
    height: auto;

    & > img {
      max-width: 512px;
      max-height: 512px;
    }

    &::after {
      content: "";
      height: 0;
      display: block;
      clear: both;
      visibility: hidden;
    }

    *zoom: 1;
  }

  & .whauto {
    min-width: 120px;
    min-height: 80px;
  }
}
</style>
