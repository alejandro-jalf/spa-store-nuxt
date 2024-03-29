<template>
  <div id="app">
    <b-overlay
      :show="loading > 0"
      rounded="sm"
      spinner-variant="primary"
      :class="themeOverlay"
      class="cursor-pointer"
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
    <alert-option></alert-option>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Vue from 'vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import NavBar from '../components/NavBar.vue'
import Alert from '../components/Alert'
import AlertOption from '../components/AlertOption'
import NavBarLeft from '../components/NavBarLeft'
import NavBarBottom from '../components/NavBarBottom'

Vue.use(BootstrapVueIcons)

export default {
  components: {
    NavBar,
    Alert,
    AlertOption,
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
    barCodeCodificador() {
      return this.$store.state.codificadorarticulos.barCode
    },
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
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
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
    let paddingLeft = 0

    const setTheme = () => {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) document.documentElement.classList.add('dark-mode')
      } else if (this.$store.state.general.themePreferences === 'dark')
        document.documentElement.classList.add('dark-mode')
      else if (this.$store.state.general.themePreferences === 'sepia')
        document.documentElement.classList.add('sepia-mode')
    }

    const updateDataUser = async () => {
      if (
        this.$store.state.user.sesionInit === 'null' &&
        this.$store.state.user.login
      ) {
        this.setLoading(true)
        await this.refreshDataUser([this.$store, this.$router])
        this.setLoading(false)
        this.setSesionInit('Iniciada')
      }
    }

    const setMarginPrincipal = (widthWindow) => {
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
    }

    const setWidthContainerAll = (widthWindow) => {
      if (this.width <= 1390 || !this.login) {
        containerAll.style.width = '100%'
        containerAll.style.marginLeft = 'auto'
      } else {
        paddingLeft = 250 + parseInt((widthWindow - 1390) / 2)
        containerAll.style.width = 'calc(100% - 250px)'
        containerAll.style.marginLeft = paddingLeft + 'px'
      }
    }

    const setScrollNavBarBottom = () => {
      if (
        window.innerWidth < 992 &&
        this.$store.state.general.barraInferior === 'true'
      ) {
        const tabs = this.tabsAccess()
        const tabActual = this.$store.state.general.tabActual
        const itemTab = window.document
          .querySelector('.item-tab')
          .getBoundingClientRect()
        const containerScroll = window.document.querySelector(
          '.container-items-overflow'
        )

        const positionActual = tabs.findIndex(
          (tab) => tab.nickname === tabActual
        )

        if (positionActual * itemTab.width > containerScroll.scrollLeft)
          containerScroll.scrollLeft = tabs.length * itemTab.width
      }
    }

    const setSizeSliderAnimation = (widthWindow) => {
      document.querySelector('.slider').style.right = 'none'
      document.querySelector('.slider').style.left = widthWindow + 30 + 'px'
    }

    const eventKeyUp = (evt) => {
      if (this.$store.state.general.tabActual.trim() === 'checadorprecios') {
        if (parseInt(evt.key) >= 0 && parseInt(evt.key) <= 9)
          this.barCode += evt.key
        else if (evt.key === 'Enter') this.getArticleByCodeOrArticle()
      } else if (
        this.$store.state.general.tabActual.trim() === 'codificadorarticulos'
      ) {
        if (parseInt(evt.key) >= 0 && parseInt(evt.key) <= 9) {
          const code = this.barCodeCodificador + evt.key
          this.setBarCode(code)
        } else if (evt.key === 'Enter') this.getArticleCodificador()
      }
    }

    const eventKeyDown = (evt) => {
      if (this.$store.state.general.alert.show) {
        if (evt.key === 'Enter') this.hideAlertDialog()
      }
    }

    this.setWidthWindow(window.innerWidth)
    setTheme()
    updateDataUser()
    setScrollNavBarBottom()
    setMarginPrincipal(window.innerWidth)
    setWidthContainerAll(window.innerWidth)

    window.addEventListener('keyup', eventKeyUp)
    window.addEventListener('keydown', eventKeyDown)
    document.addEventListener('touchstart', this.handleTouchStart, false)
    document.addEventListener('touchmove', this.handleTouchMove, false)
    document.addEventListener('touchend', this.handleEnd, false)
    window.addEventListener('scroll', () => {
      this.changeScrollScreenY(window.scrollY)
    })
    window.addEventListener('resize', () => {
      setMarginPrincipal(window.innerWidth)
      setWidthContainerAll(window.innerWidth)
      this.setWidthWindow(window.innerWidth)
      setSizeSliderAnimation(window.innerWidth)
    })
  },
  methods: {
    ...mapMutations({
      hideAlertDialog: 'general/hideAlertDialog',
      setWidthWindow: 'general/setWidthWindow',
      setLoading: 'general/setLoading',
      changeScrollScreenY: 'general/changeScrollScreenY',
      setSesionInit: 'user/setSesionInit',
      setBarCode: 'codificadorarticulos/setBarCode',
      setCodeSend: 'codificadorarticulos/setCodeSend',
    }),

    ...mapActions({
      refreshDataUser: 'user/refreshDataUser',
      updateArticle: 'checadorprecios/updateArticle',
      updateArticleCodificador: 'codificadorarticulos/updateArticle',
    }),

    async getArticleByCodeOrArticle() {
      this.setLoading(true)
      await this.updateArticle([
        this.$store.state.checadorprecios.sucursal,
        this.barCode,
      ])

      this.barCode = ''
      this.setLoading(false)
    },

    async getArticleCodificador() {
      this.setLoading(true)
      await this.updateArticleCodificador([
        this.$store.state.codificadorarticulos.sucursal,
        this.barCodeCodificador,
      ])

      const codeSend = this.barCodeCodificador
      this.setCodeSend(codeSend)
      this.setBarCode('')
      this.setLoading(false)
    },

    tabsAccess() {
      const listTabs = this.$store.state.general.listTabs.reduce(
        (acumTab, tab) => {
          const childrens = [...tab.childrens]
          if (childrens.length > 0) {
            childrens.forEach((children) => acumTab.push(children))
          } else acumTab.push(tab)
          return acumTab
        },
        []
      )
      const user = this.$store.state.user.user
      // const tabs = this.$store.state.general.listTabs

      const tabsPermission = listTabs.filter((tab) => {
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
      if (!this.$store.state.general.moveTouch) return false
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
        this.loading <= 0 &&
        !this.$store.state.general.alert.show &&
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

        const positionActual = tabs.findIndex((tab) => tab.name === tabActual)
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
      if (this.$store.state.general.moveTouch) {
        const firstTouch = this.getTouches(evt)[0]
        this.xDown = firstTouch.clientX
        this.yDown = firstTouch.clientY
      }
    },

    handleTouchMove(evt) {
      if (!this.xDown || !this.yDown) return
      if (!this.$store.state.general.moveTouch) return false
      const slider = document.querySelector('.slider')
      const posYMove = window.innerHeight - this.yDown
      const barraInferior = this.$store.state.general.barraInferior

      const xUp = evt.touches[0].clientX
      const yUp = evt.touches[0].clientY

      const xDiff = this.xDown - xUp
      const yDiff = this.yDown - yUp

      const aplyTheme = (validation) => {
        if (this.$store.state.general.themePreferences === 'system') {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches)
            if (validation) slider.style.background = 'rgba(22, 22, 22, 0.698)'
            else slider.style.background = 'rgba(1, 1, 1, 0.698)'
          else if (validation)
            slider.style.background = 'rgba(179, 179, 179, 0.698)'
          else slider.style.background = 'rgba(155, 155, 155, 0.698)'
        } else if (this.$store.state.general.themePreferences === 'dark') {
          if (validation) slider.style.background = 'rgba(22, 22, 22, 0.698)'
          else slider.style.background = 'rgba(1, 1, 1, 0.698)'
        } else if (this.$store.state.general.themePreferences === 'sepia') {
          if (validation) slider.style.background = 'rgba(235, 238, 221, 0.698)'
          else slider.style.background = 'rgba(204, 206, 195, 0.698)'
        } else if (validation)
          slider.style.background = 'rgba(179, 179, 179, 0.698)'
        else slider.style.background = 'rgba(155, 155, 155, 0.698)'
      }

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        slider.style.right = 'none'
        const validation = !!(
          posYMove > 55 &&
          barraInferior === 'true' &&
          this.loading <= 0 &&
          !this.$store.state.general.alert.show &&
          window.innerWidth < 992
        )
        if (xDiff > 0) {
          if (validation) {
            slider.style.left = window.innerWidth - xDiff + 'px'
            aplyTheme(xDiff <= 50)
          }
          this.moveTouch = 'left'
        } else {
          if (validation) {
            slider.style.left = -(window.innerWidth + xDiff) + 'px'
            aplyTheme(xDiff > -50)
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
</style>
