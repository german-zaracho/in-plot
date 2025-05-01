<script>
import Reviews from '../components/reviews/Reviews.vue';
import { subscribeToAuth } from '../services/auth';

export default {
    name:'Feed',
    components:{ Reviews },
    data() {
        return {
            userId: null,
            userRole: null,
            feedback: {
                message: null,
            }
        };
    },
    mounted() {

        this.unsubscribeAuth = subscribeToAuth(userData => {
            this.userId = userData.id;
            this.userRole = userData.role;
        });
        if (this.$route?.query?.reviewState === 'reviewCreated') {
            this.feedback.message = '¡Review created successfully!';
            // console.log('Profile edited successfully!', this.feedback.message);
        } else if (this.$route?.query?.reviewState === 'reviewDeleted') {
            this.feedback.message = '¡Review deleted successfully!';
        }
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
    <div v-if="feedback.message" class="p-4 mb-4 bg-green-200 rounded">
        {{ feedback.message }}
    </div>
    <Reviews v-if="userId" :userId="userId" :userRole="userRole" />
</template>