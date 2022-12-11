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


<style lang="stylus">
html, body
  height 100%

body
  position absolute  // PREVENTS MARGIN COLLAPSING
  inset 0
  background rgb(10, 15, 25) linear-gradient(45deg, rgb(5, 10, 15), rgb(15, 20, 30)) no-repeat fixed
  color springgreen
  font-family "Lucida Sans Unicode", Arial, sans-serif
  margin 0

.router-enter-active, .router-leave-active
  transition-duration .15s
.router-enter-from, .router-leave-to
  opacity 0
</style>
