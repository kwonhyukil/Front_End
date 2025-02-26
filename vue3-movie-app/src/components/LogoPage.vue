<template>
  <router-link to="/" class="logo">
    <span>OMDbAPI</span>.COM
  </router-link>
</template>

<style lang="scss" scoped>
@import "@/scss/main.scss";

.logo {
  font-family: "Oswald", "sans-serif";
  font-size: 20px;
  color: #200;
  text-decoration: none;
  &:hover {
    color: $black;
  }
  span {
    color: $primary;
  }
}

</style>
