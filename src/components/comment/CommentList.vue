<script>

export default {
    name: 'CommentList',
    props: {
        theComments: { type: Array, required: true, }
    },
}

</script>

<template>

    <h2 class="sr-only">Comments</h2>

    <div class="border rounded p-4">

        <ul>
            <li v-for="comment in theComments" :key="comment.id" class="mb-3">
                <div><b>{{ comment.email }}</b> wrote:</div>
                <div>{{ comment.text }}</div>
            </li>
        </ul>
        
    </div>

</template>