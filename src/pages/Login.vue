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
            feedback: {
                message: null,
            }
        };
    },
    methods: {
        async handleSubmit() {

            // So that it doesn't run more than once per click (anxious proof)
            if (this.loading) return;

            this.feedback.message = null;
            this.loading = true;

            try {
                await login({ ...this.user, });

                this.$router.push('/myProfile');
                console.log("redirect correctly");
            } catch (error) {
                this.feedback.message = error;
                console.error("[Login handleSubmit] Error authenticating user: ", error);
            }

            this.loading = false;

        }
    }
}
</script>

<template>


    <div v-if="feedback.message !== null" class="p-4 mb-4 bg-red-200 rounded">
        {{ feedback.message }}
    </div>

    <h1 class="mb-[20px] font-bold text-center text-white">Log in to your account</h1>

    <form action="#" @submit.prevent="handleSubmit"
        class="shadow-2xl ring-2 ring-black ring-opacity-10 p-[20px] m-auto max-w-[600px] rounded-[20px] bg-dark-gradient">

        <div class="mb-4">
            <label class="block mb-2 text-white" for="email">Email</label>
            <input type="email" id="email" class="w-full p-2 border rounded read-only:bg-gray-200" :readonly="loading"
                v-model="user.email">
        </div>

        <div class="mb-4">
            <label class="block mb-2 text-white" for="password">Password</label>
            <input type="password" id="password" class="w-full p-2 border rounded read-only:bg-gray-200"
                :readonly="loading" v-model="user.password">
        </div>

        <button type="submit"
            class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] hover:text-[wheat] text-[#f1c421]">
            <span v-if="!loading">Log in</span>
            <div v-else class="flex flex-row items-center">Logging in
                <Loader />
            </div>
        </button>

    </form>

</template>