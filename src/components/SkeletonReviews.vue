<script>

import VueSkeletonLoader from 'vue3-skeleton-loader';
import 'vue3-skeleton-loader/dist/style.css';

export default {
    name: 'SkeletonReviews',
    components: {
        VueSkeletonLoader,
    },
}
</script>

<template>
    <div class="flex flex-row bg-[white] rounded-lg max-w-[960px] h-[285px] mx-auto mb-4" v-for="n in 3" :key="n">
        <div class="m-[20px] ">
            <VueSkeletonLoader type="image" animation="wave" width="128px" height="192px" />
            <VueSkeletonLoader type="text" width="128px" height="40px" animation="wave" />
        </div>
        <div class="mt-[20px] ">
            <VueSkeletonLoader type="text" width="100px" height="20px" animation="wave" class="pb-[5px]" />
            <div class="flex row justify-between">
                <VueSkeletonLoader type="text" width="85px" height="15px" animation="wave" class="pb-[5px]" />
                <VueSkeletonLoader type="text" width="85px" height="15px" animation="wave" class="pb-[5px]" />
            </div>
            <VueSkeletonLoader type="text" width="750px" height="80px" animation="wave" class="pb-[5px]" />
            <div class="flex flex-row justify-between">
                <VueSkeletonLoader type="text" width="120px" height="40px" animation="wave" />
                <VueSkeletonLoader type="avatar" />
            </div>
            <VueSkeletonLoader type="text" width="85px" height="15px" animation="wave" class="pb-[5px]" />
        </div>
    </div>
</template>