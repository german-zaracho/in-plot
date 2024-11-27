<script>
import { getAllReviews } from '../../services/media-reviews';
import SkeletonLoader from '../SkeletonLoader.vue';
import Comment from '../comment/Comment.vue'

export default {
    name: 'Reviews',
    components: { SkeletonLoader, Comment },
    data() {
        return {
            reviews: [],
            loading: true,
            activeComments: {},
            expandedSynopsis: {},
            showUserName: false,
        };
    },
    methods: {
        toggleComment(reviewId) {
            if (this.activeComments.hasOwnProperty(reviewId)) {
                // Toggle state
                this.activeComments[reviewId] = !this.activeComments[reviewId];
            } else {
                // Add a new state
                this.activeComments[reviewId] = true;
            }
        },
        toggleSynopsis(reviewId) {
            if (this.expandedSynopsis.hasOwnProperty(reviewId)) {
                this.expandedSynopsis[reviewId] = !this.expandedSynopsis[reviewId];
            } else {
                this.expandedSynopsis[reviewId] = true;
            }
        },
    },
    async mounted() {
        try {
            this.reviews = await getAllReviews();
        } catch (error) {
            console.error('[Reviews.vue] Error fetching reviews: ', error);
        } finally {
            this.loading = false;
            // console.log('reviews', this.reviews);
        }
    }
};
</script>

<template>
    <section class="p-4">
        <h1 class="text-2xl font-bold mb-4">All Reviews</h1>

        <div v-if="loading">
            <!--  i have to change this -->
            <SkeletonLoader class="w-full h-20 rounded-lg mb-4" v-for="n in 2" :key="n" />
        </div>

        <div v-else-if="reviews.length === 0">
            <p>No reviews available.</p>
        </div>

        <ul v-else class="space-y-4">
            <li v-for="review in reviews" :key="review.id"
                class="p-4 flex items-start relative space-x-4  rounded-[20px] shadow-2xl ring-2 ring-black ring-opacity-10 max-w-[1000px] m-auto min-h-[300px]">

                <div class="flex-shrink-0 w-32 h-48 overflow-hidden rounded bg-gray-200">
                    <img v-if="review.coverURL" :src="review.coverURL" :alt="`Cover of ${review.title}`"
                        class="w-full h-full object-cover">
                    <p v-else class="text-gray-500 text-center h-full flex items-center justify-center">
                        No cover available
                    </p>
                </div>

                <div class="absolute top-0 right-0 bg-yellow-500 text-black font-bold text-xs uppercase px-4 py-1 filter rounded-bl-[50%_75%] rounded-tr-[20px] hover:rounded-bl-[20%_100%]">
                    <router-link @mouseenter="showUserName = true" @mouseleave="showUserName = false"
                        class="relative flex items-center justify-center h-6 w-6  bg-[grey] text-white overflow-hidden transition-[padding-left,width] duration-300 ease-in-out hover:w-[160px] pl-[5.5px] "
                        aria-label="See the creator's profile" to="/myProfile/edit/photo">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="h-4 w-4 stroke-[wheat] ">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.25 2.25 0 113.182 3.182l-9.068 9.068a4.5 4.5 0 01-2.121 1.061l-3.066.614.614-3.066a4.5 4.5 0 011.061-2.121l9.068-9.068z" />
                        </svg>

                        <span
                            v-bind:class="{ 'opacity-0 max-w-0': !showUserName, 'opacity-100 max-w-full transition-all duration-[1000ms] ease-in-out  whitespace-nowrap': showUserName }"
                            class="ml-2 overflow-hidden inline-block text-white">
                            UserName
                        </span>
                    </router-link>
                </div>

                <div class="flex-1">

                    <h2 class="text-xl font-semibold">{{ review.title }}</h2>
                    
                    <p class="text-sm text-gray-600 mb-2">Year: {{ review.year }}</p>
                    <p class="text-sm text-gray-600 mb-2">Type: {{ review.contentType }}</p>
                    <!-- <p class="text-gray-800">{{ review.synopsis }}</p> -->
                    <p class="text-white">
                        <span :class="{ 'line-clamp-3': !expandedSynopsis[review.id] }">
                            {{ review.synopsis }}
                        </span>
                    </p>

                    <button type="button" class="text-blue-500 hover:underline" @click="toggleSynopsis(review.id)">
                        {{ expandedSynopsis[review.id] ? 'Read less' : 'Read more' }}
                    </button>

                    <div class="flex flex-row justify-between">
                        <a v-if="review.trailer" :href="review.trailer"
                            class="text-[#f09224] hover:text-[wheat] mt-2 block bg-gray-800 hover:bg-gray-700 max-w-[150px] p-2 text-center rounded-md"
                            target="_blank">
                            Watch Trailer
                        </a>

                        <button type="button"
                            class="flex items-center justify-center w-10 h-10 mt-[7px] bg-red-gradient text-white rounded-full hover:bg-[#BC2B41] shadow-2xl ring-2 ring-black ring-opacity-10"
                            @click="toggleComment(review.id)">
                            <img src="/assets/icons/comment-icon.png" alt="Icon"
                                class="w-6 h-6 filter invert brightness-0">
                        </button>
                    </div>

                    <Comment v-if="activeComments[review.id]" :reviewId="review.id" />

                </div>
            </li>
        </ul>
    </section>
</template>
