<template>
  <div id="app">
    <b-overlay :show="loading > 0" rounded="sm" spinner-variant="primary">
      <nav-bar v-if="login" />
      <div class="container">
        <Nuxt />
      </div>
      <alert></alert>
    </b-overlay>
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
  computed: {
    login() {
      return this.$store.state.user.login
    },
    loading() {
      return this.$store.state.general.loading
    },
  },
  mounted() {
    if (this.$store.state.general.themePreferences === 'dark') {
      window.document.body.classList.add('dark-mode')
    }
    if (this.$store.state.general.themePreferences === 'sepia') {
      window.document.body.classList.add('sepia-mode')
    }
  },
}
</script>
