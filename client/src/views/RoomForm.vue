<script lang="ts" setup>
import { ref, watch } from "vue"
import { storeToRefs } from "pinia"

import useRoomStore from "@/store/room"
import socket from "@/socket"

import { nicknameAttributes } from "@global/roomAttributes"

import GoBackButton from "@/components/GoHomeButton.vue"
import ShareButton from "@/components/ShareLinkButton.vue"
import MySubmitButton from "@/components/MySubmitButton.vue"


const { roomName, nickname, showForm } = storeToRefs(useRoomStore()),
      //
      isLoading = ref(false),
      isJoinable = ref(true),
      nicknameAvailable = ref(true)


if (import.meta.env.MODE != "noSocket") {
  watch(nickname, value => {
    isLoading.value = true

    socket.emit("nicknameAvailability", roomName.value, value, res => {
      isJoinable.value = res.joinable
      if (value == nickname.value) {
        isLoading.value = false
        if (res.joinable) {
          nicknameAvailable.value = res.nickname
        }
      }
    })
  }, {
    immediate: true
  })
}


function joinRoom() {
  nickname.value = nickname.value.trim()
  if (nickname.value) {
    if (import.meta.env.MODE == "noSocket") {
      showForm.value = false
    } else {
      isLoading.value = true

      socket.emit("nicknameAvailability", roomName.value, nickname.value, res => {
        isJoinable.value = res.joinable
        nicknameAvailable.value = res.joinable && res.nickname
        isLoading.value = false
        showForm.value = !nicknameAvailable.value
      })
    }
  }
}
</script>



<template>
  <div id="wrapper">
    <header>
      <div id="header-buttons">
        <GoBackButton />
        <ShareButton />
      </div>
      <h1 id="title" title="Room Name">
        <font-awesome-icon icon="fa-solid fa-bolt" fade />{{ roomName }}
      </h1>
    </header>

    <form id="form-name" @submit.prevent="joinRoom">
      <h2 id="nickname">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" bounce />Nickname
      </h2>
      <div id="form-box-name">
        <label for="room-name-input">
          <font-awesome-icon v-if="isLoading" icon="fa-solid fa-cog" spin />
          <font-awesome-icon v-else-if="isJoinable && (!nickname || nicknameAvailable)" icon="fa-solid fa-user" />
          <font-awesome-icon v-else icon="fa-solid fa-xmark" beatFade />
        </label>
        <input
          type="text"
          size="10"
          placeholder="e.g. Superman"
          id="room-name-input"
          :maxlength="nicknameAttributes.maxLength"
          :value="nickname"
          @input="nickname = ($event.target as HTMLInputElement).value"
        />
        <p id="input-message">
          {{
            isLoading ? "Loading..."
            : !isJoinable ? "Not Joinable"
            : (!nickname || nicknameAvailable) ? "Available"
            : "Not Available"
          }}
        </p>
      </div>
      <MySubmitButton :valid="isJoinable && (!nickname || nicknameAvailable)" :disabled="isLoading || !nickname">Join <font-awesome-icon icon="fa-solid fa-right-to-bracket" /></MySubmitButton>
    </form>
  </div>
</template>



<style lang="sass" scoped>
#wrapper
  text-align: center
  $px: .6em
  padding: $px $px 4em $px

#header-buttons
  display: flex
  align-items: center
  justify-content: space-between
  gap: 1em

#title
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: .2em .3em
  line-height: 1.2
  overflow-wrap: anywhere
  margin-bottom: 1em
  > svg
    color: MediumAquaMarine

#form-name
  display: flex
  flex-direction: column
  align-items: center
  gap: 1em
  background: rgb(0, 5, 15)
  max-width: 26em
  padding: 1em
  border-radius: 12px
  box-shadow: 0 0 2px MediumSeaGreen
  margin: auto

#nickname
  display: flex
  align-items: center
  gap: .4em
  font-variant: small-caps
  color: DodgerBlue
  margin: 0
  > svg
    color: SteelBlue

#form-box-name
  display: flex
  position: relative
  width: 100%
  font-size: clamp(1.25em, 7vw, 1.5em)
  color: v-bind("(!isJoinable || (!isLoading && nickname && !nicknameAvailable)) && 'rgb(255, 50, 100)'")
  $radius: 8px
  border-radius: $radius
  box-shadow: 0 0 3px
  margin-top: .5em
  margin-bottom: .2em
  transition: color .15s, box-shadow .2s
  &:focus-within
    box-shadow: 0 0 8px
  > label:first-child
    user-select: none
    background: rgb(15, 25, 30)
    text-align: center
    width: 1em
    padding: .4em .3em
    border-right: thin solid rgb(30, 40, 50)
    border-radius: $radius 0 0 $radius
  > input:last-of-type
    border-radius: 0 $radius $radius 0

#room-name-input
  flex: 1
  font-size: inherit
  background: transparent
  color: inherit
  background-color: rgb(5, 10, 20)
  font-size: 85%
  padding-left: .4em
  border: none
  &:focus
    outline: none
  &:placeholder-shown + #input-message
    opacity: v-bind("isJoinable && 0")
    visibility: v-bind("isJoinable && 'hidden'")

#input-message
  position: absolute
  top: -1.75em
  right: 1em
  font-size: .5em
  background-color: rgb(5, 10, 20)
  padding: 0 .4em
  border: thin solid
  border-bottom: none
  $br: 4px
  border-radius: $br $br 0 0
  margin: 0
  transition-property: opacity, visibility
  transition-duration: .15s


@media (max-width: 400px)
  #form-name
    background: inherit
    padding: 0
    box-shadow: none
</style>