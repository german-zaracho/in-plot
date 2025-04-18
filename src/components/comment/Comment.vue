<script>
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { saveChatComment, subscribeToReviewComments, updateChatComment } from '../../services/comment';

export default {
    name: 'Comment',
    components: { CommentForm, CommentList },
    props: {
        reviewId: { type: String, required: true, }
    },
    emits: ['updateComment'],
    data() {
        return {
            comments: [],
            unsubscribeFromComments: null,
        }

    },
    methods: {
        addComment(newComment) {

            // console.log('passing newComment and reviewId', newComment, this.reviewId);
            saveChatComment(this.reviewId, newComment);
            // console.log('comments', this.comments);

        },
        updateComment(commentId, newText) {
            updateChatComment(this.reviewId, commentId, newText);
            this.$emit('updateComment', { commentId, newText });
        }
    },
    async mounted() {

        try {
            this.unsubscribeFromComments = await subscribeToReviewComments(
                this.reviewId,
                (newComments) => {
                    this.comments = newComments.map(comment => ({
                        ...comment,
                        created_at: comment.created_at?.toDate?.() || new Date(comment.created_at)
                    }));
                }
            );
            // console.log('Subscribed to comments for Review ID', this.reviewId);
        } catch (error) {
            console.error('Error when subscribing to comments: ', error);
        }

    },
    unmounted() {

        // this.unsubscribeFromComments();
        if (typeof this.unsubscribeFromComments === 'function') {
            this.unsubscribeFromComments();
        }

    }
}
</script>

<template>
    <div class="flex flex-col gap-4 w-[90%] m-auto">
        <section class="">
            <CommentList :theComments="comments" :reviewId="reviewId" @update-comment="updateComment" />
        </section>
        <section class="">
            <CommentForm @new-comment="addComment" />
        </section>
    </div>
</template>