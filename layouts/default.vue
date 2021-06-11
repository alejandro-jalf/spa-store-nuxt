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
    <div class="slider"></div>
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
import { mapMutations } from 'vuex'
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
      xDown: null,
      yDown: null,
      moveTouch: null,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    barraInferior() {
      const app = document.querySelector('#app')
      const widthWindow = window.innerWidth
      if (app) {
        if (widthWindow > 1390) {
          app.style.marginTop = '0px'
          app.style.marginBottom = '0px'
        } else if (widthWindow >= 992) {
          if (this.login) {
            app.style.marginTop = '80px'
            app.style.marginBottom = '0px'
          } else {
            app.style.marginTop = '0px'
            app.style.marginBottom = '0px'
          }
        } else if (
          this.$store.state.general.barraInferior === 'true' &&
          this.login
        ) {
          app.style.marginTop = '0px'
          app.style.marginBottom = '70px'
        } else if (
          this.$store.state.general.barraInferior !== 'true' &&
          this.login
        ) {
          app.style.marginTop = '80px'
          app.style.marginBottom = '0px'
        } else {
          app.style.marginTop = '0px'
          app.style.marginBottom = '0px'
        }
      }
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

    if (widthWindow > 1390) {
      app.style.marginTop = '0px'
      app.style.marginBottom = '0px'
    } else if (widthWindow >= 992) {
      if (this.login) {
        app.style.marginTop = '80px'
        app.style.marginBottom = '0px'
      } else {
        app.style.marginTop = '0px'
        app.style.marginBottom = '0px'
      }
    } else if (this.barraInferior && this.login) {
      app.style.marginTop = '0px'
      app.style.marginBottom = '70px'
    } else if (!this.barraInferior && this.login) {
      app.style.marginTop = '80px'
      app.style.marginBottom = '0px'
    } else {
      app.style.marginTop = '0px'
      app.style.marginBottom = '0px'
    }

    this.setWidthWindow(window.innerWidth)
    if (this.width <= 1390 || !this.login) {
      containerAll.style.width = '100%'
      containerAll.style.marginLeft = 'auto'
    } else {
      paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
      containerAll.style.width = 'calc(100% - 250px)'
      containerAll.style.marginLeft = paddingLeft + 'px'
    }

    const tabs = this.tabsAccess()
    const tabActual = this.$store.state.general.tabActual
    const itemTab = window.document
      .querySelector('.item-tab')
      .getBoundingClientRect()
    const containerScroll = window.document.querySelector(
      '.container-items-overflow'
    )

    const positionActual = tabs.findIndex((tab) => tab.nickname === tabActual)

    if (positionActual * itemTab.width > containerScroll.scrollLeft)
      containerScroll.scrollLeft = tabs.length * itemTab.width

    document.addEventListener('touchstart', this.handleTouchStart, false)
    document.addEventListener('touchmove', this.handleTouchMove, false)
    document.addEventListener('touchend', this.handleEnd, false)

    window.addEventListener('resize', () => {
      widthWindow = window.innerWidth

      if (widthWindow > 1390) {
        app.style.marginTop = '0px'
        app.style.marginBottom = '0px'
      } else if (widthWindow >= 992) {
        if (this.login) {
          app.style.marginTop = '80px'
          app.style.marginBottom = '0px'
        } else {
          app.style.marginTop = '0px'
          app.style.marginBottom = '0px'
        }
      } else if (this.barraInferior && this.login) {
        app.style.marginTop = '0px'
        app.style.marginBottom = '70px'
      } else if (!this.barraInferior && this.login) {
        app.style.marginTop = '80px'
        app.style.marginBottom = '0px'
      } else {
        app.style.marginTop = '0px'
        app.style.marginBottom = '0px'
      }

      this.setWidthWindow(window.innerWidth)
      if (this.width <= 1390 || !this.login) {
        containerAll.style.width = '100%'
        containerAll.style.marginLeft = 'auto'
      } else {
        paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
        containerAll.style.width = 'calc(100% - 250px)'
        containerAll.style.marginLeft = paddingLeft + 'px'
      }

      document.querySelector('.slider').style.right = 'none'
      document.querySelector('.slider').style.left =
        window.innerWidth + 30 + 'px'
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
  methods: {
    ...mapMutations({
      setWidthWindow: 'general/setWidthWindow',
    }),

    tabsAccess() {
      const user = this.$store.state.user.user
      const tabs = this.$store.state.general.listTabs

      const tabsPermission = tabs.filter((tab) => {
        const arrayTabs = user.access_to_user.trim().split(',')
        const findTab = arrayTabs.find(
          (ftab) => tab.name.trim().toLowerCase() === ftab.trim().toLowerCase()
        )
        if (tab.name.trim().toLowerCase() === 'index') return true
        return !!findTab
      })
      return tabsPermission
    },

    getTouches(evt) {
      return evt.touches || evt.originalEvent.touches
    },

    handleEnd(evt) {
      const posYMove = window.innerHeight - this.yDown
      const posX = evt.changedTouches[0].clientX
      const diffAbsolute = Math.abs(this.xDown - posX)
      const widthWindow = this.$store.state.general.widthWindow
      const barraInferior = this.$store.state.general.barraInferior

      if (
        this.moveTouch !== null &&
        barraInferior === 'true' &&
        widthWindow < 992 &&
        posYMove > 55 &&
        (this.moveTouch === 'left' || this.moveTouch === 'right')
      ) {
        const containerScroll = window.document.querySelector(
          '.container-items-overflow'
        )
        const itemTab = window.document
          .querySelector('.item-tab')
          .getBoundingClientRect()

        const tabs = this.tabsAccess()
        const tabActual = this.$store.state.general.tabActual
        const countTabs = tabs.length

        const positionActual = tabs.findIndex(
          (tab) => tab.nickname === tabActual
        )
        let newPosition = 0

        if (this.moveTouch === 'right') {
          newPosition = positionActual - 1
          if (newPosition >= 0 && diffAbsolute > 50 && tabs[newPosition]) {
            this.$router.replace({ path: tabs[newPosition].path })
            const resultPosition = newPosition * itemTab.width
            if (containerScroll.scrollLeft > resultPosition) {
              containerScroll.scroll({
                top: 0,
                left: resultPosition,
                behavior: 'smooth',
              })
            }
          }
        } else {
          newPosition = positionActual + 1
          if (
            newPosition <= countTabs &&
            diffAbsolute > 50 &&
            tabs[newPosition]
          ) {
            this.$router.replace({ path: tabs[newPosition].path })
            if ((newPosition + 1) * itemTab.width > window.innerWidth - 50) {
              const resultPosition =
                (newPosition + 1) * itemTab.width - (window.innerWidth - 50)
              if (resultPosition > containerScroll.scrollLeft)
                containerScroll.scroll({
                  top: 0,
                  left: resultPosition,
                  behavior: 'smooth',
                })
            }
          }
        }
      }
      this.moveTouch = null
      this.xDown = null
      this.yDown = null
      document.querySelector('.slider').style.right = 'none'
      document.querySelector('.slider').style.left =
        window.innerWidth + 30 + 'px'
    },

    handleTouchStart(evt) {
      const firstTouch = this.getTouches(evt)[0]
      this.xDown = firstTouch.clientX
      this.yDown = firstTouch.clientY
    },

    handleTouchMove(evt) {
      if (!this.xDown || !this.yDown) return
      const slider = document.querySelector('.slider')
      const posYMove = window.innerHeight - this.yDown
      const barraInferior = this.$store.state.general.barraInferior

      const xUp = evt.touches[0].clientX
      const yUp = evt.touches[0].clientY

      const xDiff = this.xDown - xUp
      const yDiff = this.yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        slider.style.right = 'none'
        if (xDiff > 0) {
          if (
            posYMove > 55 &&
            barraInferior === 'true' &&
            window.innerHeight < 992
          ) {
            slider.style.left = window.innerWidth - xDiff + 'px'
            if (this.$store.state.general.themePreferences === 'system') {
              if (window.matchMedia('(prefers-color-scheme: dark)').matches)
                if (xDiff <= 50)
                  slider.style.background = 'rgba(22, 22, 22, 0.698)'
                else slider.style.background = 'rgba(1, 1, 1, 0.698)'
              else if (xDiff <= 50)
                slider.style.background = 'rgba(179, 179, 179, 0.698)'
              else slider.style.background = 'rgba(155, 155, 155, 0.698)'
            } else if (this.$store.state.general.themePreferences === 'dark') {
              if (xDiff <= 50)
                slider.style.background = 'rgba(22, 22, 22, 0.698)'
              else slider.style.background = 'rgba(1, 1, 1, 0.698)'
            } else if (this.$store.state.general.themePreferences === 'sepia') {
              if (xDiff <= 50)
                slider.style.background = 'rgba(235, 238, 221, 0.698)'
              else slider.style.background = 'rgba(204, 206, 195, 0.698)'
            } else if (xDiff <= 50)
              slider.style.background = 'rgba(179, 179, 179, 0.698)'
            else slider.style.background = 'rgba(155, 155, 155, 0.698)'
          }
          this.moveTouch = 'left'
        } else {
          if (
            posYMove > 55 &&
            barraInferior === 'true' &&
            window.innerHeight < 992
          ) {
            slider.style.left = -(window.innerWidth + xDiff) + 'px'
            if (this.$store.state.general.themePreferences === 'system') {
              if (window.matchMedia('(prefers-color-scheme: dark)').matches)
                if (xDiff > -50)
                  slider.style.background = 'rgba(22, 22, 22, 0.698)'
                else slider.style.background = 'rgba(1, 1, 1, 0.698)'
              else if (xDiff > -50)
                slider.style.background = 'rgba(179, 179, 179, 0.698)'
              else slider.style.background = 'rgba(155, 155, 155, 0.698)'
            } else if (this.$store.state.general.themePreferences === 'dark') {
              if (xDiff > -50)
                slider.style.background = 'rgba(22, 22, 22, 0.698)'
              else slider.style.background = 'rgba(1, 1, 1, 0.698)'
            } else if (this.$store.state.general.themePreferences === 'sepia') {
              if (xDiff > -50)
                slider.style.background = 'rgba(235, 238, 221, 0.698)'
              else slider.style.background = 'rgba(204, 206, 195, 0.698)'
            } else if (xDiff > -50)
              slider.style.background = 'rgba(179, 179, 179, 0.698)'
            else slider.style.background = 'rgba(155, 155, 155, 0.698)'
          }
          this.moveTouch = 'right'
        }
      } else if (yDiff > 0) {
        this.moveTouch = 'up'
      } else {
        this.moveTouch = 'down'
      }
    },
  },
}
</script>

<style scoped>
.slider {
  position: fixed;
  z-index: 2;
  top: 0px;
  right: 110%;
  width: 100%;
  height: calc(100% - 52px);
  background: rgba(22, 22, 22, 0.698);
  box-shadow: -1px 2px 10px 5px rgb(95, 95, 95);
}
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
