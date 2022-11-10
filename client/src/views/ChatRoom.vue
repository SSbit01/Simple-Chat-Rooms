<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import DOMPurify from "dompurify"

import socket from "@/socket"

import { roomName, nickname } from "@/store"

import GoBackButton from "@/components/GoHomeButton.vue"
import ShareButton from "@/components/ShareLinkButton.vue"

import { messageAttributes } from "@global/roomAttributes"

import type { ChatEvent } from "@global/socketScheme"


DOMPurify.setConfig({
  FORBID_ATTR: ["style"]
})


const router = useRouter(),
      mates = reactive(new Set<string>())

socket.emit("joinChatRoom", roomName.value, nickname.value, res => {
  if ("error" in res) {
    console.error(res.error)
    alert(res.error)
    router.push("/")
  } else {
    res.users.forEach(mates.add, mates)
  }
})


const events = reactive<ChatEvent[]>([
        { value: "You have <strong>joined</strong> the chat" },
      ]),
      //
      messageInputEl = ref<HTMLDivElement>(),
      message = ref(""),
      //
      counterChar = computed(() => messageAttributes.maxLength - message.value.length),
      disabledMessageForm = computed(() => counterChar.value < 0 || !message.value.length)


watch(events, () => {
  nextTick(() => {
    const el = document.getElementById("events")

    if (el && (events[events.length - 1].by === nickname.value || el.scrollHeight - el.clientHeight - el.scrollTop < 250)) {  // Check if the last event was caused by the user and if that's not the case only scroll down when the scroll is close to bottom
      el.scrollTop = el.scrollHeight
    }
  })
})


function messageOnInput() {
  const innerText = messageInputEl.value?.innerText.trim()

  message.value = DOMPurify.sanitize(innerText || "")

  if (!innerText) {
    messageInputEl.value!.textContent = ""
  }
}


function messageOnPaste(event: ClipboardEvent) {
  const plainText = DOMPurify.sanitize(event.clipboardData?.getData("text/plain") || "")

  if (plainText) {
    event.preventDefault()

    // document.execCommand("insertText", false, plainText)
    
    const range = getSelection()!.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(plainText))
    range.collapse(false)

    event.target?.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      composed: true,
      inputType: "insertFromPaste"
    }))
  }
}


function sendMessage() {
  if (!disabledMessageForm.value) {
    events.push({ by: nickname.value, value: message.value, date: new Date() })

    if (mates.size) {
      socket.emit("message", roomName.value, message.value, res => {
        if (res.error) {
          alert(res.error)
        }
      })
    }

    message.value = ""
    messageInputEl.value!.textContent = ""
    messageInputEl.value?.focus()
  }
}


socket.on("message", event => {
  event.value = DOMPurify.sanitize(event.value.trim())
  if (event.value) {
    event.date = new Date()
    events.push(event)
  }
})


socket.on("newUser", user => {
  mates.add(user)
  events.push({
    value: `<em><q><strong>${user}</strong></q></em> has <strong>joined</strong> the chat`
  })
})


socket.on("userLeaves", user => {
  mates.delete(user)
  events.push({
    value: `<em><q><strong>${user}</strong></q></em> has <strong>left</strong> the chat`
  })
})


onUnmounted(() => {
  socket.emit("leaveChatRoom", roomName.value)
})
</script>



