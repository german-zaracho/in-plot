<script>
import { createNewReview } from '../services/media-reviews';
import { validatePostFields } from '../services/validation';
import { readonly } from 'vue';
import Loader from '../components/Loader.vue';

export default {
    name: 'NewReview',
    components: { Loader },
    data() {
        return {
            reviewData: {
                title: '',
                synopsis: '',
                trailer: '',
                year: '2025',
                contentType: '',
            },
            coverImage: null,
            coverPreview: null,
            years: Array.from({ length: 2026 - 1900 + 1 }, (_, i) => 2026 - i),
            adding: false,
            dropdownVisible: false,
            fieldErrors: {},
        };
    },
    mounted() {
        document.addEventListener('click', this.handleOutsideClick);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleOutsideClick);
    },
    methods: {
        async handleSubmit() {

            if (this.editing) return;

            // Validate fields
            const errors1 = validatePostFields(this.reviewData, ['title', 'synopsis', 'trailer', 'year', 'contentType']);
            const errors2 = validatePostFields({ photo: this.coverImage }, ['photo']);
            this.fieldErrors = { ...errors1, ...errors2 };
            // If there are errors, do not continue.
            if (Object.keys(this.fieldErrors).length > 0) return;
            this.adding = true;

            try {
                // console.log('Data sent:', this.coverImage, this.reviewData);
                await createNewReview(this.coverImage, this.reviewData);
                this.$router.push({ path: '/feed', query: { reviewState: 'reviewCreated' } });
            } catch (error) {
                console.error('[NewReview handleSubmit] Error trying to create a new review:: ', error);
            }

            this.adding = false;

        },
        handleFileSelection(event) {

            this.coverImage = event.target.files[0];

            const reader = new FileReader();

            reader.onload = () => {
                this.coverPreview = reader.result;
            };

            reader.readAsDataURL(this.coverImage);

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
    <h1 class="text-2xl text-white font-bold mb-4">Create a new review</h1>

    <form action="#" @submit.prevent="handleSubmit" class="shadow-2xl ring-2 ring-black ring-opacity-10 p-[20px] rounded-md">

        <div class="mb-4">
            <label class="block mb-2 text-white" for="title">Title</label>
            <input type="text" id="title"
                class="w-full p-2 border rounded read-only:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                :readonly="adding" v-model="reviewData.title">
                <p v-if="fieldErrors.title" class="text-red-500 text-sm mt-1">{{ fieldErrors.title }}</p>
        </div>

        <div class="mb-4">
            <label for="cover" class="block mb-2 text-white">Cover</label>
            <input type="file" id="cover" @change="handleFileSelection"
                class="w-full p-2 border rounded text-white focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]">
            <p v-if="fieldErrors.photo" class="text-red-500 text-sm mt-1">{{ fieldErrors.photo }}</p>
            <div v-if="coverPreview" class="mt-2">
                <h2 class="text-white">Preview</h2>
                <img :src="coverPreview" alt="Cover preview" class="max-w-xs">
            </div>
        </div>

        <div class="mb-4">
            <label class="block mb-2 text-white" for="synopsis">Synopsis</label>
            <textarea id="synopsis"
                class="w-full min-h-20 p-2 border rounded read-only:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                :readonly="adding" v-model="reviewData.synopsis"></textarea>
                <p v-if="fieldErrors.synopsis" class="text-red-500 text-sm mt-1">{{ fieldErrors.synopsis }}</p>
        </div>

        <div class="mb-4 max-w-[200px]">
            <label class="block mb-2 text-white" for="year">Year</label>
            <div class="relative" ref="dropdownContainer">
                <button type="button"
                    class="w-full p-2 border rounded text-left flex items-center justify-between bg-[white] focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                    @click="toggleDropdown">
                    <span>{{ reviewData.year || 'Select a year' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div v-if="dropdownVisible"
                    class="absolute z-10 w-full bg-white border rounded shadow-lg max-h-[200px] overflow-y-auto mt-1">
                    <ul>
                        <li v-for="year in years" :key="year" class="p-2 cursor-pointer hover:bg-[#0066ff]"
                            @click="selectYear(year)">
                            {{ year }}
                        </li>
                    </ul>
                </div>
                <p v-if="fieldErrors.year" class="text-red-500 text-sm mt-1">{{ fieldErrors.year }}</p>
            </div>
        </div>

        <div class="mb-4 max-w-[200px]">
            <label class="block mb-2 text-white" for="contentType">Type (Movie or Series)</label>
            <select id="contentType"
                class="w-full p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                v-model="reviewData.contentType">
                <option value="Movie">Movie</option>
                <option value="Series">Series</option>
            </select>
            <p v-if="fieldErrors.contentType" class="text-red-500 text-sm mt-1">{{ fieldErrors.contentType }}</p>
        </div>

        <div class="mb-4">
            <label class="block mb-2 text-white" for="trailer">Trailer (YouTube URL)</label>
            <input id="trailer" type="url"
                class="w-full p-2 border rounded read-only:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:border-[#f1c421]"
                placeholder="e.g. https://www.youtube.com/" :readonly="adding" v-model="reviewData.trailer"
                pattern="https?://(www\.)?youtube\.com/.*" />
                <p v-if="fieldErrors.trailer" class="text-red-500 text-sm mt-1">{{ fieldErrors.trailer }}</p>
        </div>

        <div class="flex flex-row justify-between">

            <button type="submit"
                class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] text-[#f1c421] hover:text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]">
                <span v-if="!adding">Create Review</span>
                <div v-else class="flex flex-row items-center">Creating a review
                    <Loader />
                </div>
            </button>

            <button type="button" @click="$router.push('/feed')"
                class="flex flex-row items-center transition py-2 px-4 rounded-lg bg-[#272120] hover:bg-[#3c2f2d] hover:text-[wheat] text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]">
                Cancel
            </button>

        </div>


    </form>

</template>
