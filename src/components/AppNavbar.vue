<script>
export default {
    name: 'AppNavbar',
    props: {
        loggedUser: Object,
    },
    data() {
        return {
            isUserMenuOpen: false,
            isMobileMenuOpen: false,
        };
    },
    methods: {
        toggleUserMenu() {
            this.isUserMenuOpen = !this.isUserMenuOpen;
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        },
        handleLogout() {
            this.$emit('logout');
        },
        closeUserMenuOnClickOutside(event) {

            const userMenu = this.$refs.userMenu;
            const userMenuButton = this.$refs.userMenuButton;

            if (userMenu && !userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
                this.isUserMenuOpen = false;
            }

        },
        closeMobileMenuOnClickOutside(event) {

            const mobileMenu = this.$refs.mobileMenu;
            const mobileMenuButton = this.$refs.mobileMenuButton;

            if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                this.isMobileMenuOpen = false;
            }

        }
    },
    mounted() {
        document.addEventListener('click', this.closeUserMenuOnClickOutside);
        document.addEventListener('click', this.closeMobileMenuOnClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeUserMenuOnClickOutside);
        document.removeEventListener('click', this.closeMobileMenuOnClickOutside);
    },
};
</script>

<template>
    <nav class="bg-red-gradient h-20 rounded-bl-[20px] rounded-br-[20px]">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <!-- NavBar options -->
                <div class="flex items-center">
                    <div class="flex items-center mr-[20px]">
                        <img class="h-10 w-10 mr-[10px]" src="./../../inPlot.ico" alt="logo">
                        <router-link :to="{ name: 'home' }" class=" text-white text-xl logo">
                            In<span class="text-[#f09224]">Plot</span>
                        </router-link>
                    </div>
                    <div class="hidden md:block">
                        <ul class="flex items-center space-x-4 font-medium text-[#f09224]">
                            <template v-if="loggedUser.id">
                                <li class="bg-gray-800 hover:bg-gray-700 hover:text-[wheat] rounded-lg p-[5px] m-2"><router-link class="py-2 px-4" to="/feed">Media Reviews</router-link></li>
                            </template>
                            <template v-if="!loggedUser.id">
                                <li class="bg-gray-800 hover:bg-gray-700 hover:text-[wheat] rounded-lg p-[5px] m-2"><router-link class="py-2 px-4" to="/register">Register</router-link></li>
                                <li class="bg-gray-800 hover:bg-gray-700 hover:text-[wheat] rounded-lg p-[5px] m-2"><router-link class="py-2 px-4" to="/login">Login</router-link></li>
                            </template>
                        </ul>
                    </div>
                </div>


                <template v-if="loggedUser.id">
                    <!-- My Profile / Log Out -->
                    <div v-show="!isMobileMenuOpen" class="relative hidden md:block items-center">
                        <button ref="userMenuButton" @click="toggleUserMenu" class="relative flex items-center">
                            <img class="h-8 w-8 rounded-full" src="./../../assets/imgs/anakin-skywalker.webp"
                                alt="user">
                        </button>
                        <div v-if="isUserMenuOpen" ref="userMenu"
                            class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 flex justify-center">
                            <ul>
                                <li><router-link class="block px-4 py-2 text-sm text-[#f09224] hover:text-[wheat]" to="/myProfile">My Profile</router-link></li>
                                <li class="block px-4 py-2 text-sm text-[#f09224] hover:text-[wheat]">
                                    <form @submit.prevent="handleLogout">
                                        <button type="submit" class="py-2 px-4 ">Logout</button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>

                <!-- Hamburger menu -->
                <div class="-mr-2 flex md:hidden">
                    <!-- Mobile menu button -->
                    <button ref="mobileMenuButton" @click="toggleMobileMenu" type="button"
                        class="relative inline-flex items-center justify-center rounded-md bg-[#f09224] p-2 text-gray-400 hover:bg-[wheat] hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        id="mobile-menu-button">
                        <span class="absolute -inset-0.5"></span>

                        <!-- Menu open icon -->
                        <svg v-if="!isMobileMenuOpen" id="menu-open-icon" class="block h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="black" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>

                        <!-- Menu close icon -->
                        <svg v-else id="menu-close-icon" class=" h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="black" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="md:hidden " id="mobile-menu">

            <!-- NavBar Options -->
            <div v-show="isMobileMenuOpen" ref="mobileMenu"
                class="space-y-1 px-2 pb-3 pt-2 sm:px-3 bg-[#56141E] rounded-bl-[20px] rounded-br-[20px] relative border-b border-[#BC2B41] z-[100]">
                <ul class="text-white flex flex-col items-center">
                    
                    <template v-if="loggedUser.id !== null">
                        <li><router-link class="block py-2 px-4" to="/feed">Media Reviews</router-link></li>
                        <li><router-link class="block py-2 px-4" to="/myProfile">My Profile</router-link></li>
                        <li>
                            <form action="#" @submit.prevent="handleLogout">
                                <button type="submit" class="block py-2 px-4">{{ loggedUser.email }} (Log out)</button>
                            </form>
                        </li>
                    </template>

                    <template v-else>
                        <li><router-link class="block py-2 px-4" to="/register">Register</router-link></li>
                        <li><router-link class="block py-2 px-4" to="/login">Login</router-link></li>
                    </template>
                </ul>

                <!-- My Profile -->
                <div v-if="loggedUser.id !== null" v-show="isMobileMenuOpen" class="border-t border-[white] pb-3 pt-4 flex flex-col items-center">
                    <div class="flex items-center px-5">
                        <div class="flex-shrink-0">
                            <img class="h-10 w-10 rounded-full" src="./../../assets/imgs/anakin-skywalker.webp"
                                alt="user-image">
                        </div>
                        <div class="ml-3">
                            <div class="text-base font-medium leading-none text-white">{{ loggedUser.email }}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </nav>
</template>
