<template>
  <transition name="translate">
    <div class="">
      <span class="text-4xl font-medium"> {{ lyrics }} </span>
    </div>
  </transition>
</template>
<script setup lang="ts">
const props = defineProps({
  lyrics: {
    type: String,
    require: true,
  },
});
</script>
<style scoped lang="scss">
.translate-enter-active,
.translate-leave-active {
  transition: all 0.25s ease-in;
}


.translate-enter-from{
  
}
 
</style>
