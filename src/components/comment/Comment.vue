<script>
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { saveChatComment, subscribeToReviewComments } from '../../services/comment';

let unsubscribeFromComments = () => {};

export default {
    name: 'Comment',
    components: { CommentForm, CommentList },
    props: {
        reviewId: { type: String, required: true,}
    },
    data() {
        return {
            comments: [],
        }
    },
    methods: {
        addComment(newComment) {
            console.log('estoy pasando', newComment, this.reviewId);
            saveChatComment(this.reviewId, newComment);
            console.log('comments', this.comments);
        }
    },
    mounted() {
        unsubscribeFromComments = subscribeToReviewComments(this.reviewId, newComments => this.comments = newComments);
        console.log('reviewId', this.reviewId, 'callback', newComments => this.comments = newComments);
    },
    unmounted() {
        unsubscribeFromComments();
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