<template>
  <div id="text">{{msg}}</div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'hello world'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  #text
    font-size 30px
    font-weight 100
    width 100%
    height 100%
    background #fff url('./assets/images/roshan.jpg') no-repeat
    overflow hidden
</style>
