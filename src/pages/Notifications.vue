<script>
import { getUserNotifications, deleteMultipleNotifications } from '../services/notifications';
import { subscribeToAuth } from '../services/auth';

let unsubscribeFromAuth = () => { };

export default {
    name: 'Notifications',
    data() {
        return {
            notifications: [],
            loading: true,
            userId: null,
            selectedNotifications: [],
            feedback: {
                message: null,
            },
            expandedNotifications: [],
        };
    },
    async mounted() {
        unsubscribeFromAuth = subscribeToAuth(async (userData) => {

            if (userData?.id) {
                this.userId = userData.id;
                await this.fetchNotifications();
            }

        });
    },
    unmounted() {
        unsubscribeFromAuth();
    },
    methods: {
        async fetchNotifications() {

            this.loading = true;

            try {
                this.notifications = await getUserNotifications(this.userId);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                this.loading = false;
            }

        },
        toggleSelection(notificationId) {

            const index = this.selectedNotifications.indexOf(notificationId);

            if (index === -1) {
                this.selectedNotifications.push(notificationId);
            } else {
                this.selectedNotifications.splice(index, 1);
            }

        },
        async deleteSelectedNotifications() {

            if (this.selectedNotifications.length === 0) return;

            try {
                await deleteMultipleNotifications(this.selectedNotifications);
                this.notifications = this.notifications.filter(
                    n => !this.selectedNotifications.includes(n.id)
                );
                this.selectedNotifications = [];
                this.feedback.message = '¡Notifications deleted successfully!';
            } catch (error) {
                console.error("Error deleting selected notifications:", error);
            }

        },
        toggleDetails(notificationId) {

            const index = this.expandedNotifications.indexOf(notificationId);

            if (index === -1) {
                this.expandedNotifications.push(notificationId);
            } else {
                this.expandedNotifications.splice(index, 1);
            }
            
        },
    }
};
</script>

<template>

    <div v-if="feedback.message" class="p-4 mb-4 bg-red-200 rounded">
        {{ feedback.message }}
    </div>

    <h1 class="mb-[20px] font-bold text-center text-white">Notifications</h1>

    <div v-if="loading" class="text-white text-center">Loading notifications...</div>

    <div v-else-if="notifications.length === 0" class="flex flex-col items-center">
        <p class="text-white">No notifications available.</p>
    </div>

    <div v-else class="flex flex-col gap-4">

        <div v-if="notifications.length > 0" class="text-center mb-4">
            <button @click="deleteSelectedNotifications" :disabled="selectedNotifications.length === 0"
                class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded disabled:opacity-50">
                Delete selected
            </button>
        </div>

        <div v-for="notification in notifications" :key="notification.id"
            class="w-full p-4 mb-[20px] flex flex-col items-start justify-center relative rounded-[20px] shadow-2xl ring-2 ring-black ring-opacity-10 max-w-[1000px] m-auto bg-dark-gradient xs:items-center xs:p-[20px] xs:rounded-[10px]">


            <div class="flex flex-row xxxs:flex-col items-center justify-between w-full">
                <div class="flex items-center gap-2">
                    <input type="checkbox" class="" :value="notification.id" @change="toggleSelection(notification.id)"
                        :checked="selectedNotifications.includes(notification.id)">
                    <h2 class="font-semibold text-white">{{ notification.title }}</h2>
                </div>

                <button @click="toggleDetails(notification.id)"
                    class="text-[#272120] hover:text-[#3c2f2d] mt-2 block bg-[#f1c421] hover:bg-[wheat] max-w-[150px] p-2 text-center rounded-md focus:text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:bg-[#3c2f2d] font-semibold">
                    {{ expandedNotifications.includes(notification.id) ? 'Show less' : 'Show more' }}
                </button>
            </div>

            <div v-if="expandedNotifications.includes(notification.id)"
                class="flex flex-col gap-2 content-notification my-[10px] w-full">

                <div class="flex flex-col gap-2 ">
                    <div class="flex flex-row items-center gap-2">
                        <img v-if="notification.senderPhotoURL" :src="notification.senderPhotoURL"
                            :alt="`Photo of ${notification.senderName}`" class="w-10 h-10 rounded-full object-cover" />
                        <p class="text-white">{{ notification.message }}</p>
                    </div>

                    <p class="text-sm text-white self-end">{{
                        notification.createdAt?.toDate?.().toLocaleString?.('default', {
                            dateStyle: 'short', timeStyle: 'short'
                        }) }}</p>
                </div>


                <router-link v-if="notification.relatedDocId"
                    :to="{ path: '/feed', query: { reviewId: notification.relatedDocId } }"
                    class="font-semibold text-[#272120] hover:text-[#3c2f2d] mt-2 block bg-[#f1c421] hover:bg-[wheat] max-w-[150px] p-2 text-center rounded-md focus:text-[#f1c421] focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:bg-[#3c2f2d] self-center">
                    See review
                </router-link>
            </div>

        </div>

    </div>

</template>