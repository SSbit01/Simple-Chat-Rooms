import { ref } from "vue"
import { defineStore } from "pinia"

export default defineStore("room", () => {
  const name = ref(""),
    nick = ref(""),
    showForm = ref(true)

  return { name, nick, showForm }
})
