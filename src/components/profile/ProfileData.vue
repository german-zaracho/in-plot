<script>
import SkeletonLoader from '../SkeletonLoader.vue';

export default {
    name: 'ProfileData',
    components: { SkeletonLoader },
    props: {
        loading: { type: Boolean, default: false, },
        user: { type: Object, required: true, }
    },
    data() {
        return {
            showTooltip: false,
        };
    },
}
</script>

<template>

    <div class="flex flex-row">

        <div class="flex gap-4  flex-col max-width-[250px]">

            <div class="relative flex items-center justify-center ">
                <div
                    class="w-full h-full rounded-full overflow-hidden bg-gray-200 max-w-[250px] max-h-[250px] shadow-2xl ring-2 ring-black ring-opacity-10 m-auto">
                    <img :src="user.photoURL || '/assets/imgs/no-image.jpg'" alt="Profile image"
                        class="h-full w-full object-cover">
                </div>

                <div
                    class="absolute bottom-0 right-0 flex items-center justify-center border-[2px] border-[#BC2B41] rounded-[20px]  ">
                    <router-link @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"
                        class="relative flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700 text-white overflow-hidden transition-[padding-left,width] duration-300 ease-in-out hover:w-[160px] pl-[5.5px] hover:pl-[0px]"
                        aria-label="Edit my photo" to="/myProfile/edit/photo">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="h-4 w-4 stroke-[wheat] ">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.25 2.25 0 113.182 3.182l-9.068 9.068a4.5 4.5 0 01-2.121 1.061l-3.066.614.614-3.066a4.5 4.5 0 011.061-2.121l9.068-9.068z" />
                        </svg>

                        <span
                            v-bind:class="{ 'opacity-0 max-w-0': !showTooltip, 'opacity-100 max-w-full transition-all duration-[1000ms] ease-in-out  whitespace-nowrap': showTooltip }"
                            class="ml-2 overflow-hidden inline-block text-[wheat]">
                            Edit my photo
                        </span>
                    </router-link>

                </div>


            </div>

            <div class="flex-1  rounded-[20px] shadow-2xl ring-2 ring-black ring-opacity-10 max-w-[300px]">
                <dl class="p-5">
                    <dt class="font-bold">Email</dt>
                    <dd class="mb-3 text-[wheat]">{{ user.email }}</dd>
                    <dt class="font-bold">User name</dt>
                    <dd class="mb-3 text-[wheat]">
                        <span v-if="!loading">{{ user.displayName || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-6 rounded-lg" v-else />
                    </dd>
                    <dt class="font-bold">Movie</dt>
                    <dd class="mb-3 text-[wheat]">
                        <span v-if="!loading">{{ user.favMovie || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-6 rounded-lg" v-else />
                    </dd>
                    <dt class="font-bold">Series</dt>
                    <dd class="mb-3 text-[wheat]">
                        <span v-if="!loading">{{ user.favSeries || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-6 rounded-lg" v-else />
                    </dd>
                    <dt class="font-bold">Additional Comments</dt>
                    <dd class="mb-3 text-[wheat]">
                        <span v-if="!loading">{{ user.anAdditionalComment || 'Not specified' }}</span>
                        <SkeletonLoader class="w-60 h-5 rounded-lg" v-else />
                    </dd>
                </dl>
            </div>

        </div>

        <div>
            <h2>[My Media Reviews]</h2>
        </div>
    </div>



</template>