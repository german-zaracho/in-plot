<script>
import { getAllReviews, deleteReview } from '../../services/media-reviews';
import { deleteAllComments } from '../../services/comment';
import SkeletonReview from '../SkeletonReview.vue';
import Comment from '../comment/Comment.vue';
import VueSkeletonLoader from 'vue3-skeleton-loader';
import SkeletonReviews from '../SkeletonReviews.vue';
import MobileSkeletonReviews from '../MobileSkeletonReviews.vue';
import Loader from '../Loader.vue';
import 'vue3-skeleton-loader/dist/style.css';

export default {
    name: 'Reviews',
    props: {
        userId: { type: String, required: true },
        userRole: { type: String, required: true },
    },
    components: { SkeletonReview, Comment, VueSkeletonLoader, SkeletonReviews, MobileSkeletonReviews, Loader },
    data() {
        return {
            reviews: [],
            loading: true,
            activeComments: {},
            expandedSynopsis: {},
            showUserName: {},
            showModal: false,
            reviewToDeleteId: null,
            deleting: false,
        };
    },
    methods: {
        /**
         * 
         * @param {Date|null} date 
         * @returns {string} - "DD/MM/AAAA HH:mm" otherwise null.
         */
        formatDate(date) {
            // console.log('date', date);
            if (!date) return null;

            const localDate = new Date(date.seconds * 1000);  // Convert seconds to milliseconds
            localDate.setHours(localDate.getHours() - 3);  // Sets the time for the UTC-3 (Argentina) time zone

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            return formatter.format(localDate).replace(',', '');

        },
        toggleUserName(reviewId, state) {

            this.showUserName[reviewId] = state;

        },
        toggleComment(reviewId) {

            if (this.activeComments.hasOwnProperty(reviewId)) {
                // Toggle state
                this.activeComments[reviewId] = !this.activeComments[reviewId];
            } else {
                // Add a new state
                this.activeComments[reviewId] = true;
            }

        },
        toggleSynopsis(reviewId) {

            if (this.expandedSynopsis.hasOwnProperty(reviewId)) {
                this.expandedSynopsis[reviewId] = !this.expandedSynopsis[reviewId];
            } else {
                this.expandedSynopsis[reviewId] = true;
            }

        },

        updateComment({ commentId, newText }) {
            console.log('Updated comment:', commentId, newText);
        },

        async confirmDelete() {
            this.deleting = true;

            if (!this.reviewToDeleteId) return;
            console.log("ID of the review to delete:", this.reviewToDeleteId);

            try {
                if (deleteAllComments(this.reviewToDeleteId)) {
                    await deleteReview(this.reviewToDeleteId);
                }
                console.log("Review successfully deleted.");
                this.reviews = this.reviews.filter(review => review.id !== this.reviewToDeleteId);
                this.reviewToDeleteId = null;
                this.$router.push({ path: '/temp' }).then(() => {
                    this.$router.replace({ path: '/feed', query: { reviewState: 'reviewDeleted' } });
                });

            } catch (error) {
                console.error("Error deleting comments. The review will not be deleted.:", error);
                return; // Exits the function if there is an error, preventing the execution of deleteReview
            }
            this.deleting = false;
            this.showModal = false;

        },
        openDeleteModal(reviewId) {
            this.reviewToDeleteId = reviewId; // Save the review ID
            this.showModal = true; // Show the modal
        }

    },

    computed: {
        isMobile() {
            return window.innerWidth < 431;
        }
    },
    async mounted() {

        // console.log('User ID', this.userId);

        try {
            this.reviews = await getAllReviews();
        } catch (error) {
            console.error('[Reviews.vue] Error fetching reviews: ', error);
        } finally {
            this.loading = false;
            // console.log('reviews', this.reviews);
        }
    },

};
</script>

