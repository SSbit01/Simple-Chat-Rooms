import { createRouter, createWebHistory } from "vue-router"

import HomePage from "@/views/HomeAbout.vue"
import RoomPage from "@/views/RoomPage.vue"
import Page404 from "@/views/404Error.vue"

import { roomNameAttributes, nicknameAttributes } from "@global/roomAttributes"



const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      name: "Home",
      path: "/",
      alias: ["/room", "/home"],
      component: HomePage
    },
    {
      path: "/room",
      children: [
        {
          path: ":roomName",
          component: RoomPage,
          beforeEnter(to) {
            if ((Array.isArray(to.params.roomName) ? to.params.roomName[0] : to.params.roomName).trim().length > roomNameAttributes.maxLength) {
              return "/"
            }

            if (((Array.isArray(to.query.name) ? to.query.name[0] : to.query.name)?.trim() || "").length > nicknameAttributes.maxLength) {
              delete to.query.name
              return to
            }
          }
        }
      ]
    },
    {
      name: "ERROR",
      path: "/:invalidPath(.*)*",
      component: Page404
    }
  ]

})


router.afterEach((to, from, error) => {
  document.title = to.name ? `SCR - ${to.name?.toString()}` : to.path
})



export default router