<template>
  <RouterLink to="/" title="Go Home">
    <font-awesome-icon icon="fa-solid fa-right-from-bracket" flip="horizontal" />
  </RouterLink>
</template>


<style lang="stylus" scoped>
a
  display: inline-flex
  color: SlateGray
  font-size: 1.45em
  padding: .4em
  border-radius: 50%
  transition: background .2s
  &:hover
    background: rgb(30, 40, 50)
  &:active
    background: rgb(40, 50, 60)
</style>