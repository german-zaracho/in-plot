<script>
import { subscribeToAuth } from "../../services/auth";
import { deleteChatComment } from "../../services/comment";
import { createNotification } from '../../services/notifications';
import Loader from '../Loader.vue';

export default {
    name: 'CommentList',
    components: { Loader },
    props: {
        theComments: { type: Array, required: true, },
        reviewId: { type: String, required: true }
    },
    emits: ['updateComment', 'commentDeleted'],
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                role: null,
                photoURL: null,
            },
            editingCommentId: null,
            editedText: "",
            showLoader: true,
            deletedCommentIds: [],
            savingCommentId: null,
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

            // If it is a Firestore Timestamp
            if (date.seconds && typeof date.toDate === 'function') {
                date = date.toDate();
            } else if (!(date instanceof Date)) {
                // If it is a string or other format, try to parse it.
                date = new Date(date);
            }

            // Avoid formatting invalid dates
            if (isNaN(date)) return null;

            // To keep the date and time of the comment after editing it
            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            return formatter.format(date).replace(',', '');
        },
        startEditing(comment) {
            this.editingCommentId = comment.id;
            this.editedText = comment.text;
        },
        async saveEdit(comment) {
            if (this.editedText.trim() === "" || this.editedText === comment.text) {

                this.savingCommentId = comment.id;

                setTimeout(() => {
                    this.editingCommentId = null;
                    this.savingCommentId = null;
                }, 1000);

                return;
            }

            this.savingCommentId = comment.id;
            this.$emit('updateComment', comment.id, this.editedText);

            // Call the notification service
            try {
                await createNotification({
                    userId: comment.user_id, // The owner of the original comment (who will receive the notification)
                    type: "editComment",
                    relatedDocId: this.reviewId,
                    senderId: this.loggedUser.id,
                    senderName: this.loggedUser.displayName,
                    senderPhotoURL: this.loggedUser.photoURL,
                });
            } catch (err) {
                console.error("Error creating notification:", err);
            }

            setTimeout(() => {
                this.editingCommentId = null;
                this.savingCommentId = null;
            }, 1000);

        },
        async deleteComment(comment) {
            try {

                // Mark as deleted only on the frontend
                this.deletedCommentIds.push(comment.id);
                // It generates a 3 second delay and then the deleted message disappears.
                await new Promise(resolve => setTimeout(resolve, 3000));

                await deleteChatComment(this.reviewId, comment.id);

                this.$emit('commentDeleted', comment.id);

                // Call the notification service
                try {
                    await createNotification({
                        userId: comment.user_id, // The owner of the original comment (who will receive the notification)
                        type: "deleteComment",
                        relatedDocId: this.reviewId,
                        senderId: this.loggedUser.id,
                        senderName: this.loggedUser.displayName,
                        senderPhotoURL: this.loggedUser.photoURL,
                    });
                } catch (err) {
                    console.error("Error creating notification:", err);
                }

            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        },
        updateComment(commentId, newText) {
            this.$emit('updateComment', commentId, newText);
        }
    },
    mounted() {
        // Hide loader after 2 seconds
        setTimeout(() => {
            this.showLoader = false;
        }, 2000);

        this.unsubscribeFromAuth = subscribeToAuth((userData) => {
            this.loggedUser = userData;
            // console.log("logged", this.loggedUser);
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

    <div class="shadow-2xl ring-2 ring-black ring-opacity-10 rounded-[20px] p-4 mt-[20px] bg-[#272120]">

        <div v-if="theComments.length === 0" class="flex flex-row items-center mb-4">
            <Loader v-if="showLoader" class="w-[30px] h-[30px] text-white mr-[10px]" />
            <p class="text-white">No comments yet.</p>
        </div>

        <ul v-else class="flex flex-col items-start gap-4 max-h-[300px] overflow-y-auto">
            <li v-for="comment in theComments" :key="comment.id" :class="{
                'self-end bg-dark-gradient-invert': comment.user_id === loggedUser.id,
                'bg-dark-gradient': comment.user_id !== loggedUser.id, 'w-[300px]': true,
                'w-[80%] sm:w-[300px]': true
            }" class="mb-3 rounded-[20px] p-[10px]">

                <div class="text-white">
                    <router-link :to="`/users/${comment.user_id}`"
                        class="text-[#f1c421] font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:rounded-lg">{{
                            comment.displayName || comment.email }}</router-link>:
                </div>

                <div v-if="editingCommentId === comment.id">
                    <input v-model="editedText"
                        class="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
                    <button @click="saveEdit(comment)"
                        class="text-white bg-green-500 p-1 rounded ml-2 focus:outline-none focus:ring-2 focus:ring-black">
                        <span v-if="savingCommentId !== comment.id">Save</span>
                        <div v-else class="flex flex-row items-center ">Saving
                            <Loader />
                        </div>
                    </button>
                    <button @click="editingCommentId = null"
                        class="text-white bg-gray-500 p-1 rounded ml-2 focus:outline-none focus:ring-2 focus:ring-black">Cancel</button>
                </div>

                <div v-else>

                    <div v-if="deletedCommentIds.includes(comment.id)" class="italic text-gray-600">This message has
                        been
                        deleted</div>

                    <div v-else>
                        <div class="text-white">{{ comment.text }}</div>

                        <div class="text-sm text-[#a8784e]">{{ formatDate(comment.created_at) || "Sending..." }}</div>

                        <button v-if="loggedUser.role === 'admin'" @click="startEditing(comment)"
                            class="text-white bg-blue-500 p-1 rounded mt-1 w-[70px] focus:outline-none focus:ring-2 focus:ring-black">Edit</button>

                        <button v-if="loggedUser.role === 'admin'" @click="deleteComment(comment)"
                            class="text-white bg-red-500 p-1 rounded mt-1 ml-2 w-[70px] focus:outline-none focus:ring-2 focus:ring-black">
                            Delete
                        </button>
                    </div>

                </div>

            </li>
        </ul>

    </div>

</template>