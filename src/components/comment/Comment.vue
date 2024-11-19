<script>
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { saveChatComment, subscribeToChatComments } from '../../services/comment';

let unsubscribeFromChat = () => {};

export default {
    name: 'Comment',
    components: { CommentForm, CommentList },
    data() {
        return {
            comments: [],
        }
    },
    methods: {
        addComment(newComment) {
            saveChatComment(newComment);
        }
    },
    mounted() {
        unsubscribeFromChat = subscribeToChatComments(newComments => this.comments = newComments);
    },
    unmounted() {
        unsubscribeFromChat();
    }
}
</script>

<template>
    <div class="flex gap-4">
        <section class="w-9/12">
            <CommentList :theComments="comments" />
        </section>
        <section class="w-3/12">
            <CommentForm @new-comment="addComment" />
        </section>
    </div>
</template>