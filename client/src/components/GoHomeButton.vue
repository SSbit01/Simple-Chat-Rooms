<template>
  <RouterLink to="/" title="Go home">
    <font-awesome-icon icon="fa-solid fa-right-from-bracket" flip="horizontal" widthAuto />
  </RouterLink>
</template>

<style lang="stylus" scoped>
a
  display inline-block
  line-height 0
  color SlateGray
  font-size 1.5em
  padding .375em
  border-radius 50%
  transition background .2s
  &:hover
    background rgb(30, 40, 50)
  &:active
    background rgb(40, 50, 60)
</style>
