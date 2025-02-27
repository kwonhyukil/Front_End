<template>
  <Headera />
  <router-view />
  <Footera />
</template>

<script>
import Headera from './components/HeaderPage.vue'
import Footera from './components/FooterPage.vue'

export default {
  components: {
    Headera,
    Footera
  }
}
</script>


<style lang="scss">
@import "@/scss/main.scss"

</style>
