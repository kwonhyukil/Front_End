<template>
  <Headera />
  <router-view />
</template>

<script>
import Headera from './components/HeaderPage.vue'

export default {
  components: {
    Headera
  }
}
</script>


<style lang="scss">
@import "@/scss/main.scss"

</style>
