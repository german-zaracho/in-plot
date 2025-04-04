<script>
import { subscribeToAuth } from "../../services/auth";
import { deleteChatComment } from "../../services/comment"; //new

export default {
    name: 'CommentList',
    props: {
        theComments: { type: Array, required: true, },
        reviewId: { type: String, required: true }
    },
    emits: ['updateComment', 'commentDeleted'], //new
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                role: null,
            },
            editingCommentId: null, //new
            editedText: "" //new
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

            // Si es un Timestamp de Firestore
            if (date.seconds && typeof date.toDate === 'function') {
                date = date.toDate(); // Método más seguro para Timestamps de Firestore
            } else if (!(date instanceof Date)) {
                // Si es string u otro formato, intentar parsearlo
                date = new Date(date);
            }

            // Evitar formatear fechas inválidas
            if (isNaN(date)) return null;

            //const parsedDate = date instanceof Date ? date : new Date(date); 
            //new para mantener el fecha y hora de comentario luego de editarlo
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
        saveEdit(comment) {
            if (this.editedText.trim() === "" || this.editedText === comment.text) {
                this.editingCommentId = null;
                return;
            }
            this.$emit('update-comment', comment.id, this.editedText);
            this.editingCommentId = null;
        },
        async deleteComment(commentId) {
            try {

                await deleteChatComment(this.reviewId, commentId);
                this.$emit('commentDeleted', commentId);
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        },
        updateComment(commentId, newText) {
            this.$emit('updateComment', commentId, newText); // new
        }
    },
    mounted() {
        this.unsubscribeFromAuth = subscribeToAuth((userData) => {
            console.log('asdaaaa');
            this.loggedUser = userData;
            console.log("logged", this.loggedUser);
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

        <p v-if="theComments.length === 0" class="text-white">No comments yet.</p>

        <ul v-else class="flex flex-col items-start gap-4 max-h-[300px] overflow-y-auto">
            <li v-for="comment in theComments" :key="comment.id" :class="{
                'self-end bg-green-200': comment.user_id === loggedUser.id,
                'bg-gray-200': comment.user_id !== loggedUser.id, 'w-[300px]': true,
                'w-[80%] sm:w-[300px]': true
            }" class="mb-3 rounded-[20px] p-[10px]">

                <div>
                    <router-link :to="`/users/${comment.user_id}`" class="text-blue-700 font-bold">{{
                        comment.displayName || comment.email }}</router-link>
                    wrote:
                </div>

                <div v-if="editingCommentId === comment.id">
                    <input v-model="editedText" class="border p-1 w-full rounded" />
                    <button @click="saveEdit(comment)" class="text-white bg-green-500 p-1 rounded ml-2">Save</button>
                    <button @click="editingCommentId = null"
                        class="text-white bg-gray-500 p-1 rounded ml-2">Cancel</button>
                </div>

                <div v-else>
                    <div>{{ comment.text }}</div>
                    <div class="text-sm text-gray-700">{{ formatDate(comment.created_at) || "Sending..." }}</div>

                    <button v-if="loggedUser.role === 'admin'" @click="startEditing(comment)"
                        class="text-white bg-blue-500 p-1 rounded mt-1 w-[70px]">Edit</button>

                    <button v-if="loggedUser.role === 'admin'" @click="deleteComment(comment.id)"
                        class="text-white bg-red-500 p-1 rounded mt-1 ml-2 w-[70px]">
                        Delete
                    </button>

                </div>

            </li>
        </ul>

    </div>

</template>