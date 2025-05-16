<script>
export default {
    name: 'Notifications',
    data() {
        return {
            notifications: [],
            loading: true,
        };
    },
    // mounted() {
    //     // Simulate fetching notifications
    //     setTimeout(() => {
    //         this.notifications = [];
    //         this.loading = false;
    //     }, 1000);
    // },
};
</script>
<template>
    <h1 class="mb-[20px] font-bold text-center text-white">Notifications</h1>
    <div class="flex flex-col items-center">
        <p class="text-white">No notifications available.</p>
    </div>
</template>