<script>
import { subscribeToAuth } from '../services/auth';

export default {
    name: 'MyProfile',
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                favMovie: null,
                favSeries: null,
                anAdditionalComment: null,
            }
        }
    },
    mounted() {
        subscribeToAuth(newUserData => this.loggedUser = newUserData);
    }
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
        <dd class="mb-3">{{ loggedUser.displayName || 'Not specified' }}</dd>
        <dt class="font-bold">Movie</dt>
        <dd class="mb-3">{{ loggedUser.favMovie || 'Not specified' }}</dd>
        <dt class="font-bold">Series</dt>
        <dd class="mb-3">{{ loggedUser.favSeries || 'Not specified' }}</dd>
        <dd class="mb-3">{{ loggedUser.anAdditionalComment || 'Not specified' }}</dd>
    </dl>
</template>