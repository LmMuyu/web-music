<template>
  <div :style="gridStyle()" class="sm:grid-cols-3" @click.capture="captureColItem">
    <div v-for="(playitem, index) in playlist" :key="index">
      <play-col-item
        :is-play-icon="playitem?.isPlayIcon ?? true"
        :playitem="transformPlayitem(playitem)"
        v-if="!topath && slotDefault"
      />
      <play-col-item
        :is-play-icon="playitem?.isPlayIcon ?? true"
        :playitem="transformPlayitem(playitem)"
        :to="topath"
        v-else-if="slotDefault && topath"
      />
      <slot name="default" :custom="{ playitem, index }"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import PlayColItem from "./CardColItem.vue";

import { PropType, ref, useSlots } from "vue";

const ctxEmit = defineEmits(["mutationSetName"]);

const props = defineProps({
  playlist: {
    type: Array as PropType<any[]>,
    required: true,
  },
  colItem: {
    type: Number,
    default: 5,
  },
  gap: {
    type: Array,
    default: () => [20, 10],
  },
  topath: String,
});

const slot = useSlots();

const slotDefault = ref(watchSlot());

function watchSlot() {
  return slot.default ? false : true;
}

function transformPlayitem(playlist: any) {
  if (props.topath && !playlist.topath) {
    return { ...playlist, topath: props.topath };
  } else {
    return playlist;
  }
}

function gridStyle() {
  return {
    width: "100%",
    display: "grid",
    gridTemplateColumns: `repeat(${props.colItem},1fr)`,
    gridGap: props.gap.map((gap) => gap + "" + "px").join(" "),
  };
}

function captureColItem(e: Event) {
  const target = e.target as HTMLElement;

  if (target.nodeName === "A" && target.getAttribute("itemid")) {
    const id = target.getAttribute("itemid");
    const obj = props.playlist.find((value) => (value as any).id == id);

    ctxEmit("mutationSetName", obj);
  }
}
</script>
<style scoped lang="scss"></style>
