<template>
  <div id="app">
    <b-overlay
      :show="loading > 0"
      rounded="sm"
      spinner-variant="primary"
      :class="themeOverlay"
      opacity="0.5"
      no-wrap
      fixed
      z-index="10"
    ></b-overlay>
    <NavBarLeft v-if="width > 1390 && login" />
    <nav-bar v-else-if="(login && !barraInferior) || (login && width > 991)" />
    <div class="container container-all">
      <Nuxt />
    </div>
    <nav-bar-bottom
      v-if="login && barraInferior && width < 992"
    ></nav-bar-bottom>
    <alert></alert>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Alert from '../components/Alert'
import NavBarLeft from '../components/NavBarLeft'
import NavBarBottom from '../components/NavBarBottom'

export default {
  components: {
    NavBar,
    Alert,
    NavBarLeft,
    NavBarBottom,
  },
  data() {
    return {
      width: 0,
    }
  },
  computed: {
    barraInferior() {
      return this.$store.state.general.barraInferior === 'true'
    },
    login() {
      const app = document.querySelector('#app')
      const containerAll = document.querySelector('.container-all')
      if (app && containerAll) {
        const widthWindow = window.innerWidth
        let paddingLeft = 0

        if (widthWindow <= 1390 && this.$store.state.user.login)
          app.style.marginTop = '80px'
        else app.style.marginTop = '0px'

        if (widthWindow <= 1390 || !this.$store.state.user.login) {
          containerAll.style.width = '100%'
          containerAll.style.marginLeft = 'auto'
        } else {
          paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
          containerAll.style.width = 'calc(100% - 250px)'
          containerAll.style.marginLeft = paddingLeft + 'px'
        }
      }
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
    const app = document.querySelector('#app')

    let widthWindow = window.innerWidth
    let paddingLeft = 0

    if (widthWindow <= 1390 && this.login) app.style.marginTop = '80px'
    else app.style.marginTop = '0px'

    this.width = window.innerWidth
    if (this.width <= 1390 || !this.login) {
      containerAll.style.width = '100%'
      containerAll.style.marginLeft = 'auto'
    } else {
      paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
      containerAll.style.width = 'calc(100% - 250px)'
      containerAll.style.marginLeft = paddingLeft + 'px'
    }

    window.addEventListener('resize', () => {
      widthWindow = window.innerWidth

      if (widthWindow <= 1390 && this.login) app.style.marginTop = '80px'
      else app.style.marginTop = '0px'

      this.width = window.innerWidth
      if (this.width <= 1390 || !this.login) {
        containerAll.style.width = '100%'
        containerAll.style.marginLeft = 'auto'
      } else {
        paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
        containerAll.style.width = 'calc(100% - 250px)'
        containerAll.style.marginLeft = paddingLeft + 'px'
      }
    })

    if (this.$store.state.general.themePreferences === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
      if (systemDark) document.documentElement.classList.add('dark-mode')
    }
    if (this.$store.state.general.themePreferences === 'dark') {
      document.documentElement.classList.add('dark-mode')
    }
    if (this.$store.state.general.themePreferences === 'sepia') {
      document.documentElement.classList.add('sepia-mode')
    }
  },
}
</script>

<style scoped>
.settingApp {
  margin-top: 80px;
}
.darkThemeOverlay {
  background: rgba(139, 139, 139, 0.63);
}
.sepiaThemeOverlay {
  background: #fbf1d6a2;
}
</style>
