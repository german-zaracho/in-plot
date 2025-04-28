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
                role:null,
            }
        }
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuth(newUserData => this.loggedUser = newUserData);
    },
    unmounted() {
        unsubscribeFromAuth();
    },
}
</script>

<template>
    <div class="flex gap-4 justify-between">
        <h1 class="text-2xl font-bold text-white">My Profile</h1>
        <router-link class="mb-4 border-[2px] border-[#BC2B41] rounded-lg p-[5px] bg-[#272120] hover:bg-[#3c2f2d] text-[#f1c421] hover:text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421]" to="/myProfile/edit">Edit my profile</router-link>
    </div>

    <ProfileData :loading="!loggedUser.fullProfileLoaded" :user="loggedUser" :isMyProfile="true" :loggedUser="loggedUser"/>

</template>