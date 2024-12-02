<script>
import ProfileData from '../components/profile/ProfileData.vue';
import { getUserProfileById } from '../services/user-profile';

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
            },
            loading: true,
        }
    },
    async mounted() {

        this.user = await getUserProfileById(this.$route.params.id);
        this.loading = false;

    }
}
</script>

<template>
    <h1 class="mb-[20px] font-bold text-center" >Profile of {{ user.email }}</h1>

    <ProfileData :loading="loading" :user="user" :isMyProfile="false"/>
    
</template>