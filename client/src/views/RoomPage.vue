<script lang="ts" setup>
import { useRoute } from "vue-router"

import useRoomStore from "@/stores/room"

import ChatRoom from "@/views/ChatRoom.vue"
import RoomForm from "@/views/RoomForm.vue"


const route = useRoute(),
      roomStore = useRoomStore()


if (Array.isArray(route.params.roomName)) {
  route.params.roomName = route.params.roomName[0] || ""
}

roomStore.name = route.params.roomName?.trim() || ""


if (Array.isArray(route.query.name)) {
  route.query.name = route.query.name[0] || ""
}

if (route.query.name) {
  roomStore.nick = route.query.name.trim()
}

roomStore.showForm = true


/*
if (route.params.roomName.length > 80) {
  router.push("/")
}

if (route.query.name && route.query.name.length > 24) {
  route.query.name = null
  router.replace({})
}*/
</script>



<template>
  <Transition name="router" mode="out-in">
    <RoomForm v-if="roomStore.showForm" />
    <ChatRoom v-else />
  </Transition>
</template>