<template>
  <div>
    <DetailSong
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
import { PropType } from "vue";
import { useStore } from "vuex";
import DetailSong from "../../../components/detailsongs/DetailSong.vue";
import { musicDetail } from "../../../utils/musicDetail";

const props = defineProps({
  playlistTracks: {
    type: Array as PropType<musicDetail[]>,
    required: true,
  },
});

const store = useStore();

function acceptTrackData(track) {
  store.commit("playlist/setSongId", track.id);
}
</script>
<style scoped lang="scss"></style>
