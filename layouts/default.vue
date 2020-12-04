<template>
  <div id="app">
    <nav-bar />
    <div class="container">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
}
</script>
