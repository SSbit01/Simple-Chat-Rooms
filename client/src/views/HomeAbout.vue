<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"

import useRoomStore from "@/stores/room"
import socket from "@/socket"

import { roomNameAttributes, roomSizeLimit } from "@global/roomAttributes"

import MySubmitButton from "@/components/MySubmitButton.vue"


const roomStore = useRoomStore(),
      //
      router = useRouter(),
      //
      roomNameTrimmed = computed(() => roomStore.name.trim()),
      //
      isLoading = ref(false),
      roomExists = ref(false),
      roomJoinable = ref(true),
      //
      isValidRoomName = computed(() => roomNameAttributes.pattern.test(roomNameTrimmed.value) && roomNameTrimmed.value.length <= roomNameAttributes.maxLength)


if (import.meta.env.MODE != "noSocket") {
  watch(roomNameTrimmed, value => {
    if (isValidRoomName.value) {
      isLoading.value = true

      socket.emit("roomAvailability", value, res => {
        if (value === roomNameTrimmed.value && !("error" in res)) {
          roomExists.value = res.exists
          roomJoinable.value = res.exists ? res.joinable : true
          isLoading.value = false
        }
      })
    } else {
      isLoading.value = false
      roomExists.value = false
      roomJoinable.value = true
    }
  }, {
    immediate: true
  })
}


function roomNameOnInput(event: Event) {
  const el = event.target as HTMLInputElement
  el.value = el.value.substring(0, roomNameAttributes.maxLength)

  if (!el.value.trim()) {
    el.value = ""
  }

  roomStore.name = el.value
}


function nextStepRoom() {
  roomStore.name = roomNameTrimmed.value

  if (isValidRoomName.value) {
    if (import.meta.env.MODE == "noSocket") {
      router.push("/room/" + roomStore.name)
    } else {
      isLoading.value = true

      socket.emit("roomAvailability", roomStore.name, res => {
        if ("error" in res) {
          alert(res.error)
        } else {
          roomExists.value = res.exists
          roomJoinable.value = res.exists ? res.joinable : true
          if (roomJoinable.value) {
            router.push("/room/" + roomStore.name)
          }
        }
        isLoading.value = false
      })
    }
  }
}
</script>



<template>
  <div id="wrapper">
    <header>
      <h1 id="title">
        Simple Chat Rooms<font-awesome-icon icon="fa-solid fa-comment-dots" transform="right-8" bounce/>
      </h1>
    </header>

    <main>
      <ul class="fa-ul" id="intro">
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-user-secret" /></span>This is a platform created by <a href="https://github.com/SSbit01" target="_blank" id="creator-link">SSbit01</a> where users can create and join chat rooms without the need to create an account</li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-comment-slash" /></span>Messages and events aren't stored</li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-users" /></span>A room can have up to <strong>{{ roomSizeLimit }}</strong> members</li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-window-maximize" /></span>Room path structure<font-awesome-icon icon="fa-solid fa-right-long" fade /><code>/room/{roomName}?name={nickname}</code></li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-brands fa-html5" /></span><em>HTML</em> code is parsed in messages</li>
        <li><a href="https://github.com/SSbit01/Simple-Chat-Rooms.git" target="_blank"><span class="fa-li"><font-awesome-icon icon="fa-brands fa-git-alt" /></span>Repository</a></li>
      </ul>
      <form @submit.prevent="nextStepRoom">
        <div id="form-room-name-box">
          <label for="room-name-input">
            <font-awesome-icon v-if="isLoading" icon="fa-solid fa-cog" spin />
            <font-awesome-icon v-else-if="roomStore.name && !isValidRoomName" icon="fa-solid fa-exclamation" beatFade />
            <font-awesome-icon v-else-if="!roomExists" icon="fa-solid fa-bolt" fade />
            <font-awesome-icon v-else-if="roomJoinable" icon="fa-solid fa-crosshairs" beatFade />
            <font-awesome-icon v-else icon="fa-solid fa-xmark" beatFade />
          </label>
          <input
            type="text"
            placeholder="Room Name"
            title="Enter a valid path"
            id="room-name-input"
            :pattern="roomNameAttributes.pattern.source"
            :maxlength="roomNameAttributes.maxLength"
            :value="roomStore.name"
            @input="roomNameOnInput"
          />
          <p id="input-message">
            {{
              isLoading ? "Loading..."
              : roomStore.name && !isValidRoomName ? "Invalid Path"
              : !roomExists ? "Available"
              : roomJoinable ? "Existing"
              : "Not Joinable"
            }}
          </p>
        </div>
        <MySubmitButton :valid="roomJoinable" :disabled="isLoading || !isValidRoomName">Next <font-awesome-icon icon="fa-solid fa-right-to-bracket" /></MySubmitButton>
      </form>
    </main>
  </div>
</template>



<style lang="stylus" scoped>
a
  color dodgerblue
  text-decoration none
  transition color .2s
  &:hover
    color deepskyblue
  &:focus
    color lightskyblue

#wrapper
  $px = .5em
  padding 0 $px 4em $px

#title
  text-align center
  color mediumspringgreen
  font-size clamp(1.5em, 9vw, 3em)
  font-style italic
  font-variant small-caps
  text-decoration underline double lightseagreen
  > svg
    color aquamarine

main
  display grid
  gap 1.5em

#intro
  display grid
  $padding = .8em
  gap $padding
  color cornflowerblue
  background-color rgb(5, 10, 20)
  padding $padding $padding $padding 2em
  border-radius 6px
  box-shadow 0 0 4px lightseagreen
  margin auto
  > li
    > code
      color rgb(100, 175, 255)
      font-size 1.1em
    > .fa-li
      color deepskyblue
  .fa-right-long
    color cadetblue
    margin 0 .5em

#form-room-name-box
  display flex
  position relative
  font-size clamp(1.25em, 7vw, 1.5em)
  max-width 20em
  color v-bind("roomStore.name && !isValidRoomName ? 'rgb(255, 50, 100)' : roomExists && (roomJoinable ? 'orange' : 'rgb(255, 50, 100)')")
  box-shadow 0 0 3px
  margin 1em auto
  transition color .15s, box-shadow .2s
  &:focus-within
    box-shadow 0 0 8px
  > label:first-of-type
    user-select none
    background rgb(15, 25, 30)
    text-align center
    width 1em
    padding .4em .3em
    border-right thin solid rgb(30, 40, 50)

#room-name-input
  flex 1
  font-size inherit
  background transparent
  color inherit
  background-color rgb(5, 10, 20)
  font-size 85%
  padding-left .4em
  border none
  &:focus
    outline none
  &:placeholder-shown + #input-message
    opacity 0
    visibility hidden

#input-message
  position absolute
  top -1.6em
  right 1em
  font-size .6em
  background-color rgb(5, 10, 20)
  padding 0 .4em
  border thin solid
  border-bottom none
  margin 0
  transition-property opacity, visibility
  transition-duration .15s
</style>
