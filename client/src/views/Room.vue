<template>
  <transition name="fade" mode="out-in">

    <form v-if="show_form" @submit.prevent="show_form=false">
      <h2>ROOM FORM</h2>
      <div class="box_input" :style="{color:color}">
        <label for="nickname">Nickname: </label>
        <input type="text" id="nickname" placeholder="Player Number 1" pattern="\s*\S.*" required v-model="nickname" :maxlength="max" v-focus>
      </div>
      <button :disabled="nickname == '' || !available || loading">Join Room</button>
    </form>

    <ChatRoom :nickname="nickname.slice(0, max)" v-else/>

  </transition>
</template>


<script>
import ChatRoom from "../components/ChatRoom";
const {socket} = window;

export default {
  components: {ChatRoom},
  data() {
    return {
      show_form: true,
      max: 20,
      available: false,
      nickname: "",
      loading: false
    }
  },
  mounted() {
    document.title = this.$route.params.name;
    socket.emit("RoomName", this.$route.params.name);
    socket.on("nickname_available", bool => {
      this.available = bool;
      this.loading = false;
    });
  },
  computed: {
    color() {
      if (this.nickname != "") {
        return this.available ? "LimeGreen" : (this.loading ? "Orange" : "Crimson");
      }
    }
  },
  watch: {
    nickname(v) {
      if (v) {
        this.loading = true;
        socket.emit("check_nickname", v);
      } else {
        this.loading = false;
        this.available = false;
      }
    }
  }
}
</script>


<style lang="sass" scoped>
form
  background-color: rgb(25,25,25)
  margin-top: auto
  margin-bottom: 2em
  padding: 1em
  border: 1px solid
  border-radius: .5em
  text-align: center

.box_input
  margin: 1em
</style>