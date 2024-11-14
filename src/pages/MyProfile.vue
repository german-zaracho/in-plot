<script>
import { subscribeToAuth } from '../services/auth';
import SkeletonLoader from '../components/SkeletonLoader.vue';

let unsubscribeFromAuth = () => {};

export default {
    name: 'MyProfile',
    components: { SkeletonLoader, },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                favMovie: null,
                favSeries: null,
                anAdditionalComment: null,
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

    <dl>
        <dt class="font-bold">Email</dt>
        <dd class="mb-3">{{ loggedUser.email }}</dd>
        <dt class="font-bold">User name</dt>
        <dd class="mb-3">
            <span v-if="loggedUser.fullProfileLoaded">{{ loggedUser.displayName || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
        <dt class="font-bold">Movie</dt>
        <dd class="mb-3">
            <span v-if="loggedUser.fullProfileLoaded">{{ loggedUser.favMovie || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
        <dt class="font-bold">Series</dt>
        <dd class="mb-3">
            <span v-if="loggedUser.fullProfileLoaded">{{ loggedUser.favSeries || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
        <dt class="font-bold">Additional Comments</dt>
        <dd class="mb-3">
            <span v-if="loggedUser.fullProfileLoaded">{{ loggedUser.anAdditionalComment || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
    </dl>
</template>