<template>
  <div id="wrapper">
    <input type="checkbox" id="show-room-info" /> 
    <header id="header">
      <GoBackButton id="go-home-button" />
      <ShareButton title="Share Room URL" id="share-room-button" />
      <div id="title-box">
        <label for="show-room-info" id="toggle-info">
          <font-awesome-icon icon="fa-solid fa-arrow-left" />
        </label>
        <h1 id="room-name" title="Room Info">
          <font-awesome-icon icon="fa-solid fa-bolt" fade /> {{ roomName }}
        </h1>
      </div>
      <section id="users">
        <p><em>{{ mates.size + 1 }}</em> {{ mates.size ? "participants" : "participant" }}</p>
        <ul class="fa-ul">
          <li title="You">
            <span class="fa-li"><font-awesome-icon icon="fa-solid fa-user" beatFade /></span>{{ nickname }}
          </li>
          <TransitionGroup name="event">
            <li v-for="mate in mates" :key="mate">
              <span class="fa-li"><font-awesome-icon icon="fa-solid fa-user-secret" /></span>{{ mate }}
            </li>
          </TransitionGroup>
        </ul>
      </section>
    </header>
    <main>
      <TransitionGroup name="event" tag="section" id="events">
        <article v-for="{ by, value, date }, i in events" :key="i" :class="{
          event: !by,
          message: by,
          'my-message': by === nickname
        }" :style="{
          marginTop: by && events[i - 1]?.by == by ? '.25em' : '1em'
        }">
          <h4 v-if="by && ![nickname, events[i - 1]?.by].includes(by)" :title="by">
            <font-awesome-icon icon="fa-solid fa-circle-user" />{{ by }}
          </h4>
          <div>
            <div class="event-value" v-html="value"></div>
            <time v-if="date">{{ date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) }}</time>
          </div>
        </article>
      </TransitionGroup>
      <section id="type-box">
        <div
          placeholder="Type a message..."
          id="type-message"
          contenteditable
          ref="messageInputEl"
          @input="messageOnInput"
          @paste="messageOnPaste"
          @keypress.enter.exact.prevent="sendMessage"
        ></div>
        <button type="button" id="send-message" title="Send" @click="sendMessage" @keypress="messageInputEl?.focus()" :disabled="disabledMessageForm">
          <font-awesome-icon icon="fa-solid fa-paper-plane" :beat="!disabledMessageForm" />
        </button>
        <p id="character-counter">
          {{ counterChar }}
        </p>
      </section>
    </main>
  </div>
</template>



<style lang="sass" scoped>
.event-move, .event-enter-active, .event-leave-active
  transition-duration: .15s
.event-leave-active
  position: absolute
.event-enter-from, .event-leave-to
  scale: .6
  opacity: 0


main
  overflow: auto
  flex: 1
  display: flex
  flex-direction: column
  min-height: 20em


#wrapper
  display: flex
  height: 100%

#show-room-info
  display: none

#go-home-button
  order: 1

#room-name
  position: relative
  user-select: none
  overflow-wrap: anywhere
  font-size: 1.5em
  font-weight: bold
  line-height: 1.2
  margin: 0
  > svg
    color: MediumAquaMarine

#share-room-button
  order: 3
  float: right

#users
  overflow-wrap: anywhere
  line-height: 1
  white-space: pre-wrap
  margin-top: 1.8em
  > p:first-child
    color: CadetBlue
    font-size: .8em
    margin-bottom: .25em
  > ul
    position: relative
    font-size: 1.2em
    border-top: thin solid DarkSlateGray
    padding-left: 2em
    padding-top: .8em
    margin: 0
    > li
      > .fa-li
        font-size: 1em
      &:first-child
        color: MediumAquaMarine
        > .fa-li
          color: LightSeaGreen
      &:not(:first-child)
        color: CadetBlue
        > .fa-li
          color: rgb(0, 120, 120)
      &:not(:last-child)
        margin-bottom: .6em
  
#events
  overflow-y: auto
  overflow-x: hidden
  scroll-behavior: smooth
  -webkit-overflow-scrolling: touch
  display: grid
  font-family: Arial
  box-sizing: border-box
  $px: max(min(calc((100% - 100em) / 2), 13.5%), .5em)
  padding: 0 $px 3em $px
  > article
    white-space: pre-wrap
    overflow-wrap: anywhere
    min-width: 0
    padding: .4em
    border-radius: 4px
    > h4
      overflow: hidden
      color: DeepSkyBlue
      white-space: pre
      text-overflow: ellipsis
      margin-top: .1em
      margin-bottom: .4em
      > svg
        color: LightSkyBlue
        margin-right: .4em
    > div
      display: flex
      flex-wrap: wrap
      align-items: flex-end
      gap: .3em .5em
      > .event-value > :deep(*)  // :deep(*) to select v-html elements
        max-width: 100% !important
      > time
        font-size: .7em
        color: rgb(140, 160, 190)
        margin: 0 -.2em -.3em auto
    &.event
      text-align: center
      color: LightSlateGray
      background: rgb(20, 25, 35)
      box-shadow: 0 0 3px
      margin: 0 auto
    &.message
      color: HoneyDew
      max-width: 85%
      &.my-message
        transform-origin: top right
        background: rgb(40, 80, 125)
        margin-left: auto
      &:not(.my-message)
        transform-origin: top left
        background: rgb(30, 40, 60)
        margin-right: auto

