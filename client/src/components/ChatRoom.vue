<template>
  <div id="container">
    <header>
      <h2>{{ $route.params.name }}</h2>
      <p>Copy the URL and share it with your friends!</p>
    </header>

    <div id="main_box">
      <div id="box">
        <div id="users">
          <h2 id="users_title">USERS</h2>
          <transition-group name="fade" tag="div">
            <p v-for="(user,i) in users" class="msg" :class="{'my-msg':user===nickname}" :key="i">{{user}}</p>
          </transition-group>
        </div>
        <transition-group name="fade" tag="div" id="messages_box" ref="messages_box">
          <div class="msg" :class="{'my-msg':obj.nick===nickname}" v-for="(obj,i) in messages" :key="i">
            <h3>{{obj.nick}}</h3>
            <p>{{obj.msg}}</p>
          </div>
        </transition-group>
      </div>
      <form @submit.prevent="SendMessage" class="box_input">
        <input type="text" placeholder="Type a message" pattern="\s*\S.*" required v-model="message" v-focus>
        <button :disabled="message==''">SEND</button>
      </form>
    </div>
  </div>
</template>


<script>
const {socket} = window

export default {
  props: ["nickname"],
  data() {
    return {
      users: [],
      messages: [],
      message: ""
    }
  },
  mounted() {
    socket.emit("JoinRoom", this.nickname);
    socket.on("RoomData", obj => {
      this.users = obj.users;
      this.messages = obj.messages;
      this.$nextTick(() => {
        messages_box.scrollTop = obj.messages.length ? messages_box.lastElementChild.offsetTop : 0;
      });
    });
    socket.on("NewUser", user => {
      this.users.push(user);
    });
    socket.on("UserLeaves", user => {
      this.users.splice(this.users.indexOf(user), 1);
    });
    socket.on("NewMsg", msg => {
      this.messages.push(msg);
      this.$nextTick(() => {
        messages_box.scrollTop = messages_box.lastElementChild.offsetTop;
      });
    });
  },
  unmounted() {
    socket.emit("LeaveRoom");
  },
  methods: {
    SendMessage() {
      socket.emit("message", this.message);
      this.message = "";
    }
  }
}
</script>


<style lang="sass" scoped>
$scrollbar_radius: .5em

header
  text-align: center
  h2
    margin-bottom: .5em

form
  display: flex
  margin: 2em 0 2em 0
  input
    flex: 1
    margin-right: .5em

.msg
  background-color: DarkSlateBlue
  border-radius: .5em
  padding: .5em
  p
    margin: .4em
    word-break: break-word

.my-msg
  background-color: RoyalBlue

#container
  display: flex
  flex-direction: column
  align-items: center

#main_box
  font-family: Arial, Helvetica, sans-serif
  width: 85vw

#box
  display: flex
  gap: 1em
  min-height: 20em
  height: 50vh

#messages_box, #users
  overflow: auto
  background-color: rgb(30,30,30)
  box-shadow: 0 0 .4em 1px
  border-radius: .5em
  padding: .8em
  &::-webkit-scrollbar
    background-color: inherit
    border-radius: $scrollbar_radius
    width: .8em
  &::-webkit-scrollbar-thumb
    border: 1px solid black
    border-radius: $scrollbar_radius

#users_title
  text-align: center
  
#messages_box, #users div
  display: flex
  flex-direction: column
  align-items: flex-start
  gap: .8em

#users div
  margin-top: 1em
  justify-content: center
  align-items: center
  flex-wrap: wrap

#messages_box
  flex: 1
  .my-msg
    align-self: flex-end

@media (max-width: 800px)
  #box
    flex-direction: column
  #users div
    flex-direction: row
</style>