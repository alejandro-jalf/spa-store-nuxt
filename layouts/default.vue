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
    <NavBarLeft v-if="width > 1300 && login" />
    <nav-bar v-else-if="login" />
    <div class="container container-all">
      <Nuxt />
    </div>
    <alert></alert>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Alert from '../components/Alert'
import NavBarLeft from '../components/NavBarLeft'

export default {
  components: {
    NavBar,
    Alert,
    NavBarLeft,
  },
  data() {
    return {
      width: 0,
    }
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
    const containerAll = document.querySelector('.container-all')

    let widthWindow = window.innerWidth
    let paddingLeft = 0

    this.width = window.innerWidth
    if (this.width <= 1300) {
      containerAll.style.width = '100%'
      containerAll.style.marginLeft = 'auto'
    } else if (this.width > 1390) {
      paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
      containerAll.style.width = 'calc(100% - 250px)'
      containerAll.style.marginLeft = paddingLeft + 'px'
    } else {
      containerAll.style.width = 'calc(100% - 250px)'
      containerAll.style.marginLeft = '250px'
    }

    window.addEventListener('resize', () => {
      widthWindow = window.innerWidth

      this.width = window.innerWidth
      if (this.width <= 1300) {
        containerAll.style.width = '100%'
        containerAll.style.marginLeft = 'auto'
      } else if (this.width > 1390) {
        paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
        containerAll.style.width = 'calc(100% - 250px)'
        containerAll.style.marginLeft = paddingLeft + 'px'
      } else {
        containerAll.style.width = 'calc(100% - 250px)'
        containerAll.style.marginLeft = '250px'
      }
    })

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
  methods: {
    getLengthMarginLeft() {},
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
