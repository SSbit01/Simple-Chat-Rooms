<script lang="ts" setup>
const showShare = "canShare" in navigator

function shareRoom() {
  navigator.share({
    url: window.location.origin + window.location.pathname
  })
}
</script>


<template>
  <button v-if="showShare" type="button" @click="shareRoom">
    <font-awesome-icon icon="fa-solid fa-share-from-square" />
  </button>
</template>


<style lang="sass" scoped>
button
  font-size: 1.25em
  padding: .5em
  border-radius: 50%
  border: none
  transition: color .2s, background .2s
  &:enabled
    cursor: pointer
    background: none
    color: DeepSkyBlue
    &:hover
      background: rgb(30, 40, 50)
    &:active
      background: rgb(40, 50, 60)
  &:disabled
    cursor: not-allowed
</style>