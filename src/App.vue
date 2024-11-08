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
            },
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/login');
        },
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

    },

}

</script>

<template>
    <AppNavbar :loggedUser="loggedUser" @logout="handleLogout" />

    <main class="container mx-auto p-4">
        <router-view />
    </main>
    <AppFooter />
</template>