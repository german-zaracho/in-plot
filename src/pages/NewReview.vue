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
                cover: '',
                synopsis: '',
                trailer: '',
                year: '2024',
            },
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
            if(this.adding) return;

            this.adding = true;

            try {
                await createReviewForAuthenticatedUser({...this.reviewData});
                this.$router.push('/feed');
            } catch (error) {
                console.error('[NewReview handleSubmit] Error trying to create a new review:: ', error);
            }

            this.adding = false;
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
            <label class="block mb-2" for="cover">Cover</label>
            <input type="file" id="cover" class="w-full p-2 border rounded" @change="handleFileSelection">
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
