<script lang="ts" setup>
import socket from "@/socket"

if (import.meta.env.MODE != "noSocket") {
  socket.connect()
}
</script>


<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="router" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>


<style lang="sass">
html
  height: 100%

body
  display: flex
  flex-direction: column
  background-color: rgb(10, 15, 25)
  height: 100%
  color: SpringGreen
  font-family: Lucida Sans Unicode, Arial
  margin: 0

.router-enter-active, .router-leave-active
  transition-duration: .15s
.router-enter-from, .router-leave-to
  opacity: 0
</style>
