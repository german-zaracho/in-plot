<script>
import { onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home.vue';
import { auth } from './services/firebase';
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';
import { logout } from './services/auth';

export default {
    name: 'App',
    components: { AppNavbar, AppFooter, Home },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
            },
            isMobileMenuOpen: false,
            isUserMenuOpen: false,
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/login');
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        },
        toggleUserMenu() {
            this.isUserMenuOpen = !this.isUserMenuOpen;
        },
        closeMenus(event) {
            // Cierra el menú si se hace clic fuera
            if (!this.$refs.userMenuButton.contains(event.target) &&
                !this.$refs.userMenu.contains(event.target)) {
                this.isUserMenuOpen = false;
            }
            if (!this.$refs.mobileMenuButton.contains(event.target) &&
                !this.$refs.mobileMenu.contains(event.target)) {
                this.isMobileMenuOpen = false;
            }
        }
    },
    mounted() {

        document.addEventListener('click', this.closeMenus);

        onAuthStateChanged(auth, user => {
            if (user) {
                this.loggedUser = {
                    id: user.uid,
                    email: user.email,
                }
            } else {
                this.loggedUser = {
                    id: null,
                    email: null,
                }
            }
        });

    },
    beforeDestroy() {
        // Eliminar el evento cuando el componente se destruya
        document.removeEventListener('click', this.closeMenus);
    }
}

</script>

<template>
    <!-- <AppNavbar /> -->

    <nav class="flex justify-between items-center p-4 bg-slate-200 text-gray-800">

        <router-link :to="{ name: 'home' }" class="text-xl">InPlot</router-link>

        <ul class="flex gap-2">

            <li><router-link class="block py-2 px-4" :to="{ name: 'home' }">Home</router-link></li>

            <template v-if="loggedUser.id !== null">
                <li><router-link class="block py-2 px-4" to="/feed">Feed</router-link></li>
                <li><router-link class="block py-2 px-4" to="/feed">My Profile</router-link></li>
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

    </nav>

    <nav class="bg-[#bef8cc]">

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div class="flex h-16 items-center justify-between">

                <!-- NavBar options -->
                <div class="flex items-center">
                    <div class="flex flex-shrink-0 items-center">
                        <img class="h-10 w-10" src="./../inPlot.ico" alt="logo">
                        <router-link :to="{ name: 'home' }" class="text-xl">InPlot</router-link>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">

                            <ul class="flex items-center">
                                <li><router-link class="block py-2 px-4" :to="{ name: 'home' }">Home</router-link></li>

                                <template v-if="loggedUser.id !== null">
                                    <li><router-link class="block py-2 px-4" to="/feed">Feed</router-link></li>
                                    <li><router-link class="block py-2 px-4" to="/feed">My Profile</router-link></li>
                                    <li>
                                        <form action="#" @submit.prevent="handleLogout">
                                            <button type="submit" class="block py-2 px-4">{{ loggedUser.email }} (Log
                                                out)</button>
                                        </form>
                                    </li>
                                </template>

                                <template v-else>
                                    <li><router-link class="block py-2 px-4" to="/register">Register</router-link></li>
                                    <li><router-link class="block py-2 px-4" to="/login">Login</router-link></li>
                                </template>
                            </ul>

                        </div>

                    </div>

                </div>

                <!-- My Profile -->
                <div class="hidden md:block">

                    <div class="ml-4 flex items-center md:ml-6">

                        <!-- Profile dropdown -->
                        <div class="relative ml-3">

                            <div class="user-myProfile-button">
                                <button  ref="userMenuButton" @click="toggleUserMenu" type="button" class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span class="absolute -inset-1.5"></span>
                                    <img class="h-8 w-8 rounded-full" src="./../public/assets/imgs/anakin-skywalker.webp" alt="user-image">
                                </button>
                            </div>

                            <div v-show="isUserMenuOpen" ref="userMenu" class="md:hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1" id="user-menu">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
                            </div>

                        </div>

                    </div>

                </div>

                <!-- Hamburger menu -->
                <div class="-mr-2 flex md:hidden">
                    <!-- Mobile menu button -->
                    <button ref="mobileMenuButton" @click="toggleMobileMenu" type="button" class="relative inline-flex items-center justify-center rounded-md bg-[#f09224] p-2 text-gray-400 hover:bg-[#fcba50] hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="mobile-menu-button">
                        <span class="absolute -inset-0.5"></span>

                        <!-- Menu open icon -->
                        <svg v-if="!isMobileMenuOpen" id="menu-open-icon" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>

                        <!-- Menu close icon -->
                        <svg v-else id="menu-close-icon" class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>

                    </button>

                </div>

            </div>

        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="md:hidden hidden" id="mobile-menu">

            <!-- NavBar Options -->
            <div v-show="isMobileMenuOpen" ref="mobileMenu" class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                <ul>
                    <li><router-link class="block py-2 px-4" :to="{ name: 'home' }">Home</router-link></li>

                    <template v-if="loggedUser.id !== null">
                        <li><router-link class="block py-2 px-4" to="/feed">Feed</router-link></li>
                        <li><router-link class="block py-2 px-4" to="/feed">My Profile</router-link></li>
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
            </div>

            <!-- My Profile -->
            <div class="border-t border-gray-700 pb-3 pt-4">
                <div class="flex items-center px-5">
                    <div class="flex-shrink-0">
                        <img class="h-10 w-10 rounded-full" src="./../assets/imgs/anakin-skywalker.webp" alt="user-image">
                    </div>
                    <div class="ml-3">
                        <div class="text-base font-medium leading-none text-white">Nombre del usuario</div>
                        <div class="text-sm font-medium leading-none text-gray-400">email del usuario</div>
                    </div>
                    <button type="button"
                        class="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span class="absolute -inset-1.5"></span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                    </button>
                </div>
                <div class="mt-3 space-y-1 px-2">
                    <a href="#"
                        class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-[#f09224] hover:text-white">Your
                        Profile</a>
                    <a href="#"
                        class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-[#f09224] hover:text-white">Settings</a>
                    <a href="#"
                        class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-[#f09224] hover:text-white">Sign
                        out</a>
                </div>
            </div>

        </div>

    </nav>

    <main class="container mx-auto p-4">
        <router-view />
    </main>
    <AppFooter />
</template>