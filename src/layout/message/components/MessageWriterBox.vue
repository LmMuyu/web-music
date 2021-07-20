<template>
  <div class="h-full w-full flex items-center">
    <div
      class="h-4/5 w-full p-2 rounded-md flex outline border_style"
      type="text"
      contenteditable
    >
      <div class="w-3/4">4444</div>
      <div class="h-full w-1/4 flex items-center" :contenteditable="false">
        
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.border_style {
  background-color: #f5f7f9;
}

.outline {
  outline: none;
}

.margin_auto {
  margin: auto 0;
}
</style>