#type-box
  display: flex
  align-items: flex-end
  position: relative
  color: AliceBlue
  background-color: rgb(0, 10, 20)
  caret-color: LightSeaGreen
  box-shadow: 0 0 4px DarkSlateGray
  margin-top: auto
  transition: box-shadow .15s
  &:focus-within
    box-shadow: 0 0 2px 2px Teal

#type-message
  overflow-y: auto
  white-space: pre-wrap
  font-size: inherit
  font-family: Arial
  width: 100%
  max-height: 7.5em
  box-sizing: border-box
  padding: .8em
  &:focus
    outline: none
  &:empty
    overflow-x: hidden
    &::before
      white-space: nowrap
      content: attr(placeholder)
      color: LightSlateGray
    ~ #character-counter, + #send-message
      visibility: hidden
      opacity: 0
    + #send-message
      position: absolute
      right: 0
      scale: .8

#character-counter
  position: absolute
  top: -2.2em
  left: .2em
  font-family: monospace
  color: v-bind("counterChar > 50 ? 'MediumSeaGreen' : counterChar > 0 ? 'Orange' : counterChar == 0 ? 'OrangeRed' : 'Red'")
  background: black
  padding: .25em .5em
  border: thin solid
  border-radius: 4px
  margin: 0
  transition-duration: .15s

#send-message
  font-size: 1em
  background: transparent
  box-sizing: border-box
  padding: .5em
  border: none
  border-radius: 50%
  $mx: .5em
  margin: 0 $mx .3em $mx
  transition-duration: .15s
  &:enabled
    color: MediumAquaMarine
    cursor: pointer
    &:hover
      background: rgb(20, 30, 40)
    &:focus
      color: HoneyDew
      background: rgb(30, 100, 100)
      outline: none
  &:disabled
    color: LightSlateGray


$breakpoint: 716px


@media (max-width: $breakpoint)
  #wrapper
    flex-direction: column
  
  #show-room-info
    &:checked + #header
      position: fixed
      z-index: 1
      inset: 0
      overflow: auto
      background-color: rgb(15, 25, 35)
      $px: .6em
      padding: .5em $px 2em $px
      animation: show-info-frames ease-out .2s
      @keyframes show-info-frames
        from
          opacity: 0
          translate: 100%
      > #go-home-button
        display: none
      > #title-box
        display: contents
        > #toggle-info
          display: inline-flex
          font-size: 1.5em
          color: SlateGray
          padding: .35em .4em
          border-radius: 50%
        > #room-name
          text-align: center
          margin-top: .75em
      + main
        visibility: hidden
    &:not(:checked) + #header
      display: flex
      align-items: center
      position: sticky
      font-size: clamp(.8em, 2.35vw, 1em)
      background-color: rgb(20, 30, 40)
      border-bottom: thin solid rgb(30, 50, 50)
      animation: header-frames ease-out .2s
      @keyframes header-frames
        from
          opacity: 0
          translate: -100%
      > #go-home-button
        margin-left: .3em
      > #share-room-button
        margin-right: .4em
      > #title-box
        flex: 1
        order: 2
        position: relative
        overflow: hidden
        $py: .75em
        padding: $py 0 $py .5em
        > #room-name
          overflow: hidden   
          pointer-events: none
          white-space: nowrap
          text-overflow: ellipsis
        > #toggle-info
          position: absolute
          inset: 0
          > *
            display: none
      > #users
        display: none
  
  #toggle-info
    cursor: pointer
    transition: background .2s
    &:hover
      background: rgb(25, 35, 45)
    &:active
      background: rgb(30, 40, 50)


@media (min-width: $breakpoint + 1)
  #header
    background-color: rgb(15, 25, 35)
    width: 40%
    max-width: 40em
    padding: .6em
    border-right: thin solid rgb(25, 50, 50)
  
  #toggle-info
    display: none
  
  #room-name
    text-align: center
    margin-top: .75em
  
  #type-box
    width: 100%
    max-width: max(75%, 100em)
    margin-right: auto
    margin-left: auto
</style>