<template>
  <header>
    <h1><router-link id="title" to="/">SIMPLE CHAT ROOMS</router-link></h1>
  </header>

  <router-view v-slot="{Component}">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <footer>
    <p>Created by <a href="https://github.com/SSbit01" target="_blank">SSbit01</a></p>
  </footer>
</template>


<script>
export default {
  watch: {
    $route(to, from) {
      window.socket.removeAllListeners();
    }
  }
}
</script>


<style lang="sass">
$bg: rgb(40,42,40)

*
  margin: 0

::-webkit-scrollbar
  background-color: $bg
  width: 1em

::-webkit-scrollbar-thumb
  background-color: gray
  border: 0.2em solid black
  &:hover
    background-color: rgb(180,180,180)
  &:active
    background-color: white

a
  transition-duration: .4s

header, footer
  margin: 1em

footer
  background-color: black
  padding: 1em
  border: 1px solid Gray
  border-radius: .5em
  margin-top: auto

input, button
  font-family: inherit

button
  cursor: pointer
  padding: .3em
  border: 2px solid black
  border-radius: .4em
  font-size: 1em
  transition-duration: .2s
  &:hover:enabled
    color: Gold
    background-color: rgb(50,50,50)
  &:focus
    border-color: inherit
  &:disabled
    cursor: not-allowed

.fade-enter-active, .fade-leave-active
  transition-duration: .4s

.fade-enter-from, .fade-leave-to
  opacity: 0
  transform: scale(.8)

.box_input
  padding: .6em
  background-color: black
  border: 1px solid
  border-radius: .4em
  user-select: none
  margin-bottom: .5em
  input
    color: inherit
    border: none
    background-color: transparent
    font-size: inherit
    &:focus
      outline: none

#app
  display: flex
  flex-direction: column
  align-items: center
  min-height: 100vh
  color: white
  background-color: $bg
  font-size: 16px
  font-family: "Lucida Console"

#title
  text-decoration: none
  color: inherit
  &:hover
    color: LightGray
  &:focus
    color: Gray
</style>
