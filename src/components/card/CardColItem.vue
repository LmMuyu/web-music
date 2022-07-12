<template>
  <section class="flex flex-col w-full h-full relative">
    <div class="text-center relative w-full clearfix whauto">
      <img
        :src="imgsrc(playitem.coverImgUrl || playitem.al.picUrl)"
        class="p-1"
        style="object-fit: fill; width: 100%"
      />
      <div
        style="z-index: 99"
        class="w-full h-full flex justify-center items-center overflow-hidden"
        :class="isPlayIcon && 'play_icon'"
      >
        <router-link
          :to="{ path: playitem.topath || playitem.path || to, query: routerQuery(playitem) }"
          class="absolute top-0 bottom-0 left-0 right-0 w-full h-full"
          :itemid="playitem.id"
        ></router-link>
        <i v-if="isPlayIcon" class="iconfont iconbofang2"></i>
      </div>
    </div>
    <div class="px-1 h-auto hover_opacity">
      <span v-if="!!playitem.playCount" class="text_icon flex items-center py-1 text-sm">
        <i class="iconfont iconbofang1 text-sm"></i>
        <p class="ml-2 text-sm">{{ fromPlayCount(playitem.playCount) }}</p>
      </span>
      <span class="black">
        <p :style="playitem?.style?.name ?? ''" class="text-left cursor-pointer text-sm fotn_title">
          <router-link
            :to="{ path: playitem.topath || playitem.path || to, query: routerQuery(playitem) }"
          >
            {{ playitem.name || playitem.albumname }}
          </router-link>
        </p>
        <p :style="playitem?.style?.subtitle ?? ''" v-if="playitem.subtitle">
          {{ playitem.subtitle }}
        </p>
        <p class="text-xs py-2" style="colos: #f0f2f5">{{ playitem?.createtime ?? "" }}</p>
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
import { fromPlayCount } from "../../utils/fromPlayCount";

const props = defineProps({
  playitem: {
    type: Object,
    required: true,
  },
  isPlayIcon: {
    type: Boolean,
    default: true,
  },
  to: {
    type: String,
    default: "/playlist",
  },
});

function imgsrc(url: string) {
  const xsize = props.playitem?.xsize ?? 150;
  const ysize = props.playitem?.ysize ?? 100;

  const imgsize = `?param=${xsize}y${ysize}`;
  return url + imgsize;
}

function routerQuery(item) {
  if (item?.topath) {
    return { id: item.id };
  } else if (item.path) {
    return {
      uid: item.id,
      isself: true,
    };
  } else {
    return { id: item.id };
  }
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

  &:hover {
    text-decoration: underline;
  }
}

.text_icon {
  @include Iconfont(#747d8c, 16);
  font-size: 14px;
}

.play_icon {
  @include Iconfont(#ced6e0, 28);
  @include absolute;

  & > i {
    -webkit-box-shadow: 0 0 0 100px #f5f6fa60;
    -moz-box-shadow: 0 0 0 100px #f5f6fa60;
    box-shadow: 0 0 0 100px #f5f6fa60;
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
      width: auto;
      height: auto;
      object-fit: cover;
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
    max-width: 512px;
    max-height: 512px;
  }
}
</style>
