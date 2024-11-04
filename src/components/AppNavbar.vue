<script>

export default {
    name: 'Navbar',
}

</script>

<template>
    <nav class="navbar">
        <router-link :to="{ name: 'home' }">InPlot</router-link>

        <ul class="menu">
            <li><router-link :to="{ name: 'home' }">Home</router-link></li>
            <li><router-link to="/feed">Feed</router-link></li>
            <li><router-link to="/register">Register</router-link></li>
            <li><router-link to="/login">Login</router-link></li>
        </ul>
    </nav>
</template>
