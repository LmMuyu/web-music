<template>
  <GridBar :sizeSpan="[6, 10, 8]" :listData="tags" :styleRow="styleRow">
    <template v-slot:slot_center="{ item: navtag }">
      <ul class="gridul list-none flex">
        <li
          class="text-white text-center"
          v-for="(tag, index) in navtag.tags"
          :key="tag._id"
          @click="onTag(index)"
        >
          <router-link
            :to="tag.path"
            :class="active === index ? linkClass : ''"
            @mouseenter="mouseenter($event, active, index)"
            @mouseout="mouseout($event, active, index)"
          >
            {{ tag.tagname }}
          </router-link>
        </li>
      </ul>
    </template>
  </GridBar>
</template>

<script setup lang="ts">
import GridBar from "/comps/gridBar/GridBar.vue";
import { tags } from "../api/tags";
import { computed, reactive, ref, toRefs } from "vue";
import { mouseenter, mouseout, linkClass } from "../api/tagMouse";

const active = ref(0);

function onTag(curIndex: number) {
  if (active.value === curIndex) {
    return;
  }

  active.value = curIndex;
}

const gridSize = computed(() => {
  for (const value of tags) {
    if (value.hasOwnProperty("tags")) {
      return 100 / (value.tags as []).length + "%";
    }
  }
});

const styleRow = reactive({
  backgroundColor: "#c20c0c",
  paddingTop: "8px",
  paddingBottom: "8px",
});
</script>

<style scoped lang="scss">
.gridul > li {
  width: v-bind(gridSize);
}

.active_link {
  background-color: rgba(0, 0, 0, 0.25);
}
</style>
