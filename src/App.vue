<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
    name: 'App',
    components: { Navbar, Footer },
}

</script>

<template>
    <Navbar />
    <main>
        <router-view />
    </main>
    <Footer />
</template>