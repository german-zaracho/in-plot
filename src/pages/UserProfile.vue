<script>
import ProfileData from '../components/profile/ProfileData.vue';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { SkeletonLoader, ProfileData },
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
    <h1>Profile of {{ user.email }}</h1>

    <ProfileData :loading="loading" :user="user" :isMyProfile="false"/>


    <hr class="mb-4">

    <router-link class="text-blue-700 underline" :to="`/users/${user.id}/chat`">Start Private Conversation with {{ user.email }}</router-link>
</template>