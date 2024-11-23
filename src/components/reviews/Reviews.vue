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
            <li v-for="review in reviews" :key="review.id" class="border p-4 rounded shadow">
                <h2 class="text-xl font-semibold">{{ review.title }}</h2>
                <p class="text-sm text-gray-600 mb-2">Year: {{ review.year }}</p>
                <p class="text-gray-800">{{ review.synopsis }}</p>
                <a :href="review.trailer" class="text-blue-500 underline mt-2 block" target="_blank">Watch Trailer</a>
            </li>
        </ul>
    </section>
</template>

<style scoped>
/* Agrega estilos adicionales si es necesario */
</style>
