<template>
  <main>
    <hgroup id="header-group">
      <h1>
        <font-awesome-icon icon="fa-solid fa-4" />
        <font-awesome-icon icon="fa-solid fa-0" />
        <font-awesome-icon icon="fa-solid fa-4" />
      </h1>

      <h2>Not Found<font-awesome-icon icon="fa-solid fa-face-sad-cry" id="sad-icon" fade /></h2>
    </hgroup>

    <RouterLink to="/" id="return-home"> <font-awesome-icon icon="fa-solid fa-house" />Return Home </RouterLink>
  </main>
</template>

<style lang="stylus" scoped>
main
  padding-bottom 5rem

#header-group
  display flex
  align-items center
  justify-content center
  gap 2rem
  text-align center
  font-size 1.75em
  margin 5rem 0
  > h1, > h2
      margin-top 0
      margin-bottom 0
  > h1
    font-size 3em
    line-height 1
    border-right thin solid teal
    padding-right 2.5rem
  > h2
    color lightseagreen

#sad-icon
  color aquamarine
  margin-left .3em

#return-home
  display flex
  align-items baseline
  justify-content center
  gap .5em
  cursor pointer
  max-width max-content
  color darkturquoise
  background rgb(15, 25, 40)
  font-size 1.5em
  font-weight bold
  line-height 1
  text-decoration none
  padding .5em
  border none
  border-radius 6px
  box-shadow 0 0 4px teal
  margin 0 auto
  transition-property color, background
  transition-duration .15s
  &:hover
    background rgb(25, 35, 50)
  &:active
    background rgb(35, 50, 65)

@media (max-width 750px)
  #header-group
    flex-direction column
    gap .5em
    > h1
      border-right none
      padding-right 0
      margin-bottom .25em
</style>
