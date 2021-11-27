<template>
  <aside>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </aside>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
aside {
  @for $i from 1 to 5 {
    $curdeg: 45 * $i;

    & > div:nth-child(#{$i}) {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      opacity: 0.7;
      background-image: -moz-linear-gradient(
        $curdeg + deg,
        rgba(137, 137, 137, 0.2),
        rgb(252, 255, 253, 0.2)
      );
      background-image: -webkit-linear-gradient(
        $curdeg + deg,
        rgb(137, 137, 137, 0.2),
        rgb(252, 255, 253, 0.2)
      );
      background-image: linear-gradient(
        $curdeg + deg,
        rgb(137, 137, 137, 0.2),
        rgb(252, 255, 253, 0.2)
      );
    }
  }
}
</style>
