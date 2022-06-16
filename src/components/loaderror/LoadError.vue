<template>
  <div class="error-wall load-error">
    <div class="flex items-center justify-center error-container">
      <h3>数据加载错误</h3>
      <h4>错误代码： 404</h4>
      <p @click.stop="ctxEmit('clickRefresh')">点击此处重试一下</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const ctxEmit = defineEmits(["clickRefresh"]);
</script>
<style scoped lang="sass">
body
  padding: 0
  margin: 0
  font-family: 'Oxygen', sans-serif
.error-wall
  width: 100%
  height: 100%
  text-align: center
  &.load-error
    background-color: #409EFF
  &.matinence
    background-color: #a473b1
  &.missing-page
    background-color: #00bbc6
  .error-container
    display: block
    width: 100%
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    -webkit-transform: translate(-50%,-50%)
    -moz-transform: translate(-50%,-50%)
    h1
      color: #fff
      font-size: 80px
      margin: 0
      @media (max-width: 850px)
        font-size: 65px
    h3
      color: #464444
      font-size: 34px
      margin: 0
      @media (max-width: 850px)
        font-size: 25px
    h4
      margin: 0
      color: #fff
      font-size: 40px
      @media (max-width: 850px)
        font-size: 35px
    p
      font-size: 15px
      &:first-of-type
        color: #464444
        font-weight: lighter
      &:nth-of-type(2)
        color: #464444
        font-weight: bold
      &.type-white
        color: #fff
      @media (max-width: 850px)
        font-size: 12px
      @media (max-width: 390px)
        font-size: 10px
</style>
