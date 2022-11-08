<template>
  <div>
    <header id="main-header">
      <h1>
        <font-awesome-icon icon="fa-solid fa-4" />
        <font-awesome-icon icon="fa-solid fa-0" />
        <font-awesome-icon icon="fa-solid fa-4" />
      </h1>
      <h2>
        Not Found<font-awesome-icon icon="fa-solid fa-face-sad-cry" id="sad-icon" fade />
      </h2>
    </header>
    <RouterLink to="/" id="return-home">
      <font-awesome-icon icon="fa-solid fa-house" />Return Home
    </RouterLink>
  </div>
</template>


<style lang="sass" scoped>
#main-header
  display: flex
  align-items: center
  justify-content: center
  gap: 2rem
  text-align: center
  font-size: clamp(1.5em, 8.8vw, 2em)
  margin: 5rem 0
  > h
    &1, &2
      margin-top: 0
      margin-bottom: 0
  > h1
    font-size: 4em
    line-height: 1
    border-right: thin solid Teal
    padding-right: 2.5rem
  > h2
    color: LightSeaGreen

#sad-icon
  color: Aquamarine
  margin-left: .3em

#return-home
  display: flex
  align-items: baseline
  justify-content: center
  gap: .5em
  cursor: pointer
  max-width: max-content
  color: DarkTurquoise
  background: rgb(15, 25, 40)
  font-size: 1.5em
  font-variant: small-caps
  line-height: 1
  text-decoration: none
  padding: .5em
  border: none
  border-radius: 6px
  box-shadow: 0 0 4px Teal
  margin: 0 auto 5rem auto
  transition-property: color, background
  transition-duration: .15s
  &:hover
    background: rgb(25, 35, 50)
  &:active
    background: rgb(35, 50, 65)

@media (max-width: 750px)
  #main-header
    flex-direction: column
    gap: .5em
    > h1
      border-right: none
      padding-right: 0
</style>