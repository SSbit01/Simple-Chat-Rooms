<template>
  <div id="box" :style="{color:color}">
    <p id="description">
      This website lets you create a chat room without creating an account. Just create a room and share the URL with your friends!<br>
      If there are no users in a room. The room is automatically deleted.<br>
      Another way to join or create a room is by typing the room name in the directory name of the URL.
    </p>

    <form @submit.prevent="CreateOrJoinRoom">
      <div class="box_input">
        <label for="room_name">/</label>
        <input id="room_name" type="text" autocomplete="off" spellcheck="false" placeholder="Room" pattern="\s*\S.*" required v-model="name" v-focus>
      </div>
      <p>{{message}}</p>
      <transition name="fade">
        <button id="button_room" v-show="name!=''">{{button_text}}</button>
      </transition>
    </form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      available: false,
      name: ""
    }
  },
  mounted() {
    document.title = "SCR by SSbit01"
    window.socket.on("roomname_available", bool => {
      this.available = bool
    })
  },
  methods: {
    CreateOrJoinRoom() {
      this.$router.push({name:"Room",params:{name:this.name}})
    }
  },
  computed: {
    color() {
      if (this.name != "") return this.available?'LimeGreen':'Coral'
    },
    message() {
      return this.name==""?"Type a room name":this.available?"Room name available":"Existing room"
    },
    button_text() {
      return this.available?"Create Chat Room":"Join Room"
    }
  },
  watch: {
    name(v) {
      if (v) {
        window.socket.emit("check_roomname", v)
      }
    }
  }
}
</script>


<style lang="sass" scoped>
form
  text-align: center
  margin-bottom: 2em

#box
  display: flex
  flex-direction: column
  align-items: center

#description
  color: white
  background-color: black
  margin: 1em
  padding: 1em
  border: 1px solid Gray
  border-radius: .4em
  line-height: 1.5

#button_room
  margin-top: 1.5em
</style>