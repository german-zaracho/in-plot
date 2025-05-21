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
            } catch (error) {
                console.error("Error deleting selected notifications:", error);
            }
        }
    }
};
</script>

<template>

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
            class="bg-white p-4 rounded shadow-md max-w-[500px] m-auto w-full">

            <input type="checkbox" class="" :value="notification.id"
                @change="toggleSelection(notification.id)" :checked="selectedNotifications.includes(notification.id)">

            <h2 class="font-semibold">{{ notification.title }}</h2>
            <div class="flex flex-row items-center gap-2">
                <img v-if="notification.senderPhotoURL" :src="notification.senderPhotoURL"
                    :alt="`Photo of ${notification.senderName}`" class="w-10 h-10 rounded-full object-cover" />
                <p class="text-gray-700">{{ notification.message }}</p>
            </div>

            <p class="text-sm text-gray-400">{{ notification.createdAt?.toDate?.().toLocaleString?.('default', {
                dateStyle: 'short', timeStyle: 'short'
            }) }}</p>

            <router-link v-if="notification.relatedDocId"
                :to="{ path: '/feed', query: { reviewId: notification.relatedDocId } }"
                class="inline-block mt-2 bg-[#f1c421] hover:bg-[#fadc5a] text-[#272120] font-medium py-1 px-3 rounded transition">
                See review
            </router-link>
        </div>

    </div>

</template>