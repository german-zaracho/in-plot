<script>
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
    <Reviews v-if="userId" :userId="userId" />
</template>