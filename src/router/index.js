 import Vue from 'vue';
 import Router from 'vue-router';
 import VueResource from 'vue-resource';
 import goods from '../components/goods/goods.vue';
 import comments from '../components/comments/comments.vue';
 import seller from '../components/seller/seller.vue';
 import '../common/stylus/main.styl';

 Vue.use(Router);
 Vue.use(VueResource);
 export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'goods'
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/comments',
      component: comments
    },
    {
      path: '/seller',
      component: seller
    }
  ]
 });
