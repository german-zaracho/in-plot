<script>
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { saveChatComment, subscribeToReviewComments } from '../../services/comment';

export default {
    name: 'Comment',
    components: { CommentForm, CommentList },
    props: {
        reviewId: { type: String, required: true, }
    },
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
        }
    },
    async mounted() {
        try {
            this.unsubscribeFromComments = await subscribeToReviewComments(
                this.reviewId,
                (newComments) => {
                    this.comments = newComments;
                }
            );
            // console.log('Subscribed to comments for Review ID', this.reviewId);
        } catch (error) {
            console.error('Error when subscribing to comments: ', error);
        }
    },
    unmounted() {
        this.unsubscribeFromComments();
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