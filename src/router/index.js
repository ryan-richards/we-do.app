import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from "../supabase"
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Feed from '../views/Feed.vue'
import Post from '../views/Post.vue'

const routes = [
    {
        path: '/',
        name: 'Profile',
        component: Profile,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        
    },
    {
        path: '/feed',
        name: 'feed',
        component: Feed,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/post',
        name: 'post',
        component: Post,
        meta: {
            requiresAuth: true
        }
    },
    { path: '/user/:id', 
      component: () => import("../views/User.vue"),
      meta: {
        requiresAuth: true
    }

  },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach((to, from, next) => {
    const currentUser = supabase.auth.user();
    const requiresAuth = to.matched.some
    (record => record.meta.requiresAuth);
    if(requiresAuth && !currentUser) next('login');
    else if(!requiresAuth && currentUser) next("/");
    else next();
  })


export default router