<template>
  <div>
    <song-item
      class="py-2 cursor-pointer"
      v-for="(track, index) in playlistTracks"
      :key="index"
      :index="index"
      :track="track"
      @click.capture="acceptTrackData(track)"
    />
  </div>
</template>
<script setup lang="tsx">
import { ElRow, ElCol, ElAvatar } from "element-plus";
import { useStore } from "vuex";

interface SONGITEM {
  track: Record<string, any>;
  index: number;
  class?: Readonly<{}>;
}

const props = defineProps({
  playlistTracks: {
    type: Array,
    required: true,
  },
});

const store = useStore();

function acceptTrackData(track) {
  store.commit("playlist/setSongId", track.id);
}

function songItem(props: Readonly<SONGITEM>) {
  const track = props.track;

  return (
    <router-link to={{ path: "/playlist", query: { id: track.id } }} target="_blank">
      <ElRow class={props.class}>
        <ElCol span={10} class="flex">
          <div>
            <ElAvatar shape="square" srcSet={track.picUrl} size="large" />
          </div>
          <div class="flex flex-col px-2">
            <span>{track.name}</span>
            <span class="text-sm" v-html={track.nickName}></span>
          </div>
        </ElCol>
        <ElCol span={10} class="flex items-center text-sm">
          {track.name}
        </ElCol>
        <ElCol span={4} class="flex  items-center">
          <span> {track.durationTime} </span>
        </ElCol>
      </ElRow>
    </router-link>
  );
}
</script>
<style scoped lang="scss"></style>
