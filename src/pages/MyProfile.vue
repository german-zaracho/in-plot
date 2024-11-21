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
    <div class="flex items-end gap-4">
        <h1>My Profile</h1>
        <router-link class="mb-4 text-blue-700 underline" to="/myProfile/edit">Edit</router-link>
    </div>

    <ProfileData :loading="!loggedUser.fullProfileLoaded" :user="loggedUser" />

</template>