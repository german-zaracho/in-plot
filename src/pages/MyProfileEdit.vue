<script>
import { editMyProfile } from '../services/auth';

export default {
    name: 'MyProfileEdit',
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
            this.editing = true;

            try {
                await editMyProfile({...this.editData});
            } catch (error) {
                console.error('[MyProfileEdit handleSubmit] Error editing profile: ', error);
            }

            this.editing = false;
        }
    }
}
</script>

<template>
    <h1>Edit my profile</h1>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label class="block mb-2" for="displayName">User name</label>
            <input type="text" id="displayName" class="w-full p-2 border rounded" v-model="editData.displayName">
        </div>
        <div class="mb-4">
            <label class="block mb-2" for="favMovie">Favorite movie</label>
            <input type="text" id="favMovie" class="w-full p-2 border rounded" v-model="editData.favMovie">
        </div>
        <div class="mb-4">
            <label class="block mb-2" for="favSeries">Favorite series</label>
            <input type="text" id="favSeries" class="w-full p-2 border rounded" v-model="editData.favSeries">
        </div>
        <div class="mb-4">
            <label class="block mb-2" for="anAdditionalComment">Additional comments</label>
            <textarea id="anAdditionalComment" class="w-full min-h-20 p-2 border rounded" v-model="editData.anAdditionalComment"></textarea>
        </div>
        <button type="submit" class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
            Update my profile
        </button>
    </form>
</template>