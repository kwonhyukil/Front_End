<template>
  <Headline />
  <search />
  <MovieList />
</template>

<script>
import Headline from '@/components/HeadlinePage.vue';
import Search from '@/components/SearchPage.vue'
import MovieList from '@/components/MovieList.vue';


export default {
  components: {
    Headline,
    Search,
    MovieList
  }
}
</script>

