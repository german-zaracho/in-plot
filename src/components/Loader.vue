<script>
export default {
    name: 'Loader',
}
</script>

<template>
    <div class="lds-dual-ring ml-[10px]"></div>
</template>

<style>
.lds-dual-ring,
.lds-dual-ring:after {
    box-sizing: border-box;
}

.lds-dual-ring {
    display: inline-block;
    width: 20px;
    height: 20px;
}

.lds-dual-ring:after {
    content: " ";
    display: block;
    width: 16px;
    height: 16px;
    margin: 2px;
    border-radius: 50%;
    border: 1.6px solid currentColor;
    border-color: currentColor transparent currentColor transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>