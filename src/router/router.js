import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Feed from "../pages/Feed.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

const routes = [
    { path: '/', name:'home', component:Home },
    { path: '/feed', name:'feed', component:Feed, meta: { requiresAuth: true } },
    { path: '/login', name:'login', component:Login },
    { path: '/register', name:'register', component:Register },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let loggedUser = {
    id: null,
    email: null,
}

// subscribeToAuth(newUserData => loggedUser = newUserData)

router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && loggedUser.id == null) {
        return { path: '/login'}
    }
});

export default router;


