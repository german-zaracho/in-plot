<script>
import ProfileData from '../components/profile/ProfileData.vue';
import { getUserProfileById } from '../services/user-profile';
import { subscribeToAuth } from '../services/auth';

let unsubscribeFromAuth = () => { };

export default {
    name: 'UserProfile',
    components: { ProfileData },
    data() {
        return {
            user: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                favMovie: null,
                favSeries: null,
                anAdditionalComment: null,
                role:null,
            },
            loading: true,
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
    async mounted() {
        unsubscribeFromAuth = subscribeToAuth(newUserData => this.loggedUser = newUserData);

        this.user = await getUserProfileById(this.$route.params.id);
        this.loading = false;
        
    },
    unmounted() {
        unsubscribeFromAuth();
    },
}
</script>

<template>
    <h1 class="mb-[20px] font-bold text-center text-white" >Profile of {{ user.displayName ? user.displayName : user.email }}</h1>

    <ProfileData :loading="loading" :user="user" :isMyProfile="false" :loggedUser="loggedUser" />
    
</template>