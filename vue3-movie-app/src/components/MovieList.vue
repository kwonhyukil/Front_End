<template>
  <div class="container">
    <div
    :class="{ 'no-result': !movies.length }"
    class="inner">
    <div v-if="loading" class="spinner-border text-primary"></div>
    <div v-if="message" class="message">
      {{ message }}
    </div>
    <div v-else class="movies">
      <MovieItem
      v-for="movie in movies"
      :key="movie.imdbID"
      :movie="movie"
      />
      </div>
    </div>
  </div>
</template>

<script>
import MovieItem from './MovieItem.vue';

export default {
  components: {
    MovieItem
  },
  computed: {
    movies() {
      return this.$store.state.movie.movies
    },
    message () {
      return this.$store.state.movie.message
    },
    loading() {
      return this.$store.state.movie.loading
    }
  }
}

</script>

<style lang="scss" scoped>
@use "@/scss/main" as *;

.container {
  margin-top: 30px;
  .inner {
    background-color: $gray-200;
    padding: 10px 0;
    border-radius: 4px;
    text-align: center;
    &.no-result {
      padding: 70px 0;

    }
  }
  .message {
    color: $gray-400;
    font-size: 20px;
  }
  .movies {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
