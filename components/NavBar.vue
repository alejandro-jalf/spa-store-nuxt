<template>
  <div>
    <b-navbar
      toggleable="lg"
      :type="typeNav"
      :variant="variantNav"
      class="nbar"
    >
      <b-navbar-brand>
        <img src="../assets/cesta.png" width="30px" height="30px" />
        SPA
      </b-navbar-brand>

      <b-navbar-nav v-if="display > 0" class="mr-auto TabActual">
        <b-nav-item>
          <b-badge variant="light" class="p-2 text-uppercase mr-2">
            <b-icon-geo-fill></b-icon-geo-fill>
            {{ tabActual }}
          </b-badge>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-toggle
        id="toggle"
        v-b-toggle.sidebar-1
        target="nav-collapse1"
      ></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            v-for="(tab, index) in tabsAccess"
            :key="index"
            :to="tab.path"
            :active="isActive(tab.nickname)"
            replace
          >
            {{ tab.nickname }}
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown ref="submenu" right menu-class="p-0">
            <template #button-content>
              <em>
                <b-avatar></b-avatar>
              </em>
            </template>
            <div class="container-menu" :class="variantTheme">
              <div>
                <b-icon-person-circle class="mr-3"></b-icon-person-circle>
                {{ userName }}
                <b-button
                  variant="link"
                  class="text-success p-0 float-right"
                  @click="updateDataUser"
                >
                  <b-icon-arrow-counterclockwise />
                  Actualizar
                </b-button>
              </div>
              <hr class="mt-2" />
              <div>
                <div>Color</div>
                <b-button
                  variant="outline-dark"
                  block
                  :pressed="themPreferencesSys"
                  class="text-left"
                  @click="setThemePreferences('system')"
                >
                  <b-icon-tv-fill></b-icon-tv-fill>
                  Sistema
                </b-button>
                <b-button
                  variant="outline-dark"
                  block
                  :pressed="themPreferencesDar"
                  class="text-left"
                  @click="setThemePreferences('dark')"
                >
                  <b-icon-moon></b-icon-moon>
                  Oscuro
                </b-button>
                <b-button
                  variant="outline-dark"
                  block
                  :pressed="themPreferencesLig"
                  class="text-left"
                  @click="setThemePreferences('light')"
                >
                  <b-icon-brightness-high-fill></b-icon-brightness-high-fill>
                  Claro
                </b-button>
                <b-button
                  variant="outline-dark"
                  block
                  :pressed="themPreferencesSep"
                  class="text-left"
                  @click="setThemePreferences('sepia')"
                >
                  <b-icon-cup-fill></b-icon-cup-fill>
                  Sepia
                </b-button>
              </div>
              <div class="mt-5">
                <b-button
                  variant="link"
                  class="text-danger"
                  @click="logout([$store, $router])"
                >
                  <b-icon-power></b-icon-power>
                  Cerrar sesion
                </b-button>
                <b-button variant="link" class="float-right" @click="closeMenu">
                  Cerrar
                </b-button>
              </div>
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <NavBarSlider :logout="logout" :refresh-data-user="refreshDataUser" />
  </div>
</template>

<script>
import {
  BIconGeoFill,
  BIconPower,
  BIconMoon,
  BIconBrightnessHighFill,
  BIconCupFill,
  BIconTvFill,
  BIconPersonCircle,
  BIconArrowCounterclockwise,
} from 'bootstrap-vue'
import { mapActions, mapMutations } from 'vuex'
import NavBarSlider from './NavBarSlider'

export default {
  components: {
    NavBarSlider,
    BIconGeoFill,
    BIconPower,
    BIconMoon,
    BIconBrightnessHighFill,
    BIconCupFill,
    BIconTvFill,
    BIconPersonCircle,
    BIconArrowCounterclockwise,
  },
  data() {
    return {
      data: 0,
      display: 0,
      tabs: this.$store.state.general.listTabs,
      userName: this.$store.state.user.name,
    }
  },
  computed: {
    variantTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'menuDark'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'menuDark'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaBodyCard'
      else return ''
    },
    themPreferencesSys() {
      return this.$store.state.general.themePreferences === 'system'
    },
    themPreferencesDar() {
      return this.$store.state.general.themePreferences === 'dark'
    },
    themPreferencesLig() {
      return this.$store.state.general.themePreferences === 'light'
    },
    themPreferencesSep() {
      return this.$store.state.general.themePreferences === 'sepia'
    },
    typeNav() {
      return this.$store.state.general.themePreferences === 'sepia'
        ? 'light'
        : 'dark'
    },
    variantNav() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'dark'
        return 'info'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'dark'
      else return 'info'
    },
    tabActual() {
      return this.$store.state.general.tabActual
    },
    tabsAccess() {
      const user = this.$store.state.user.user
      const tabsPermission = this.tabs.filter((tab) => {
        const arrayTabs = user.access_to_user.trim().split(',')
        const findTab = arrayTabs.find(
          (ftab) => tab.name.trim().toLowerCase() === ftab.trim().toLowerCase()
        )
        if (tab.name.trim().toLowerCase() === 'index') return true
        return !!findTab
      })
      return tabsPermission
    },
  },
  mounted() {
    const btnToggle = document.getElementById('toggle')
    this.display = btnToggle.offsetTop

    const instancia = this
    window.addEventListener('resize', function () {
      const display = btnToggle.offsetTop
      instancia.display = display
    })
  },
  methods: {
    closeMenu() {
      this.$refs.submenu.hide(true)
    },
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
    ...mapActions({
      logout: 'user/logout',
      refreshDataUser: 'user/refreshDataUser',
    }),
    ...mapMutations({
      setThemePreferences: 'general/setThemePreferences',
      setLoading: 'general/setLoading',
    }),
    async updateDataUser() {
      this.setLoading(true)
      await this.refreshDataUser([this.$store, this.$router])
      this.setLoading(false)
    },
  },
}
</script>

<style scoped>
.TabActual {
  position: absolute;
  top: 35px;
  left: 50px;
}

.nbar {
  position: fixed;
  z-index: 5;
  width: 100%;
  top: 0px;
  left: 0px;
}

.container-menu {
  width: 300px;
  padding: 10px;
  border-radius: 3px;
}

.menuDark {
  background: rgb(211, 211, 211);
}
</style>
