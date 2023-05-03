import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Home" */ '../views/login/Login.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/home/HomePage.vue'),
  },
  {
    path: '/my/:userId',
    name: 'myHomePage',
    component: () => import(/* webpackChunkName: "Home" */ '../views/my/myHomePage.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
