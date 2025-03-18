<script>
import { getReviewById, updateReview, uploadCoverImage } from '../services/media-reviews';
import { readonly } from 'vue';
import Loader from '../components/Loader.vue';

export default {
    name: 'EditMyReview',
    components: { Loader },
    data() {
        return {
            reviewData: {
                title: '',
                synopsis: '',
                trailer: '',
                year: '',
                contentType: '',
                coverURL: '',
                user_id:'',
            },
            coverImage: null,
            previewImage: null,
            coverPreview: null,
            reviewId: '',
            years: Array.from({ length: 2026 - 1900 + 1 }, (_, i) => 2026 - i),
            adding: false,
            dropdownVisible: false,
            isUploading: false,
        };
    },
    mounted() {
        document.addEventListener('click', this.handleOutsideClick);
        this.fetchReviewData();
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleOutsideClick);
    },
    methods: {
        async fetchReviewData() {

            const reviewId = this.$route.params.id; // Review id in the url
            try {
                const review = await getReviewById(reviewId);
                this.reviewData = { ...review };
                this.coverPreview = review.coverURL;
                this.reviewId = review.id;
            } catch (error) {
                console.error('Error getting review data:', error);
            }

        },
        async handleSubmit() {

            this.isUploading = true;
            try {
                let coverURL = this.reviewData.coverURL;
                // console.log('coverUrl', coverURL, 'coverImage', this.coverImage, "userId", this.reviewData.user_id, );
                // If a new cover image is selected, upload the image and get the url
                if (this.coverImage) {
                    coverURL = await uploadCoverImage(this.coverImage, this.reviewData.user_id, this.reviewData.coverURL);
                }
                // Update the review data with the new cover image url (if any)
                const updatedReview = {
                    ...this.reviewData,
                    coverURL,
                };
                // update the review in firestore
                await updateReview(this.reviewId, updatedReview);
                this.$router.push('/myProfile');
            } catch (error) {
                console.error('Error updating review:', error);
            }
            this.isUploading = false;

        },
        async handleFileSelection(event) {

            const file = event.target.files[0];

            if (file) {
                this.coverImage = file;
                // Preview of the selected image
                const reader = new FileReader();
                reader.onload = () => {
                    this.previewImage = reader.result;
                };
                reader.readAsDataURL(file);
            }

        },
        toggleDropdown(event) {

            event.stopPropagation();
            this.dropdownVisible = !this.dropdownVisible;

        },
        selectYear(year) {

            this.reviewData.year = year;
            this.dropdownVisible = false;

        },
        handleOutsideClick(event) {

            const dropdownContainer = this.$refs.dropdownContainer;
            if (dropdownContainer && !dropdownContainer.contains(event.target)) {
                this.dropdownVisible = false;
            }

        },
    }
}
</script>

<template>
    <h1 class="mb-[20px] font-bold text-center text-white">Edit a review</h1>

    <form action="#" @submit.prevent="handleSubmit" class="shadow-2xl ring-2 ring-black ring-opacity-10 p-[20px]">

        <div class="mb-4">
            <label class="block mb-2 text-white" for="title">Title</label>
            <input type="text" id="title" class="w-full p-2 border rounded read-only:bg-gray-200" :readonly="isUploading"
                v-model="reviewData.title">
        </div>

        <div class="mb-4">
            <label for="cover" class="block mb-2 text-white">Cover</label>
            <input type="file" id="cover" @change="handleFileSelection" class="w-full p-2 border rounded">
            <div v-if="previewImage" class="mt-2">
                <h2>Preview</h2>
                <img :src="previewImage" alt="Cover preview" class="max-w-xs">
            </div>
        </div>

        <div class="mb-4">
            <label class="block mb-2 text-white" for="synopsis">Synopsis</label>
            <textarea id="synopsis" class="w-full min-h-20 p-2 border rounded read-only:bg-gray-200" :readonly="isUploading"
                v-model="reviewData.synopsis"></textarea>
        </div>

        <div class="mb-4 max-w-[200px]">
            <label class="block mb-2 text-white" for="year">Year</label>
            <div class="relative" ref="dropdownContainer">
                <button type="button" class="w-full p-2 border rounded text-left flex items-center justify-between bg-[white]" @click="toggleDropdown">
                    <span>{{ reviewData.year || 'Select a year' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div v-if="dropdownVisible" class="absolute z-10 w-full bg-white border rounded shadow-lg max-h-[200px] overflow-y-auto mt-1">
                    <ul>
                        <li v-for="year in years" :key="year" class="p-2 cursor-pointer hover:bg-[#0066ff]" @click="selectYear(year)">
                            {{ year }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="mb-4 max-w-[200px]">
            <label class="block mb-2 text-white" for="contentType">Type (Movie or Series)</label>
            <select id="contentType" class="w-full p-2 border rounded bg-white" v-model="reviewData.contentType">
                <option value="Movie">Movie</option>
                <option value="Series">Series</option>
            </select>
        </div>

        <div class="mb-4">
            <label class="block mb-2 text-white" for="trailer">Trailer (YouTube URL)</label>
            <input id="trailer" type="url" class="w-full p-2 border rounded read-only:bg-gray-200"
                placeholder="Enter a YouTube URL" :readonly="isUploading" v-model="reviewData.trailer"
                pattern="https?://(www\.)?youtube\.com/.*" />
        </div>

        <button type="submit"
            class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] text-[#f1c421] hover:text-[#f1c421]">
            <span v-if="!isUploading">Save changes</span>
            <div v-else class="flex flex-row items-center">Saving changes 
                <Loader />
            </div>
        </button>

    </form>

</template>