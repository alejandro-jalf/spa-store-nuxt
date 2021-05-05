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
import Vue from 'vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import NavBar from '../components/NavBar.vue'
import Alert from '../components/Alert'

Vue.use(BootstrapVueIcons)

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
}
</script>
