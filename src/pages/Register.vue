<script>
import { register } from '../services/auth';
import Loader from '../components/Loader.vue';

export default {
    name: 'Register',
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

            if (this.loading) return;

            this.loading = true;

            try {
                await register({
                    ...this.user,
                });
                this.$router.push('/myProfile');
            } catch (error) {
                console.error("[Login handleSubmit] Authentication error: ", error);
            }

            this.loading = false;
        }
    }
}
</script>

<template>
    <h1>Create your account</h1>

    <form action="#" @submit.prevent="handleSubmit">

        <div class="mb-4">
            <label class="block mb-2" for="email">Email</label>
            <input type="email" id="email" class="w-full p-2 border rounded read-only:bg-gray-200" :readonly="loading"
                v-model="user.email">
        </div>

        <div class="mb-4">
            <label class="block mb-2" for="password">Password</label>
            <input type="password" id="password" class="w-full p-2 border rounded read-only:bg-gray-200"
                :readonly="loading" v-model="user.password">
        </div>

        <button type="submit"
            class="flex flex-row items-center transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
            <span v-if="!loading">Register</span>
            <div v-else class="flex flex-row items-center">Registering
                <Loader />
            </div>
        </button>

    </form>
</template>