<template>
  <section class="flex flex-col w-full h-full relative">
    <div class="text-center clearfix relative">
      <img :src="playitem.coverImgUrl + '?param=144y90'" class="w-full h-full" />
      <router-link
        :to="{ path: '/playlist', query: { id: playitem.id } }"
        class="absolute top-0 bottom-0 left-0 right-0 z-50"
        target="_blank"
      ></router-link>
      <div class="play_icon flex justify-center items-center">
        <i class="iconfont iconbofang2"></i>
      </div>
    </div>
    <div class="px-1 hover_opacity">
      <span class="text_icon flex items-center py-1 text-sm">
        <i class="iconfont iconbofang1"></i>
        <p class="ml-2">{{ playcount(playitem.playCount + "") }}</p>
      </span>
      <p class="text-left cursor-pointer text-xs fotn_title">{{ playitem.name }}</p>
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

function playcount(count: string) {
  const endtxt = {
    3: "百",
    4: "千",
    5: "万",
    7: "百万",
    9: "亿",
  };

  const part = partSliceStr(count);

  const startPart = part[0];
  const len = startPart.length * 3;

  const symbolstr =
    endtxt[
    Object.keys(endtxt)
      .map(Number)
      .find((num) => num >= len)
    ];

  const floats = startPart.substring(1);

  return startPart[0] + (floats.length > 0 ? "." + floats : "") + symbolstr;
}

function partSliceStr(slicestr: string): string[] {
  let len = slicestr.length;
  const part = [];

  while (true) {
    const start = len - 3;
    const end = len;

    if (start <= 0) {
      const strslice = slicestr.substring(0, end);
      part.unshift(strslice);
      return part;
    }

    len = start;
    const strslice = slicestr.substring(start, end);
    part.unshift(strslice);
  }
}</script>
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
}

section {
  -webkit-box-shadow: -1px 0px 14px 0px rgba(177, 177, 179, 1);
  -moz-box-shadow: -1px 0px 14px 0px rgba(177, 177, 179, 1);
  box-shadow: -1px 0px 14px 0px rgba(177, 177, 179, 1);
  border-radius: 6px 6px 6px 6px;
  -moz-border-radius: 6px 6px 6px 6px;
  -webkit-border-radius: 6px 6px 6px 6px;
  border: 0px solid #000000;

  & > div:nth-child(1) > div {
    @include absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.4s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }
}

section .clearfix {
  &::after {
    content: "";
    height: 0;
    display: block;
    clear: both;
    visibility: hidden;
  }

  *zoom: 1;
}
</style>
