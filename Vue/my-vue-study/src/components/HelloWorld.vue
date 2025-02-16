<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  
  <button type="button" @click="count++">count is {{ count }}</button>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
