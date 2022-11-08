import { ref } from "vue"
import { defineStore } from "pinia"



export default defineStore("room", () => {
  const roomName = ref(""),
        nickname = ref(""),
        showForm = ref(true)
  
  return { roomName, nickname, showForm }
})