<script>
// import Comment from '../components/comment/Comment.vue';
import Reviews from '../components/reviews/Reviews.vue';
import { subscribeToAuth } from '../services/auth';

export default {
    name:'Feed',
    components:{ Reviews },
    data() {
        return {
            userId: null,
        };
    },
    mounted() {

        this.unsubscribeAuth = subscribeToAuth(userData => {
            this.userId = userData.id;
        });
        // console.log('userid', this.userId);

    },
    beforeDestroy() {

        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
        }

    },
}
</script>

<template>
    <!-- <h1>Media reviews</h1> -->
    <!-- <Comment /> -->
    <router-link class="mb-4 text-[#f09224] hover:text-[wheat]  rounded-lg bg-gray-800 hover:bg-gray-700 py-2 px-4" to="/newReview">Create a new review</router-link>
    <Reviews v-if="userId" :userId="userId" />
</template>