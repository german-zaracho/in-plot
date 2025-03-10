import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Feed from "../pages/Feed.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import { subscribeToAuth } from "../services/auth";
import MyProfileEditPhoto from '../pages/MyProfileEditPhoto.vue';
import UserProfile from '../pages/UserProfile.vue';
import NewReview from "../pages/NewReview.vue";
import EditMyReview from "../pages/EditMyReview.vue";

const routes = [
    { path: '/', name:'home', meta: { requiresLoginVerification: true } },
    { path: '/feed', name:'feed', component:Feed, meta: { requiresAuth: true } },
    { path: '/login', name:'login', component:Login, },
    { path: '/register', name:'register', component:Register, },
    { path: '/myProfile', name:'myProfile', component:MyProfile, meta: { requiresAuth: true }, },
    { path: '/myProfile/edit', name:'myProfileEdit', component:MyProfileEdit,  meta: { requiresAuth: true }, },
    { path: '/myProfile/edit/photo', name: 'myProfileEditPhoto', component: MyProfileEditPhoto,  meta: { requiresAuth: true }, },
    { path: '/users/:id', name: 'userProfile', component: UserProfile, meta: { requiresAuth: true }, },
    { path: '/newReview', name: 'newReview', component: NewReview, meta: { requiresAuth: true }, },
    { path: '/users/:id/editMyReview', name: 'editMyReview', component: EditMyReview, meta: { requiresAuth: true }, },
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

subscribeToAuth(newUserData => loggedUser = newUserData);

router.beforeEach((to, from) => {

    // dynamic address for '/'
    if (to.meta.requiresLoginVerification) {
        if (loggedUser.id) {
            return { path: '/feed' }; // authenticated user
        } else {
            return { path: '/login' }; // unauthenticated user
        }
    }
    
    // general redirection when you are not authenticated
    if (to.meta.requiresAuth && !loggedUser.id == null) {
        return { path: '/login' };
    }

});

export default router;


