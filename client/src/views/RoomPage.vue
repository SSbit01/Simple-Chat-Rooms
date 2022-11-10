<script lang="ts" setup>
import { useRoute } from "vue-router"

import { roomName, nickname, showForm } from "@/store"

import ChatRoom from "@/views/ChatRoom.vue"
import RoomForm from "@/views/RoomForm.vue"


const route = useRoute()


if (Array.isArray(route.params.roomName)) {
  route.params.roomName = route.params.roomName[0]
}

roomName.value = route.params.roomName.trim()


if (Array.isArray(route.query.name)) {
  route.query.name = route.query.name[0]
}

if (route.query.name) {
  nickname.value = route.query.name.trim()
}

showForm.value = true


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
    <RoomForm v-if="showForm" />
    <ChatRoom v-else />
  </Transition>
</template>