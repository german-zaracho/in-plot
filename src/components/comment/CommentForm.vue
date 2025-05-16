<script>
import { subscribeToAuth } from '../../services/auth';
import { createNotification } from '../../services/notifications';
import Loader from '../Loader.vue';

let unsubscribeFromAuth = () => { };

export default {
    name: 'CommentForm',
    components: { Loader },
    emits: ['newComment'],
    props: {
        reviewId: {
            type: String,
            required: true
        },
        reviewUserId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                favMovie: null,
                favSeries: null,
                anAdditionalComment: null,
            },
            commenting: false,
            newComment: {
                text: '',
            },
        }
    },
    methods: {
        async handleSubmit() {
            this.commenting = true;
            // We check if the text field is empty, if so we return.
            if (!this.newComment.text.trim()) {
                this.commenting = false;
                return;
            };
            // We emit the "new-comment" event, sending the form data.
            this.$emit('newComment', {
                user_id: this.loggedUser.id,
                email: this.loggedUser.email,
                text: this.newComment.text,
            });
            // Call the notification service
            try {
                await createNotification({
                    userId: this.reviewUserId, // The owner of the original comment (who will receive the notification)
                    type: "newComment",
                    relatedDocId: this.reviewId,
                    senderId: this.loggedUser.id,
                    senderName: this.loggedUser.displayName,
                    senderPhotoURL: this.loggedUser.photoURL,
                });
            } catch (err) {
                console.error("Error creating notification:", err);
            }

            // reset the text field
            this.newComment.text = '';

            setTimeout(() => {
                this.commenting = false;
            }, 1000);

        },
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuth(newUserData => this.loggedUser = newUserData);
    },
    unmounted() {
        unsubscribeFromAuth();
    }
}
</script>

<template>
    <form action="#" @submit.prevent="handleSubmit"
        class="flex flex-col sm:flex-row w-full items-center justify-center shadow-2xl ring-2 ring-black ring-opacity-10 rounded-[20px] p-[20px]">
        <div class="mb-4 w-full flex flex-col justify-center">
            <label class="block mb-2 text-white" :for="`text-${reviewId}`">Comment</label>
            <textarea :id="`text-${reviewId}`"
                class="w-10/12 min-h-20 p-2 border rounded m-auto focus:outline-none focus:ring-2 focus:ring-[#f1c421]"
                v-model="newComment.text"></textarea>
        </div>
        <button type="submit" :disabled="!newComment.text.trim()"
            class="min-w-[150px] max-h-[40px] transition py-2 px-4 rounded-lg text-[#272120] hover:text-[#3c2f2d] bg-[#f1c421] hover:bg-[#fadc5a] font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[white]">
            <span v-if="!commenting">Send</span>
            <div v-else class="flex flex-row items-center ">Sending
                <Loader />
            </div>
        </button>
    </form>
</template>