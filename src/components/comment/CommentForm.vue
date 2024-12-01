<script>
import { subscribeToAuth } from '../../services/auth';

let unsubscribeFromAuth = () => {};

export default {
    name: 'CommentForm',
    emits: ['new-comment'],
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

            newComment: {
                text: '',
            },
        }
    },
    methods: {
        handleSubmit() {
            // We emit the "new-comment" event, sending the form data.
            this.$emit('new-comment', {
                user_id: this.loggedUser.id,
                email: this.loggedUser.email,
                text: this.newComment.text,
            });

            // reset the text field
            this.newComment.text = '';
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
    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label class="block mb-2" for="text">Comment</label>
            <textarea id="text" class="w-full min-h-20 p-2 border rounded" v-model="newComment.text"></textarea>
        </div>
        <button type="submit"
            class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
            Send
        </button>
    </form>
</template>