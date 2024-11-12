import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Feed from "../pages/Feed.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";

const routes = [
    { path: '/', name:'home', component:Home },
    { path: '/feed', name:'feed', component:Feed, meta: { requiresAuth: true } },
    { path: '/login', name:'login', component:Login, },
    { path: '/register', name:'register', component:Register, },
    { path: '/myProfile', name:'myProfile', component:MyProfile, },
    { path: '/myProfileEdit', name:'myProfileEdit', component:MyProfileEdit, },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

// let loggedUser = {
//     id: null,
//     email: null,
// }

// subscribeToAuth(newUserData => loggedUser = newUserData)

router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && loggedUser.id == null) {
        return { path: '/login'}
    }
});

export default router;


