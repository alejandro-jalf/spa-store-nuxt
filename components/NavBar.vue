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
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>
                <b-avatar></b-avatar>
                {{ userName }}
              </em>
            </template>
            <b-dropdown-item @click="logout([$store, $router])">
              Cerrar sesion
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <NavBarSlider :logout="logout" />
  </div>
</template>

<script>
import { BIconGeoFill } from 'bootstrap-vue'
import { mapActions } from 'vuex'
import NavBarSlider from './NavBarSlider'

export default {
  components: {
    NavBarSlider,
    BIconGeoFill,
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
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
    ...mapActions({
      logout: 'user/logout',
    }),
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
</style>
