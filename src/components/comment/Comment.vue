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
            <CommentList :theComments="comments" />
        </section>
        <section class="">
            <CommentForm @new-comment="addComment" />
        </section>
    </div>
</template>