<template>

    <section class="p-4">

        <div class="flex flex-row justify-between items-center max-w-[1000px] m-auto">
            <h1 class="text-2xl font-bold mb-4 text-white">All Reviews</h1>

            <router-link
                class="mb-4 text-[#f1c421] hover:text-[wheat]  rounded-lg bg-[#272120] hover:bg-[#3c2f2d] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:bg-[#3c2f2d]"
                to="/newReview">Create a new review</router-link>
        </div>

        <div v-if="loading">
            <SkeletonReviews v-if="!isMobile" />
            <MobileSkeletonReviews v-else />
        </div>

        <div v-else-if="reviews.length === 0">
            <p>No reviews available.</p>
        </div>

        <ul v-else class="">
            <li v-for="review in reviews" :key="review.id"
                class="p-4 mb-[20px] flex flex-col items-start justify-center relative rounded-[20px] shadow-2xl ring-2 ring-black ring-opacity-10 max-w-[1000px] m-auto min-h-[300px] bg-dark-gradient xs:items-center xs:p-[20px] xs:rounded-[10px]">

                <div
                    class="flex flex-row xs:flex-col items-center bg-dark-gradient justify-center max-w-[1000px] min-h-[300px] rounded-[20px] xs:p-[20px]">

                    <div
                        class="flex-shrink-0 flex flex-col items-center w-32  overflow-hidden rounded bg-none mr-[20px] ">
                        <div class="h-48">
                            <img v-if="review.coverURL" :src="review.coverURL" :alt="`Cover of ${review.title}`"
                                class="w-full h-full object-cover">
                            <p v-else
                                class="text-[black] text-center h-full flex items-center justify-center bg-gray-100 opacity-[0.9] rounded-[4px] ">
                                No cover available
                            </p>
                        </div>
                        <div class="flex m-[2px]">
                            <a v-if="review.trailer" :href="review.trailer"
                                class="text-[#f1c421] hover:text-[#f1c421] mt-2 block bg-[#272120] hover:bg-[#3c2f2d] max-w-[150px] p-2 text-center rounded-md focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:bg-[#3c2f2d]"
                                target="_blank">
                                Watch Trailer
                            </a>
                        </div>
                    </div>

                    <div v-if="userRole === 'admin'"
                        class="absolute top-0 left-0 bg-red-gradient text-black font-bold text-xs uppercase filter rounded-br-[50%_75%] rounded-tl-[20px] hover:rounded-br-[20%_100%]">
                        <router-link
                            class="relative flex items-center justify-center h-6 w-6 min-w-[60px] min-h-[30px] bg-red-gradient text-white overflow-hidden transition-[padding-right,width, padding-left] duration-300 ease-in-out hover:w-[180px] pr-[8px] pl-[8px] rounded-br-[50%_75%] rounded-tl-[20px] hover:rounded-br-[20%_100%] focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:bg-[#3c2f2d]"
                            aria-label="Edit Review" :to="`/users/${review.id}/editMyReview`">
                            <span class="material-symbols-rounded m-2">edit</span>
                            <span
                                class="mr-2 overflow-hidden inline-block text-white transition-all duration-[1000ms] ease-in-out whitespace-nowrap">
                                Edit Review
                            </span>
                        </router-link>
                    </div>

                    <div v-if="userRole === 'admin'"
                        class="absolute top-0 left-[47%] bg-red-gradient text-black font-bold text-xs uppercase filter rounded-br-[50%_75%] rounded-bl-[20px] hover:rounded-br-[20%_100%]">
                        <button @click="openDeleteModal(review.id)"
                            class="relative flex items-center justify-center h-6 w-6 min-w-[60px] min-h-[30px] bg-red-gradient text-white overflow-hidden transition-[padding-right,width, padding-left] duration-300 ease-in-out hover:w-[180px] pr-[8px] pl-[8px] rounded-br-[50%_75%] rounded-bl-[20px] hover:rounded-br-[20%_100%] focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:bg-[#3c2f2d]">
                            <span class="material-symbols-rounded m-2 ml-[14px] ">delete</span>
                            <span
                                class="mr-2 overflow-hidden inline-block text-white transition-all duration-[1000ms] ease-in-out whitespace-nowrap">Delete
                                Review</span>
                        </button>
                    </div>

                    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
                        <div class="bg-white p-6 rounded-lg shadow-lg">
                            <p class="mb-4">Are you sure you want to delete the following review?</p>
                            <div class="flex justify-end space-x-2">
                                <button v-if="!deleting" @click="confirmDelete"
                                    class="bg-red-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400">Delete</button>
                                <div v-else class="flex flex-row items-center bg-red-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400">Deleting
                                    <Loader />
                                </div>
                                <button @click="showModal = false"
                                    class="bg-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>

                            </div>
                        </div>
                    </div>

                    <div
                        class="absolute top-0 right-0 bg-[#f1c421] text-black font-bold text-xs uppercase  filter rounded-bl-[50%_75%] rounded-tr-[20px] hover:rounded-bl-[20%_100%]">
                        <router-link @mouseenter="toggleUserName(review.id, true)"
                            @mouseleave="toggleUserName(review.id, false)"
                            class="relative flex items-center justify-center h-6 w-6 min-w-[60px] min-h-[30px] bg-[#f1c421] text-white overflow-hidden transition-[padding-left,width, padding-right] duration-300 ease-in-out hover:w-[180px] pl-[8px] pr-[8px] rounded-bl-[50%_75%] rounded-tr-[20px] hover:rounded-bl-[20%_100%] focus:outline-none focus:ring-2 focus:ring-[#f1c421] focus:underline"
                            aria-label="See the creator's profile"
                            :to="review.user_id === userId ? '/myProfile' : `/users/${review.user_id}`">
                            <span class="material-symbols-rounded m-2">person</span>

                            <span :class="{
                                'opacity-0 max-w-0': !showUserName[review.id],
                                'opacity-100 max-w-full transition-all duration-[1000ms] ease-in-out whitespace-nowrap': showUserName[review.id]
                            }" class="ml-2 overflow-hidden inline-block text-white">
                                {{ review.displayName }}
                            </span>
                        </router-link>
                    </div>



                    <div class="flex-1">

                        <h2 class="text-xl font-semibold text-[#f1c421]">{{ review.title }}</h2>

                        <div class="flex flex-row justify-between">
                            <p class="text-sm text-[#a8784e] mb-2">Year: {{ review.year }}</p>
                            <p class="text-sm text-[#a8784e] mb-2">Type: {{ review.contentType }}</p>
                        </div>

                        <p
                            class="text-white w-[300px] xxs:max-w-[250px] xs:max-w-[390px] sm:w-[392px] md:w-[520px] lg:w-[775px]">
                            <span :class="{ 'line-clamp-3': !expandedSynopsis[review.id] }">
                                {{ review.synopsis }}
                            </span>
                        </p>

                        <div class="flex flex-row justify-between">

                            <button type="button"
                                class="text-[#f1c421] hover:text-[#f1c421] mt-2 block bg-[#272120] hover:bg-[#3c2f2d] max-w-[150px] p-2 text-center rounded-md focus:outline-none focus:ring-2 focus:ring-[#f1c421]"
                                @click="toggleSynopsis(review.id)">
                                {{ expandedSynopsis[review.id] ? 'Read less' : 'Read more' }}
                            </button>

                            <div class="flex flex-row justify-between">

                                <button type="button"
                                    class="flex items-center justify-center w-10 h-10 mt-[7px] bg-red-gradient text-white rounded-full hover:bg-[#BC2B41] shadow-2xl ring-2 ring-black ring-opacity-10 focus:outline-none focus:ring-2 focus:ring-[#f1c421]"
                                    @click="toggleComment(review.id)">
                                    <span class="material-symbols-rounded">chat</span>
                                </button>
                            </div>

                        </div>

                        <div class="text-end p-2 text-[#a8784e]"><span class="text-[#a8784e]">Published:</span> {{
                            formatDate(review.created_at) }}</div>

                    </div>

                </div>

                <Comment v-if="activeComments[review.id]" :reviewId="review.id" @updateComment="updateComment" />

            </li>
        </ul>

    </section>
</template>
