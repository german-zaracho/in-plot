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
        <h1 class="text-2xl font-bold">My Profile</h1>
        <router-link class="mb-4 border-[2px] border-[#BC2B41] rounded-lg p-[5px] bg-gray-800 hover:bg-gray-700 text-white" to="/myProfile/edit">Edit my profile</router-link>
    </div>

    <ProfileData :loading="!loggedUser.fullProfileLoaded" :user="loggedUser" :isMyProfile="true" />

</template>