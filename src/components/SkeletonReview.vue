<script>
export default {
    name: 'SkeletonReview',
}
</script>

<template>
    <span class="skeleton-review-box"></span>
</template>

<style>
.skeleton-review-box {
    display: inline-block;
    height: 270px;
    position: relative;
    overflow: hidden;
    background-color: #DDDBDD;
    max-width: 1000px;
} 

.skeleton-review-box::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
    animation: shimmer 5s infinite;
    content: '';
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>