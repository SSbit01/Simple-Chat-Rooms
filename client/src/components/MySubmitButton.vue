<script lang="ts" setup>
defineProps<{
  valid: boolean
}>()
</script>


<template>
  <button v-if="valid" type="submit" class="submit-button">
    <slot></slot>
  </button>
  <button v-else type="submit" class="submit-button">Retry <font-awesome-icon icon="fa-solid fa-rotate-right" /></button>
</template>


<style lang="stylus" scoped>
.submit-button
  display: block
  user-select: none
  font-size: clamp(1.1em, 6vw, 1.25em)
  font-variant: small-caps
  border: none
  padding: .4em .8em
  border-radius: 4px
  box-shadow: 0 0 4px Teal
  margin: auto
  transition-property: color, background-color
  transition-duration: .15s
  &:enabled
    cursor: pointer
    color: inherit
    color: MediumAquaMarine
    background: rgb(15, 25, 40)
    &:hover
      background: rgb(25, 35, 50)
    &:active
      background: rgb(35, 50, 65)
    > :deep(svg)
      color: DarkTurquoise
      transition: color .15s
  &:disabled
    color dimgray
    background black
    cursor: not-allowed
</style>