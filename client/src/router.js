import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import("@/views/Home")
  },
  {
    path: '/:name',
    name: 'Room',
    component: () => import("@/views/Room")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
