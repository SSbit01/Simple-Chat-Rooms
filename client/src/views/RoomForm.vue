<script lang="ts" setup>
import { ref, computed, watch } from "vue"

import useRoomStore from "@/stores/room"
import socket from "@/socket"

import { nicknameAttributes } from "@global/roomAttributes"

import GoBackButton from "@/components/GoHomeButton.vue"
import ShareButton from "@/components/ShareLinkButton.vue"
import MySubmitButton from "@/components/MySubmitButton.vue"


const roomStore = useRoomStore(),
      //
      nicknameTrimmed = computed(() => roomStore.nick.trim()),
      //
      isLoading = ref(false),
      isJoinable = ref(true),
      nicknameAvailable = ref(true)


if (import.meta.env.MODE != "noSocket") {
  watch(nicknameTrimmed, value => {
    isLoading.value = true

    socket.emit("nicknameAvailability", roomStore.name, value, res => {
      if ("error" in res) {
        alert(res.error)
        isLoading.value = false
      } else {
        isJoinable.value = res.joinable
        if (value == nicknameTrimmed.value) {
          isLoading.value = false
          if (res.joinable) {
            nicknameAvailable.value = res.nickname
          }
        }
      }
    })
  }, {
    immediate: true
  })
}


function nicknameOnInput(event: Event) {
  const el = event.target as HTMLInputElement
  el.value = el.value.substring(0, nicknameAttributes.maxLength)

  if (!el.value.trim()) {
    el.value = ""
  }

  roomStore.nick = el.value
}


function joinRoom() {
  roomStore.nick = nicknameTrimmed.value
  
  if (roomStore.nick) {
    if (import.meta.env.MODE == "noSocket") {
      roomStore.showForm = false
    } else {
      isLoading.value = true

      socket.emit("nicknameAvailability", roomStore.name, roomStore.nick, res => {
        isLoading.value = false
        if ("error" in res) {
          alert(res.error)
        } else {
          isJoinable.value = res.joinable
          nicknameAvailable.value = res.joinable && res.nickname
          roomStore.showForm = !nicknameAvailable.value
        }
      })
    }
  }
}
</script>



<template>
  <main>


    <header>

      <div id="header-buttons">
        <GoBackButton />
        <ShareButton />
      </div>

      <h1 id="title" title="Room Name">
        <font-awesome-icon icon="fa-solid fa-bolt" fade />{{ roomStore.name }}
      </h1>

    </header>


    <form id="form-name" @submit.prevent="joinRoom">

      <h2 id="form-header">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" bounce />Nickname
      </h2>

      <div id="nickname-container">
        <div id="nickname-box">
          <label for="nickname-input">
            <font-awesome-icon v-if="isLoading" icon="fa-solid fa-cog" spin />
            <font-awesome-icon v-else-if="isJoinable && (!roomStore.nick || nicknameAvailable)" icon="fa-solid fa-user" />
            <font-awesome-icon v-else icon="fa-solid fa-xmark" beatFade />
          </label>
          <input
            type="text"
            placeholder="e.g. Superman"
            id="nickname-input"
            :maxlength="nicknameAttributes.maxLength"
            :value="roomStore.nick"
            @input="nicknameOnInput"
          />
        </div>

        <p v-show="roomStore.nick" id="nickname-input-message">
          {{
            isLoading ? "Loading..."
            : !isJoinable ? "Not Joinable"
            : nicknameAvailable ? "Available"
            : "Not Available"
          }}
        </p>
      </div>

      <MySubmitButton :valid="isJoinable && (isLoading || !roomStore.nick || nicknameAvailable)" :disabled="isLoading || !roomStore.nick">Join <font-awesome-icon icon="fa-solid fa-right-to-bracket" /></MySubmitButton>

    </form>


  </main>
</template>



<style lang="stylus" scoped>
#header-buttons
  display flex
  align-items center
  justify-content space-between
  max-width 60em
  gap 1em
  padding 1em
  margin auto

#title
  display flex
  flex-wrap wrap
  justify-content center
  gap .2em .3em
  font-size clamp(1.75em, 6.75vw, 2em)
  line-height 1.2
  text-align center
  overflow-wrap anywhere
  padding 0 1rem
  margin-top .25em
  margin-bottom 1.25em
  > svg
    color mediumaquamarine

#form-name
  display flex
  flex-direction column
  align-items center
  gap 1em
  background rgb(0, 5, 15)
  max-width 26em
  padding 1.5em 1em
  box-shadow 0 0 3px mediumseagreen
  margin auto

#form-header
  display flex
  align-items center
  gap .4em
  font-variant small-caps
  color dodgerblue
  margin 0
  > svg
    color steelblue

#nickname-container
  position relative
  color v-bind("(!isJoinable || (!isLoading && roomStore.nick && !nicknameAvailable)) && 'rgb(255, 50, 100)'")
  font-size clamp(1.25em, 7vw, 1.5em)
  width 100%
  margin-top 1rem
  margin-bottom .2em

#nickname-box
  display flex
  border-radius 8px
  box-shadow 0 0 3px
  overflow hidden
  transition color .15s, box-shadow .2s
  &:focus-within
    box-shadow 0 0 8px
  > label:first-child
    user-select none
    background rgb(15, 25, 30)
    text-align center
    width 1em
    padding .4em .3em
    border-right thin solid rgb(30, 40, 50)

#nickname-input
  flex 1
  width 100%
  background transparent
  color inherit
  background-color rgb(5, 10, 20)
  font-size 85%
  padding-left .4em
  border none
  &:focus
    outline none
  &:placeholder-shown + #input-message
    opacity v-bind("isJoinable && 0")
    visibility v-bind("isJoinable && 'hidden'")

#nickname-input-message
  position absolute
  top -1em
  right 1rem
  font-size .6em
  background-color rgb(5, 10, 20)
  padding 0 .4em
  box-shadow 0 -2px 2px
  $br = 4px
  border-radius $br $br 0 0
  margin 0
  transition-property opacity, visibility
  transition-duration .15s
</style>