import { createRouter, createWebHashHistory } from 'vue-router';
import { post } from '../utils/axios';

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
    component: () => import(/* webpackChunkName: "Home" */ '../views/my/MyHomePage.vue'),
    beforeEnter: (to, from, next) => {
      // 判断是否登录
      const isLogin = localStorage.getItem('isLogin');
      if (isLogin) {
        next();
      } else {
        next('/login');
      }
    },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  // 判断是否登录
  // 判断是否去登录页
  if (to.path === '/login' || from.path === '/login') {
    next();
    return;
  }
  post('login/test').then((res) => {
    const userInfo = {
      id: res.id,
      username: res.username,
    };
    localStorage.setItem('isLogin', true);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }).catch(() => {
    localStorage.setItem('isLogin', false);
    localStorage.setItem('userInfo', JSON.stringify({}));
  });
  next();
});
export default router;
