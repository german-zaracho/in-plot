<script>
import Loader from '../components/Loader.vue';
import { editMyProfilePhoto } from '../services/user-profile';
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
                //console.log('photo', this.editData.photo);
                if (this.editData.photo) {
                    await editMyProfilePhoto(this.editData.photo);
                }
                this.$router.push({ path: '/myProfile', query: { profileEdited: 'profilePhotoEdited' } });
            } catch (error) {
                console.error('[MyProfileEditPhoto handleSubmit] Error editing profile photo: ', error);
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
    <h1 class="mb-[20px] font-bold text-center text-white">Edit my Profile Photo</h1>

    <div class="flex gap-4 shadow-2xl ring-2 ring-black ring-opacity-10 p-[20px] rounded-[20px] ">
        <form class="w-1/2" action="#" @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label class="block mb-2 text-white" for="photo">New Photo</label>
                <input type="file" id="photo"
                    class="w-full p-2 border rounded text-white focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                    @change="handleFileSelection">
            </div>

            <div class="flex flex-row gap-4 justify-between">

                <button type="submit"
                    class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] hover:text-[wheat] text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]">
                    <span v-if="!editing">Update my profile</span>
                    <div v-else class="flex flex-row items-center ">Updating my profile
                        <Loader />
                    </div>
                </button>

                <button type="button" @click="$router.push('/myProfile')"
                    class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] hover:text-[wheat] text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]">
                    Cancel
                </button>

            </div>

        </form>
        <div class="w-1/2">
            <h2 class="mb-2 text-white">Preview</h2>
            <img v-if="editData.photoPreview" :src="editData.photoPreview" alt="photo preview" width="300px">
        </div>
    </div>
</template>