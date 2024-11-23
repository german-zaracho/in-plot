<script>
import Comment from '../components/comment/Comment.vue';
import Reviews from '../components/reviews/Reviews.vue';

export default {
    name:'Feed',
    components:{ Comment, Reviews },
}
</script>

<template>
    <h1>Media reviews</h1>

    <Comment />
    <router-link class="mb-4 text-[#f09224] hover:text-[wheat]" to="/newReview">Create a new review</router-link>
    <Reviews />
</template>