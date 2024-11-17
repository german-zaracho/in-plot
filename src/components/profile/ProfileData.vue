<script>
import SkeletonLoader from '../SkeletonLoader.vue';

export default {
    name: 'ProfileData',
    components: { SkeletonLoader },
    props: {
        loading: { type: Boolean, default: false, },
        user: { type: Object, required: true, }
    }
}
</script>

<template>

    <div>
        <img :src="user.photoURL || '/assets/imgs/no-image.jpg'" alt="">
    </div>

    <dl>
        <dt class="font-bold">Email</dt>
        <dd class="mb-3">{{ user.email }}</dd>
        <dt class="font-bold">User name</dt>
        <dd class="mb-3">
            <span v-if="!loading">{{ user.displayName || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
        <dt class="font-bold">Movie</dt>
        <dd class="mb-3">
            <span v-if="!loading">{{ user.favMovie || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
        <dt class="font-bold">Series</dt>
        <dd class="mb-3">
            <span v-if="!loading">{{ user.favSeries || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
        <dt class="font-bold">Additional Comments</dt>
        <dd class="mb-3">
            <span v-if="!loading">{{ user.anAdditionalComment || 'Not specified' }}</span>
            <SkeletonLoader class="w-96 h-5" v-else />
        </dd>
    </dl>

</template>