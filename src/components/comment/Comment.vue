<script>
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { db } from '../../services/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

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
            const commentRef = collection(db, 'comments');
            addDoc(commentRef, {
                ...newComment,
            });
        }
    },
    async mounted() {
        const commentRef = collection(db, 'comments');
        onSnapshot(commentRef, snapshot => {
            this.comments = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    email: doc.data().email,
                    text: doc.data().text,
                }
            });
        });
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