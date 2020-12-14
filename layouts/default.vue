<template>
  <div id="app">
    <nav-bar />
    <div class="container">
      <Nuxt />
    </div>
    <alert></alert>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Alert from '../components/Alert'

export default {
  components: {
    NavBar,
    Alert,
  },
}
</script>
