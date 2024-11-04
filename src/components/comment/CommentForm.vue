<script>

export default {
    name: 'CommentForm',
    emits: ['new-comment'],
    data() {
        return {
            newComment: {
                email: '',
                text: '',
            },
        }
    },
    methods: {
        handleSubmit() {
            // We emit the "new-comment" event, sending the form data.
            this.$emit('new-comment', { ...this.newComment });

            // reset the text field
            this.newComment.text = '';
        },
    },
}
</script>

<template>
    <h2 class="text-xl mb-4">Send a comment</h2>
    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label class="block mb-2" for="email">Email</label>
            <input type="email" id="email" class="w-full p-2 border rounded" v-model="newComment.email">
        </div>
        <div class="mb-4">
            <label class="block mb-2" for="text">Comment</label>
            <textarea id="text" class="w-full min-h-20 p-2 border rounded" v-model="newComment.text"></textarea>
        </div>
        <button type="submit" class="transition py-2 px-4 rounded text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900">
            Send
        </button>
    </form>
</template>