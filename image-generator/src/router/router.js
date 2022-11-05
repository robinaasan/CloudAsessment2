import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import UploadPictures from '../views/UploadPicture.vue';
import LoadPictures from '../views/LoadPictures.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/upload',
      component: Home,
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadPictures,
    },
    {
      path: '/load',
      name: 'load',
      component: LoadPictures,
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
});

export default router;
