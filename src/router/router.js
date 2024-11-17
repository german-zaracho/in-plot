import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Feed from "../pages/Feed.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import { subscribeToAuth } from "../services/auth";
import MyProfileEditPhoto from '../pages/MyProfileEditPhoto.vue';
import UserProfile from '../pages/UserProfile.vue';
import PrivateChat from '../pages/PrivateChat.vue';

const routes = [
    { path: '/', name:'home', component:Home, },
    { path: '/feed', name:'feed', component:Feed, meta: { requiresAuth: true } },
    { path: '/login', name:'login', component:Login, },
    { path: '/register', name:'register', component:Register, },
    { path: '/myProfile', name:'myProfile', component:MyProfile, meta: { requiresAuth: true }, },
    { path: '/myProfile/edit', name:'myProfileEdit', component:MyProfileEdit,  meta: { requiresAuth: true }, },
    { path: '/myProfile/edit/photo', name: 'myProfileEditPhoto', component: MyProfileEditPhoto,  meta: { requiresAuth: true }, },
    { path: '/users/:id', name: 'userProfile', component: UserProfile, meta: { requiresAuth: true }, },
    { path: '/users/:id/chat', name: 'userProfileChat', component: PrivateChat, meta: { requiresAuth: true }, },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    favMovie: null,
    favSeries: null,
    anAdditionalComment: null,
}

subscribeToAuth(newUserData => loggedUser = newUserData)

router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && loggedUser.id == null) {
        return { path: '/login'}
    }
});

export default router;


