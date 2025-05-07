<script>
import { subscribeToAuth } from '../services/auth';
import { editMyProfile } from '../services/user-profile';
import { readonly } from 'vue';
import Loader from '../components/Loader.vue';
import { validatePostFields } from '../services/validation';

let unsubscribeFromAuth = () => { };

export default {
    name: 'MyProfileEdit',
    components: { Loader },
    data() {
        return {
            editData: {
                displayName: '',
                favMovie: '',
                favSeries: '',
                anAdditionalComment: '',
            },
            editing: false,
            fieldErrors: {},
        }
    },
    methods: {
        async handleSubmit() {

            if (this.editing) return;

            // Validate fields
            const errors = validatePostFields(this.editData, ['displayName', 'favMovie', 'favSeries', 'anAdditionalComment']);
            this.fieldErrors = errors;
            // If there are errors, do not continue.
            if (Object.keys(errors).length > 0) return;

            this.editing = true;

            try {
                await editMyProfile({ ...this.editData });
                this.$router.push({ path: '/myProfile', query: { profileEdited: 'profileEdited' } });
            } catch (error) {
                console.error('[MyProfileEdit handleSubmit] Error editing profile: ', error);
            }

            this.editing = false;

        },
    },
    mounted() {

        unsubscribeFromAuth = subscribeToAuth(userData => this.editData = {
            displayName: userData.displayName || '',
            favMovie: userData.favMovie || '',
            favSeries: userData.favSeries || '',
            anAdditionalComment: userData.anAdditionalComment || '',
        });

    },
    unmounted() {
        unsubscribeFromAuth();
    },
}
</script>

<template>
    <h1 class="text-center text-lg font-bold mb-4 text-white">Edit my profile</h1>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label class="block mb-2 text-white" for="displayName">User name</label>
            <input type="text" id="displayName"
                class="w-full p-2 border rounded read-only:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                :readonly="editing" v-model="editData.displayName">
            <p v-if="fieldErrors.displayName" class="text-red-500 text-sm mt-1">{{ fieldErrors.displayName }}</p>
        </div>
        <div class="mb-4">
            <label class="block mb-2 text-white" for="favMovie">Favorite movie</label>
            <input type="text" id="favMovie"
                class="w-full p-2 border rounded read-only:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                :readonly="editing" v-model="editData.favMovie">
            <p v-if="fieldErrors.favMovie" class="text-red-500 text-sm mt-1">{{ fieldErrors.favMovie }}</p>
        </div>
        <div class="mb-4">
            <label class="block mb-2 text-white" for="favSeries">Favorite series</label>
            <input type="text" id="favSeries"
                class="w-full p-2 border rounded read-only:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                :readonly="editing" v-model="editData.favSeries">
            <p v-if="fieldErrors.favSeries" class="text-red-500 text-sm mt-1">{{ fieldErrors.favSeries }}</p>
        </div>
        <div class="mb-4">
            <label class="block mb-2 text-white" for="anAdditionalComment">Additional comments</label>
            <textarea id="anAdditionalComment"
                class="w-full min-h-20 p-2 border rounded read-only:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                :readonly="editing" v-model="editData.anAdditionalComment"></textarea>
            <p v-if="fieldErrors.anAdditionalComment" class="text-red-500 text-sm mt-1">{{ fieldErrors.anAdditionalComment }}</p>
        </div>
        <div class="flex flex-row justify-between">
            <button type="submit"
                class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] hover:text-[wheat] text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]">
                <span v-if="!editing">Update my profile</span>
                <div v-else class="flex flex-row items-center">Updating
                    <Loader />
                </div>
            </button>
            <button type="button" @click="$router.push('/myProfile')"
                class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] hover:text-[wheat] text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]">
                Cancel
            </button>
        </div>

    </form>

</template>