<script>
import { login } from '../services/auth';
import Loader from '../components/Loader.vue';

export default {
    name: 'Login',
    components: { Loader },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        };
    },
    methods: {
        async handleSubmit() {
            // So that it doesn't run more than once per click (anxious proof)
            if(this.loading) return;

            this.loading = true;

            try {
                await login({
                    ...this.user,
                });
                this.$router.push('/myProfile');
            } catch (error) {
                console.error("[Login handleSubmit] Error authenticating user: ", error);
            }

            this.loading = false;
        }
    }
}
</script>

<template>
    <h1>Log in to your account</h1>

    <form action="#" @submit.prevent="handleSubmit">

        <div class="mb-4">
            <label class="block mb-2" for="email">Email</label>
            <input type="email" id="email" class="w-full p-2 border rounded read-only:bg-gray-200" :readonly="loading" v-model="user.email">
        </div>

        <div class="mb-4">
            <label class="block mb-2" for="password">Password</label>
            <input type="password" id="password" class="w-full p-2 border rounded read-only:bg-gray-200" :readonly="loading" v-model="user.password">
        </div>

        <button type="submit" class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
            <span v-if="!loading">
                Log in
            </span>
            <Loader v-else />
        </button>

    </form>

</template>