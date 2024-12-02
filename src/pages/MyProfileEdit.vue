<script>
import { editMyProfile, subscribeToAuth } from '../services/auth';
import { readonly } from 'vue';
import Loader from '../components/Loader.vue';

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
        }
    },
    methods: {
        async handleSubmit() {

            if (this.editing) return;

            this.editing = true;

            try {
                await editMyProfile({ ...this.editData });
                this.$router.push('/myProfile');
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
    <h1 class="text-center text-lg font-bold mb-4">Edit my profile</h1>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label class="block mb-2" for="displayName">User name</label>
            <input type="text" id="displayName" class="w-full p-2 border rounded read-only:bg-gray-200"
                :readonly="editing" v-model="editData.displayName">
        </div>
        <div class="mb-4">
            <label class="block mb-2" for="favMovie">Favorite movie</label>
            <input type="text" id="favMovie" class="w-full p-2 border rounded read-only:bg-gray-200" :readonly="editing"
                v-model="editData.favMovie">
        </div>
        <div class="mb-4">
            <label class="block mb-2" for="favSeries">Favorite series</label>
            <input type="text" id="favSeries" class="w-full p-2 border rounded read-only:bg-gray-200"
                :readonly="editing" v-model="editData.favSeries">
        </div>
        <div class="mb-4">
            <label class="block mb-2" for="anAdditionalComment">Additional comments</label>
            <textarea id="anAdditionalComment" class="w-full min-h-20 p-2 border rounded read-only:bg-gray-200"
                :readonly="editing" v-model="editData.anAdditionalComment"></textarea>
        </div>
        <button type="submit"
            class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-[wheat] text-[#f09224]">
            <span v-if="!editing">Update my profile</span>
            <div v-else class="flex flex-row items-center">Updating 
                <Loader />
            </div>
        </button>
    </form>
    
</template>