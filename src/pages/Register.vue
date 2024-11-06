<script>
import { register } from '../services/auth';

export default {
    name:'Register',
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
            this.loading = true;

            try {
                await register({
                    ...this.user,
                });
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
            <input type="email" id="email" class="w-full p-2 border rounded" v-model="user.email">
        </div>

        <div class="mb-4">
            <label class="block mb-2" for="password">Password</label>
            <input type="password" id="password" class="w-full p-2 border rounded" v-model="user.password">
        </div>

        <button type="submit" class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
            Register
        </button>

    </form>
</template>