import { createApp } from "vue"

import App from "@/App.vue"
import router from "@/router"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import {
  fa4,
  fa0,
  faSadCry,
  faHouse,
  faCommentDots,
  faUserSecret,
  faCommentSlash,
  faUsers,
  faWindowMaximize,
  faRightLong,
  faCog,
  faExclamation,
  faBolt,
  faCrosshairs,
  faXmark,
  faRightToBracket,
  faRotateRight,
  faRightFromBracket,
  faArrowLeft,
  faUser,
  faCircleUser,
  faPenToSquare,
  faShareFromSquare,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons"
import {
  faGitAlt,
  faHtml5
} from "@fortawesome/free-brands-svg-icons"


library.add(
  fa4,
  fa0,
  faSadCry,
  faHouse,
  faCommentDots,
  faHtml5,
  faGitAlt,
  faUserSecret,
  faCommentSlash,
  faUsers,
  faWindowMaximize,
  faRightLong,
  faCog,
  faExclamation,
  faBolt,
  faCrosshairs,
  faXmark,
  faRightToBracket,
  faRotateRight,
  faRightFromBracket,
  faArrowLeft,
  faUser,
  faCircleUser,
  faPenToSquare,
  faShareFromSquare,
  faPaperPlane
)

createApp(App)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("body")