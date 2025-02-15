<!-- num.vue -->
<script setup>
import { useDataStore } from '../store/data';

const store = useDataStore();
</script>

<template>
  <h3>{{ store.count }}</h3>
  <button @click="store.increment">up</button>
  <button @click="store.decrement">down</button>
</template>
