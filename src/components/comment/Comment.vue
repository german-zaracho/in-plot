<script>
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';

export default {
    name: 'Comment',
    components: { CommentForm, CommentList },
    data() {
        return {
            comments: [
                {
                    id: 1,
                    email: '123@456.com',
                    text: 'first comment',
                },
                {
                    id: 2,
                    email: 'asd@asd.com',
                    text: 'second comment',
                },
                {
                    id: 3,
                    email: '123@456.com',
                    text: 'third comment',
                },
            ],
        }
    },
    methods: {
        addComment(newComment) {
            // add the comment to the array.
            this.comments.push({
                id: this.comments.length + 1,
                // email + text
                ...newComment,
            });
        }
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