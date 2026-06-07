import { createRouter, createWebHistory } from 'vue-router'
import Login from '../Login.vue';
import Mfa from '../Mfa.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/mfa',
      name: 'MFA',
      component: Mfa,
      props: route => ({ service: route.query.service }),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
