<script>
import { subscribeToAuth } from '../services/auth';
import { savePrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chat';
import { getUserProfileById } from '../services/user-profile';

let unsubscribeFromAuth = () => { }
let unsubscribeFromChat = () => { }

export default {
    name: 'PrivateChat',
    data() {
        return {
            user: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                favMovie: null,
                favSeries: null,
                anAdditionalComment: null,
            },
            userLoading: false,

            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                favMovie: null,
                favSeries: null,
                anAdditionalComment: null,
            },

            messages: [],
            messagesLoading: false,

            newMessage: {
                text: ''
            },
        }
    },
    methods: {
        async handleSubmit() {
            try {
                savePrivateChatMessage(
                    this.loggedUser.id,
                    this.user.id,
                    this.newMessage.text,
                );
                this.newMessage.text = '';
            } catch (error) {
                // check this later
            }
        },
        /**
         * 
         * @param {Date|null} date 
         * @returns {string} - The date in "DD/MM/YYYY HH:mm" format if passed a Date object, null otherwise.
         */
        formatDate(date) {
            if (!date) return null;

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            return formatter.format(date).replace(',', '');
        },
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuth(newUserData => this.loggedUser = newUserData);

        this.userLoading = true;
        getUserProfileById(this.$route.params.id)
            .then(userProfile => {
                this.user = userProfile;
                this.userLoading = false;
            });

        this.messagesLoading = true;
        subscribeToPrivateChatMessages(
            this.loggedUser.id,
            this.$route.params.id,
            newMessages => {
                this.messagesLoading = false;
                this.messages = newMessages;
            }
        ).then(unsubscribe => unsubscribeFromAuth = unsubscribe);

    },
    unmounted() {
        unsubscribeFromAuth();
        unsubscribeFromChat();
    }
}
</script>

<template>
    <h1>Private conversation with {{ user.email }}</h1>

    <div class="min-h-[400px] p-4 mb-4 border rounded">
        <ul class="flex flex-col items-start gap-4">
            <li v-for="message in messages" :key="message.id" class="p-4 rounded" :class="{'bg-gray-200': message.user_id !== loggedUser.id, 'bg-green-200': message.user_id === loggedUser.id, 'self-end': message.user_id === loggedUser.id,}">
                <div>{{ message.text }}</div>
                <div class="text-sm text-gray-700">{{ formatDate(message.created_at) || "Sending..." }}</div>
            </li>
        </ul>
    </div>

    <form action="#" class="flex gap-4 items-stretch" @submit.prevent="handleSubmit">
        <label class="sr-only" for="text">Message</label>
        <textarea id="text" class="w-full min-h-20 p-2 border rounded" v-model="newMessage.text"></textarea>
        <button type="submit" class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">Send</button>
    </form>
</template>