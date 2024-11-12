<script>
import Home from './pages/Home.vue';
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';
import { logout, subscribeToAuth } from './services/auth';

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
        },
    },
    mounted() {
        subscribeToAuth(newUserData => this.loggedUser = newUserData);
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