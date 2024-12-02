<script>
import { subscribeToAuth } from "../../services/auth";

export default {
    name: 'CommentList',
    props: {
        theComments: { type: Array, required: true, }
    },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
            },
        };
    },
    methods: {
        /**
         * 
         * @param {Date|null} date 
         * @returns {string} - "DD/MM/AAAA HH:mm" otherwise null.
         */
        formatDate(date) {
            if (!date) return null;

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            return formatter.format(date).replace(',', '');
        }
    },
    mounted() {
        this.unsubscribeFromAuth = subscribeToAuth((userData) => {
            this.loggedUser = userData;
        });
    },
    unmounted() {
        if (this.unsubscribeFromAuth) {
            this.unsubscribeFromAuth();
        }
    },
}

</script>

<template>

    <h2 class="sr-only">Comments</h2>

    <div class="shadow-2xl ring-2 ring-black ring-opacity-10 rounded-[20px] p-4 mt-[20px]">

        <p v-if="theComments.length === 0">No comments yet.</p>

        <ul v-else class="flex flex-col items-start gap-4 max-h-[300px] overflow-y-auto">
            <li v-for="comment in theComments" :key="comment.id" :class="{'self-end bg-green-200': comment.user_id === loggedUser.id,
        'bg-gray-200': comment.user_id !== loggedUser.id, 'w-[300px]': true,
    'w-[80%] sm:w-[300px]': true}" class="mb-3 rounded-[20px] p-[10px]">

                <div>
                    <router-link :to="`/users/${comment.user_id}`" class="text-blue-700 font-bold">{{
                        comment.displayName || comment.email }}</router-link>
                    wrote:
                </div>

                <div>{{ comment.text }}</div>
                <div class="text-sm text-gray-700">{{ formatDate(comment.created_at) || "Sending..." }}</div>

            </li>
        </ul>

    </div>

</template>