<script>
import { createReviewForAuthenticatedUser } from '../services/auth';
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
                year: '2024',
                contentType: '',
            },
            coverImage: null,
            coverPreview: null,
            years: Array.from({ length: 2026 - 1900 + 1 }, (_, i) => 2026 - i),
            adding: false,
            dropdownVisible: false,
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
            if (this.adding) return;

            this.adding = true;

            try {
                console.log('Datos enviados:', this.coverImage, this.reviewData);
                await createReviewForAuthenticatedUser(this.coverImage, this.reviewData);
                this.$router.push('/feed');
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
    <h1>Create a new review</h1>

    <form action="#" @submit.prevent="handleSubmit">

        <div class="mb-4">
            <label class="block mb-2" for="title">Title</label>
            <input type="text" id="title" class="w-full p-2 border rounded read-only:bg-gray-200" :readonly="adding"
                v-model="reviewData.title">
        </div>

        <div class="mb-4">
            <label for="cover" class="block mb-2">Cover</label>
            <input type="file" id="cover" @change="handleFileSelection" class="w-full p-2 border rounded">
            <div v-if="coverPreview" class="mt-2">
                <h2>Preview</h2>
                <img :src="coverPreview" alt="Cover preview" class="max-w-xs">
            </div>
        </div>

        <div class="mb-4">
            <label class="block mb-2" for="synopsis">Synopsis</label>
            <textarea id="synopsis" class="w-full min-h-20 p-2 border rounded read-only:bg-gray-200" :readonly="adding"
                v-model="reviewData.synopsis"></textarea>
        </div>

        <div class="mb-4 max-w-[200px]">
            <label class="block mb-2" for="year">Year</label>
            <div class="relative" ref="dropdownContainer">
                <button type="button"
                    class="w-full p-2 border rounded text-left flex items-center justify-between bg-[white]"
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
            </div>
        </div>

        <div class="mb-4 max-w-[200px]">
            <label class="block mb-2" for="contentType">Type (Movie or Series)</label>
            <select id="contentType" class="w-full p-2 border rounded bg-white" v-model="reviewData.contentType">
                <option value="Movie">Movie</option>
                <option value="Series">Series</option>
            </select>
        </div>



        <div class="mb-4">
            <label class="block mb-2" for="trailer">Trailer (YouTube URL)</label>
            <input id="trailer" type="url" class="w-full p-2 border rounded read-only:bg-gray-200"
                placeholder="Enter a YouTube URL" :readonly="adding" v-model="reviewData.trailer"
                pattern="https?://(www\.)?youtube\.com/.*" />
        </div>

        <button type="submit"
            class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
            <span v-if="!adding">Create Review</span>
            <Loader v-else />
        </button>

    </form>

</template>
