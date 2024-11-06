<script>
import { onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home.vue';
import { auth } from './services/firebase';
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';
import { logout } from './services/auth';

export default {
    name: 'App',
    components: { AppNavbar, AppFooter, Home },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
            }
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/login');
        }
    },
    mounted() {

        onAuthStateChanged(auth, user => {
            if (user) {
                this.loggedUser = {
                    id: user.uid,
                    email: user.email,
                }
            } else {
                this.loggedUser = {
                    id: null,
                    email: null,
                }
            }
        });

    }
}

</script>

<template>
    <!-- <AppNavbar /> -->

    <nav class="flex justify-between items-center p-4 bg-slate-200 text-gray-800">

        <router-link :to="{ name: 'home' }" class="text-xl">InPlot</router-link>

        <ul class="flex gap-2">

            <li><router-link class="block py-2 px-4" :to="{ name: 'home' }">Home</router-link></li>

            <template v-if="loggedUser.id !== null">
                <li><router-link class="block py-2 px-4" to="/feed">Feed</router-link></li>
                <li><router-link class="block py-2 px-4" to="/feed">My Profile</router-link></li>
                <li>
                    <form action="#" @submit.prevent="handleLogout">
                        <button type="submit" class="block py-2 px-4">{{ loggedUser.email }} (Log out)</button>
                    </form>
                </li>
            </template>

            <template v-else>
                <li><router-link class="block py-2 px-4" to="/register">Register</router-link></li>
                <li><router-link class="block py-2 px-4" to="/login">Login</router-link></li>
            </template>

        </ul>

    </nav>

    <main class="container mx-auto p-4">
        <router-view />
    </main>
    <AppFooter />
</template>