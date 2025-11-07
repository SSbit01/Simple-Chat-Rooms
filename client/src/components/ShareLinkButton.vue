<script lang="ts" setup>
const showShare = "canShare" in navigator

function shareRoom() {
  navigator.share({
    url: window.location.origin + window.location.pathname
  })
}
</script>

<template>
  <button v-if="showShare" type="button" @click="shareRoom" title="Share">
    <font-awesome-icon icon="fa-solid fa-share-from-square" />
  </button>
</template>

<style lang="stylus" scoped>
button
  display inline-block
  line-height 0
  font-size 1.5em
  padding .375em
  border-radius: 50%
  border none
  transition color .2s, background .2s
  &:enabled
    cursor pointer
    background: none
    color DeepSkyBlue
    &:hover
      background rgb(30, 40, 50)
    &:active
      background rgb(40, 50, 60)
  &:disabled
    cursor: not-allowed
  > svg
    width 1em
    height 1em
</style>
