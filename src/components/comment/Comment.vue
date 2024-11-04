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
                    email: 'sara@za.com',
                    text: 'Hola, ¿cómo andan?',
                },
                {
                    id: 2,
                    email: 'pepe@trueno.com',
                    text: 'hola sara q tal???',
                },
                {
                    id: 3,
                    email: 'sara@za.com',
                    text: 'Hola Pepe, bien, ¿y vos?',
                },
            ],
        }
    },
    methods: {
        addComment(newComment) {
            // add the comment to the array.
            this.comments.push({
                id: this.comments.length + 1,
                // email: newComment.email,
                // text: newComment.text,
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