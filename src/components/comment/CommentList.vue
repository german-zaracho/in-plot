<script>

export default {
    name: 'CommentList',
    props: {
        theComments: { type: Array, required: true, }
    },
    methods: {
        /**
         * 
         * @param {Date|null} date 
         * @returns {string} - "DD/MM/AAAA HH:mm" if the object is a Date type, otherwise null.
         */
        formatDate(date) {
            if (!date) return null;

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            return formatter.format(date).replace(',', '');
        }
    }
}

</script>

<template>

    <h2 class="sr-only">Comments</h2>

    <div class="border rounded p-4">

        <ul>
            <li v-for="comment in theComments" :key="comment.id" class="mb-3">
                <!-- <div><b>{{ comment.email }}</b> wrote:</div>
                <div>{{ comment.text }}</div> -->

                <div>
                    <router-link :to="`/users/${comment.user_id}`" class="text-blue-700 underline font-bold">{{ comment.displayName || comment.email }}</router-link>
                    wrote:
                </div>

                <div>{{ comment.text }}</div>
                <div class="text-sm text-gray-700">{{ formatDate(comment.created_at) || "Sending..." }}</div>
                
            </li>
        </ul>

    </div>

</template>