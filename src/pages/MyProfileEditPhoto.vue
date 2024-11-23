<script>
import Loader from '../components/Loader.vue';
import { editMyProfilePhoto } from '../services/auth';

export default {
    name: 'MyProfileEditPhoto',
    components: { Loader },
    data() {
        return {
            editing: false,
            editData: {
                photo: null,
                photoPreview: null,
            },
        }
    },
    methods: {
        async handleSubmit() {
            this.editing = true;

            try {
                console.log('photo',this.editData.photo )
                await editMyProfilePhoto(this.editData.photo);
                this.$router.push('/myProfile');
            } catch (error) {
                //check this later
            }

            this.editing = false;
        },

        handleFileSelection(ev) {

            this.editData.photo = ev.target.files[0];

            const reader = new FileReader();

            reader.addEventListener('load', () => {
                this.editData.photoPreview = reader.result;
            });

            reader.readAsDataURL(this.editData.photo);
        },
    }
}
</script>

<template>
    <h1>Edit my Profile Photo</h1>

    <div class="flex gap-4">
        <form class="w-1/2" action="#" @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label class="block mb-2" for="photo">New Photo</label>
                <input type="file" id="photo" class="w-full p-2 border rounded" @change="handleFileSelection">
            </div>
            <button type="submit"
                class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
                <span v-if="!editing">Update my profile</span>
                <Loader v-else />
            </button>
        </form>
        <div class="w-1/2">
            <h2 class="mb-2">Preview</h2>
            <img v-if="editData.photoPreview" :src="editData.photoPreview" alt="">
        </div>
    </div>
</template>