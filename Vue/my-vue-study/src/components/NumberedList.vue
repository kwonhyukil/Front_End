<template>
    
    <div>
        <h2> 순번이 포함된 리스트 </h2>
        <ul>
            <li v-for="(item, index) in items" :key="index">
                {{ index + 1 }} . {{ item }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(['vue', 'react', 'Augular', 'Svelte']);

</script>