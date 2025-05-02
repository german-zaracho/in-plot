<script>
import { subscribeToAuth } from '../services/auth';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import ProfileData from '../components/profile/ProfileData.vue';

let unsubscribeFromAuth = () => { };

export default {
    name: 'MyProfile',
    components: { SkeletonLoader, ProfileData },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                favMovie: null,
                favSeries: null,
                anAdditionalComment: null,
                photoURL: null,
                fullProfileLoaded: false,
                role: null,
            },
            feedback: {
                message: null,
            }
        }
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuth(newUserData => this.loggedUser = newUserData);
        // console.log('User profile');

        if (this.$route?.query?.profileEdited === 'profileEdited') {
            this.feedback.message = '¡Profile edited successfully!';
            // console.log('Profile edited successfully!', this.feedback.message);
        } else if (this.$route?.query?.profileEdited === 'profilePhotoEdited') {
            this.feedback.message = '¡Profile Photo edited successfully!';
        } else if (this.$route?.query?.profileEdited === 'myReviewEdited') {
            this.feedback.message = '¡Review edited successfully!';
        } else if (this.$route?.query?.userState === 'registered') {
            this.feedback.message = '¡Welcome to inPlot! Your account has been created successfully.!';
        } else if (this.$route?.query?.userState === 'logged') {
            this.feedback.message = "Hello again! It's great to have you here.";
        } 
    },
    unmounted() {
        unsubscribeFromAuth();
    },
}
</script>

<template>
    <div v-if="feedback.message" class="p-4 mb-4 bg-green-200 rounded">
        {{ feedback.message }}
    </div>
    <div class="flex gap-4 justify-between">
        <h1 class="text-2xl font-bold text-white">My Profile</h1>
        <router-link
            class="mb-4 border-[2px] border-[#BC2B41] rounded-lg p-[5px] bg-[#272120] hover:bg-[#3c2f2d] text-[#f1c421] hover:text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]"
            to="/myProfile/edit">Edit my profile</router-link>
    </div>

    <ProfileData :loading="!loggedUser.fullProfileLoaded" :user="loggedUser" :isMyProfile="true"
        :loggedUser="loggedUser" />

</template>