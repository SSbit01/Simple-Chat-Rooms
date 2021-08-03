import { createApp } from 'vue';
import App from './App';
import './registerServiceWorker';
import router from "./router.js";

window.socket = require("socket.io-client")(/*"http://localhost:3000"*/);

const app = createApp(App);

app.directive("focus", {
  mounted(el) {
    el.focus();
  }
});

app.use(router).mount('#app');
