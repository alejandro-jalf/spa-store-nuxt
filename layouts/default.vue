<template>
  <div id="app">
    <b-overlay
      :show="loading > 0"
      rounded="sm"
      spinner-variant="primary"
      :class="themeOverlay"
      opacity="0.5"
      no-wrap
    ></b-overlay>
    <nav-bar v-if="login" />
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
  computed: {
    login() {
      return this.$store.state.user.login
    },
    loading() {
      return this.$store.state.general.loading
    },
    themeOverlay() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeOverlay'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeOverlay'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeOverlay'
      else return ''
    },
  },
  mounted() {
    if (this.$store.state.general.themePreferences === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
      if (systemDark) window.document.body.classList.add('dark-mode')
    }
    if (this.$store.state.general.themePreferences === 'dark') {
      window.document.body.classList.add('dark-mode')
    }
    if (this.$store.state.general.themePreferences === 'sepia') {
      window.document.body.classList.add('sepia-mode')
    }
  },
}
</script>

<style scoped>
.darkThemeOverlay {
  background: rgba(139, 139, 139, 0.63);
}
.sepiaThemeOverlay {
  background: #fbf1d6a2;
}
</style>
