<script>
import SkeletonLoader from '../SkeletonLoader.vue';
import UserReviews from '../reviews/UserReviews.vue';

export default {
    name: 'ProfileData',
    components: { SkeletonLoader, UserReviews },
    props: {
        loading: { type: Boolean, default: false, },
        user: { type: Object, required: true, },
        isMyProfile: { type: Boolean, required: true },
        loggedUser: { type: Object, required: false, },
    },
    data() {
        return {
            showTooltip: false,
        };
    },
    // created() {
    //     console.log('[UserReviews.vue] loggedUser:', this.loggedUser);
    // },
}
</script>
<template>

    <div class="flex flex-col sm:flex-row m-auto">

        <div class="flex gap-4  flex-col max-width-[250px] items-center">

            <div class="relative flex items-center justify-center ">
                <div
                    class="w-[200px] h-[200px] rounded-full overflow-hidden bg-gray-200 shadow-2xl ring-2 ring-black ring-opacity-10 m-auto">
                    <img :src="user.photoURL || './assets/imgs/profile-image.png'" alt="Profile image"
                        class="h-full w-full object-cover ">
                </div>

                <div v-if="isMyProfile"
                    class="absolute bottom-0 right-0 flex items-center justify-center border-[2px] border-[#BC2B41] rounded-[20px]  ">
                    <router-link @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"
                        class="relative flex items-center justify-center h-8 w-8 rounded-full bg-[#272120] hover:bg-[#3c2f2d] text-white overflow-hidden transition-[padding-left,width] duration-300 ease-in-out hover:w-[160px] pl-[5.5px] hover:pl-[0px] focus:outline-none focus:ring-2 focus:ring-[#f1c421]"
                        aria-label="Edit my photo" to="/myProfile/edit/photo">

                        <span class="material-symbols-rounded text-[#f1c421]">edit</span>

                        <span
                            v-bind:class="{ 'opacity-0 max-w-0': !showTooltip, 'opacity-100 max-w-full transition-all duration-[1000ms] ease-in-out  whitespace-nowrap': showTooltip }"
                            class="ml-2 overflow-hidden inline-block text-[#f1c421]">
                            Edit my photo
                        </span>
                    </router-link>

                </div>

            </div>

            <div class=" rounded-[20px] shadow-2xl ring-2 ring-black ring-opacity-10 max-w-[300px] bg-dark-gradient">
                <dl class="p-5">
                    <dt class="font-bold text-[#f1c421]">Email</dt>
                    <dd class="mb-3 text-white">{{ user.email }}</dd>
                    <dt class="font-bold text-[#f1c421]">User name</dt>
                    <dd class="mb-3 text-white">
                        <span v-if="!loading">{{ user.displayName || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-6 rounded-lg" v-else />
                    </dd>
                    <dt class="font-bold text-[#f1c421]">Movie</dt>
                    <dd class="mb-3 text-white">
                        <span v-if="!loading">{{ user.favMovie || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-6 rounded-lg" v-else />
                    </dd>
                    <dt class="font-bold text-[#f1c421]">Series</dt>
                    <dd class="mb-3 text-white">
                        <span v-if="!loading">{{ user.favSeries || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-6 rounded-lg" v-else />
                    </dd>
                    <dt class="font-bold text-[#f1c421]">Additional Comments</dt>
                    <dd class="mb-3 text-white">
                        <span v-if="!loading">{{ user.anAdditionalComment || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-5 rounded-lg" v-else />
                    </dd>
                </dl>
            </div>

        </div>

        <div class="w-full">
            
            <UserReviews v-if="user.id" :userId="user.id" :isMyProfile="isMyProfile" :userRole="loggedUser.role" />
        </div>
    </div>

</template>
<style>
.material-symbols-rounded {
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}
</style>
