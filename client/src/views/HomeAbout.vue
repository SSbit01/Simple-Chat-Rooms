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
  <main>


    <header>
      <h1 id="title" translate="no">SimpleChatRooms<font-awesome-icon icon="fa-solid fa-comment-dots" transform="right-8" bounce /></h1>
    </header>


    <section>

      <ul class="fa-ul" id="list-about">
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-user-secret" /></span>This is a platform created by <a href="https://ssbit01.github.io/" target="_blank">SSbit01</a> where users can create and join chat rooms without creating an account</li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-comment-slash" /></span>Messages and events aren't stored</li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-users" /></span>A room can have up to <strong>{{ roomSizeLimit }}</strong> members</li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-solid fa-window-maximize" /></span>Room path structure: <code>/room/{roomName}?name={nickname}</code></li>
        <li><span class="fa-li"><font-awesome-icon icon="fa-brands fa-html5" /></span><em><strong>HTML</strong></em> code is parsed in messages</li>
        <li><a href="https://github.com/SSbit01/Simple-Chat-Rooms.git" target="_blank"><span class="fa-li"><font-awesome-icon icon="fa-brands fa-git-alt" /></span>Repository</a></li>
      </ul>

      <form @submit.prevent="nextStepRoom">
        <div id="room-name-container">
          <div id="room-name-box">
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
          </div>
          <p v-show="roomStore.name" id="room-name-input-message">
            {{
              isLoading ? "Loading..."
              : !isValidRoomName ? "Invalid Path"
              : !roomExists ? "Available"
              : roomJoinable ? "Existing"
              : "Not Joinable"
            }}
          </p>
        </div>
        <MySubmitButton :valid="roomJoinable" :disabled="isLoading || !isValidRoomName">Next <font-awesome-icon icon="fa-solid fa-right-to-bracket" /></MySubmitButton>
      </form>

    </section>


  </main>
</template>



<style lang="stylus" scoped>
a
  color dodgerblue
  text-decoration none
  transition color .2s, text-shadow .2s
  &:hover
    color deepskyblue
    text-decoration underline
  &:active
    color lightskyblue
    text-shadow 0 0 4px

main
  padding-bottom 4em

#title
  text-align center
  color mediumspringgreen
  font-size clamp(1.5em, 8vw, 3em)
  font-style italic
  font-variant small-caps
  text-decoration underline double lightseagreen
  padding 0 1rem
  > svg
    color aquamarine

#list-about
  display grid
  gap 1.25em
  max-width max-content
  line-height 1.35
  color cornflowerblue
  background-color rgb(5, 10, 20)
  $py = 1em
  padding $py 1em $py 2.25em
  box-shadow 0 0 4px lightseagreen
  $mx = auto
  margin 1.5em $mx 3em $mx
  > li
    > code
      color rgb(100, 175, 255)
    > .fa-li
      color deepskyblue

#room-name-container
  position relative
  color v-bind("roomStore.name && !isValidRoomName ? 'rgb(255, 50, 100)' : roomExists && (roomJoinable ? 'orange' : 'rgb(255, 50, 100)')")
  font-size clamp(1.2em, 7vw, 1.5em)
  max-width 20em
  padding 0 .5em
  margin 1em auto

#room-name-box
  display flex
  border-radius 8px
  box-shadow 0 0 3px
  overflow hidden
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

#room-name-input-message
  position absolute
  top -.8rem
  right 1.4rem
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