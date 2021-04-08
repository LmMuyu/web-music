<template>
  <!-- <div class="bgColor"></div> -->
  <div>
    <ul class="list-none column">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.bgColor {
  height: calc(100vh - 65.76px);
  background: rgba(31, 41, 55);
  opacity: 0.5;
}

.column {
  position: relative;
  transform: translate(100px, 100px);
  & > li {
    width: 2px;
    height: 20px;
    background: red;
  }

  @for $i from 0 through 12 {
    & > li:nth-child(#{$i}) {
      transform: rotateX(($i * 30) + deg);
    }
  }
}
</style>
