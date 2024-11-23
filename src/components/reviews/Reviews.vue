<script>
import { getAllReviews } from '../../services/media-reviews';
import SkeletonLoader from '../SkeletonLoader.vue';

export default {
    name: 'Reviews',
    components: { SkeletonLoader },
    data() {
        return {
            reviews: [],
            loading: true,
        };
    },
    async mounted() {
        try {
            this.reviews = await getAllReviews();
        } catch (error) {
            console.error('[Reviews.vue] Error fetching reviews: ', error);
        } finally {
            this.loading = false;
            console.log('reviews', this.reviews);
        }
    }
};
</script>

<template>
    <section class="p-4">
        <h1 class="text-2xl font-bold mb-4">All Reviews</h1>

        <div v-if="loading">
            <SkeletonLoader class="w-full h-20 rounded-lg mb-4" v-for="n in 5" :key="n" />
        </div>

        <div v-else-if="reviews.length === 0">
            <p>No reviews available.</p>
        </div>

        <ul v-else class="space-y-4">
            <li v-for="review in reviews" :key="review.id" class="p-4 flex items-start space-x-4  rounded-[20px] shadow-2xl ring-2 ring-black ring-opacity-10 max-w-[1000px] m-auto min-h-[300px]">
                <!-- Cover Image -->
                <div class="flex-shrink-0 w-32 h-48 overflow-hidden rounded bg-gray-200">
                    <img v-if="review.coverURL" :src="review.coverURL" :alt="`Cover of ${review.title}`"
                        class="w-full h-full object-cover">
                    <p v-else class="text-gray-500 text-center h-full flex items-center justify-center">
                        No cover available
                    </p>
                </div>

                <!-- Review Details -->
                <div class="flex-1">
                    <h2 class="text-xl font-semibold">{{ review.title }}</h2>
                    <p class="text-sm text-gray-600 mb-2">Year: {{ review.year }}</p>
                    <p class="text-sm text-gray-600 mb-2">Type: {{ review.contentType }}</p>
                    <p class="text-gray-800">{{ review.synopsis }}</p>
                    <a v-if="review.trailer" :href="review.trailer"
                        class="text-[#f09224] hover:text-[wheat] mt-2 block bg-gray-800 hover:bg-gray-700 max-w-[150px] p-2 text-center rounded-md"
                        target="_blank">
                        Watch Trailer
                    </a>
                </div>
            </li>
        </ul>
    </section>
</template>
