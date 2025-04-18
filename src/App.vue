<script>
import AppNavbar from './components/AppNavbar.vue';
import { logout, subscribeToAuth } from './services/auth';

export default {
    name: 'App',
    components: { AppNavbar},
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
        subscribeToAuth(newUserData => (this.loggedUser = newUserData));
    },
};
</script>

<template>
    <AppNavbar :loggedUser="loggedUser" @logout="handleLogout" />
    <main class="container mx-auto p-4">
        <router-view />
    </main>
</template>