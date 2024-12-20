<script>
import { getAllReviews } from '../../services/media-reviews';
import SkeletonReview from '../SkeletonReview.vue';
import Comment from '../comment/Comment.vue';
import VueSkeletonLoader from 'vue3-skeleton-loader';
import SkeletonReviews from '../SkeletonReviews.vue';
import 'vue3-skeleton-loader/dist/style.css';

export default {
    name: 'Reviews',
    props: {
        userId: { type: String, required: true },
    },
    components: { SkeletonReview, Comment, VueSkeletonLoader, SkeletonReviews },
    data() {
        return {
            reviews: [],
            loading: true,
            activeComments: {},
            expandedSynopsis: {},
            showUserName: {},
        };
    },
    methods: {
        /**
         * 
         * @param {Date|null} date 
         * @returns {string} - "DD/MM/AAAA HH:mm" otherwise null.
         */
        formatDate(date) {
            // console.log('date', date);
            if (!date) return null;

            const localDate = new Date(date.seconds * 1000);  // Convert seconds to milliseconds
            localDate.setHours(localDate.getHours() - 3);  // Sets the time for the UTC-3 (Argentina) time zone

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            return formatter.format(localDate).replace(',', '');

        },
        toggleUserName(reviewId, state) {

            this.showUserName[reviewId] = state;

        },
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

        // console.log('User ID', this.userId);

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

        <div v-if="loading" >
            <SkeletonReviews />
        </div>

        <div v-else-if="reviews.length === 0">
            <p>No reviews available.</p>
        </div>

        <ul v-else class="">
            <li v-for="review in reviews" :key="review.id"
                class="p-4 mb-[20px] flex flex-col items-start relative rounded-[20px] shadow-2xl ring-2 ring-black ring-opacity-10 max-w-[1000px] m-auto min-h-[300px]">

                <div class="flex flex-row">

                    <div class="flex-shrink-0 w-32 h-48 overflow-hidden rounded bg-gray-200 mr-[20px]">
                        <img v-if="review.coverURL" :src="review.coverURL" :alt="`Cover of ${review.title}`"
                            class="w-full h-full object-cover">
                        <p v-else class="text-gray-500 text-center h-full flex items-center justify-center">
                            No cover available
                        </p>
                    </div>

                    <div
                        class="absolute top-0 right-0 bg-yellow-500 text-black font-bold text-xs uppercase  filter rounded-bl-[50%_75%] rounded-tr-[20px] hover:rounded-bl-[20%_100%]">
                        <router-link @mouseenter="toggleUserName(review.id, true)"
                            @mouseleave="toggleUserName(review.id, false)"
                            class="relative flex items-center justify-center h-6 w-6 min-w-[60px] min-h-[30px] bg-yellow-500 text-white overflow-hidden transition-[padding-left,width, padding-right] duration-300 ease-in-out hover:w-[180px] pl-[8px] pr-[8px] rounded-bl-[50%_75%] rounded-tr-[20px] hover:rounded-bl-[20%_100%]"
                            aria-label="See the creator's profile"
                            :to="review.user_id === userId ? '/myProfile' : `/users/${review.user_id}`">
                            <span class="material-symbols-rounded m-2">person</span>

                            <span :class="{
                                'opacity-0 max-w-0': !showUserName[review.id],
                                'opacity-100 max-w-full transition-all duration-[1000ms] ease-in-out whitespace-nowrap': showUserName[review.id]
                            }" class="ml-2 overflow-hidden inline-block text-white">
                                {{ review.displayName }}
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
                                <span class="material-symbols-rounded">chat</span>
                            </button>
                        </div>
                        <div class="text-end p-2"><span class="text-white">Published:</span> {{
                            formatDate(review.created_at) }}</div>

                    </div>

                </div>

                <Comment v-if="activeComments[review.id]" :reviewId="review.id" />

            </li>
        </ul>

    </section>
</template>
