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
            <b-icon icon="geo-fill" />
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
          <span v-for="(tab, index) in tabsComplete" :key="index">
            <b-nav-item
              v-if="tab.childrens.length === 0"
              :to="tab.path"
              :active="isActive(tab.nickname)"
              replace
            >
              <b-icon :icon="tab.icon" />
              {{ tab.nickname }}
            </b-nav-item>
            <b-nav-item-dropdown v-else right>
              <template #button-content>
                <b-icon :icon="tab.icon" />
                {{ tab.nickname }}
              </template>
              <b-dropdown-item
                v-for="(child, indexChild) in tab.childrens"
                :key="indexChild"
                :to="child.path"
                :active="isActive(child.nickname)"
                replace
              >
                <b-icon :icon="child.icon" />
                {{ child.nickname }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </span>
        </b-navbar-nav>

        <b-dropdown
          v-if="tabsSplit.length > 0"
          ref="munuSplited"
          size="lg"
          :variant="variantLigth"
          no-caret
          right
        >
          <template #button-content>
            <b-icon icon="list-stars" />
          </template>
          <span v-for="(tab, indexSplit) in tabsSplit" :key="indexSplit">
            <b-dropdown-item
              v-if="tab.childrens.length === 0"
              :to="tab.path"
              :active="isActive(tab.nickname)"
              replace
            >
              {{ tab.nickname }}
            </b-dropdown-item>
            <div
              v-else
              class="dropdown-item item-submenu"
              @mouseenter="showSubMenu('sub' + tab.nickname)"
              @mouseleave="hideSubMenu"
            >
              <b-icon :icon="tab.icon" />
              {{ tab.nickname }}
              <b-icon icon="caret-down-fill" scale="0.7" />
              <b-list-group
                v-if="menuEnter('sub' + tab.nickname)"
                class="card-submenu"
              >
                <b-list-group-item
                  v-for="(child, indexChild) in tab.childrens"
                  :key="indexChild"
                  class="dropdown-item submenu-item"
                  :to="child.path"
                  :active="isActive(child.nickname)"
                  replace
                  @click="closeSubMenu"
                >
                  <b-icon :icon="child.icon" />
                  {{ child.nickname }}
                </b-list-group-item>
              </b-list-group>
            </div>
          </span>
        </b-dropdown>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown ref="submenu" right menu-class="p-0">
            <template #button-content>
              <em>
                <b-avatar></b-avatar>
              </em>
            </template>
            <div class="container-menu" :class="variantTheme">
              <div>
                <b-icon icon="person-circle" class="mr-3" />
                {{ userName }}
                <b-button
                  variant="link"
                  class="text-success p-0 float-right"
                  @click="updateDataUser"
                >
                  <b-icon icon="arrow-counterclockwise" />
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
                  @click="changeThemePreferences('system')"
                >
                  <b-icon icon="tv-fill" />
                  Sistema
                </b-button>
                <b-button
                  variant="outline-dark"
                  block
                  :pressed="themPreferencesDar"
                  class="text-left"
                  @click="changeThemePreferences('dark')"
                >
                  <b-icon icon="moon" />
                  Oscuro
                </b-button>
                <b-button
                  variant="outline-dark"
                  block
                  :pressed="themPreferencesLig"
                  class="text-left"
                  @click="changeThemePreferences('light')"
                >
                  <b-icon icon="brightness-high-fill" />
                  Claro
                </b-button>
                <b-button
                  variant="outline-dark"
                  block
                  :pressed="themPreferencesSep"
                  class="text-left"
                  @click="changeThemePreferences('sepia')"
                >
                  <b-icon icon="cup-fill" />
                  Sepia
                </b-button>
              </div>
              <div class="mt-5">
                <b-button
                  variant="link"
                  class="text-danger"
                  @click="logout([$store, $router])"
                >
                  <b-icon icon="power" />
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
import { mapActions, mapMutations } from 'vuex'
import utils from '../modules/utils'
import NavBarSlider from './NavBarSlider'

export default {
  components: {
    NavBarSlider,
  },
  data() {
    return {
      data: 0,
      display: 0,
      tabs: this.$store.state.general.listTabs,
      userName: this.$store.state.user.name,
      submenu: '',
    }
  },
  computed: {
    variantLigth() {
      if (this.$store.state.general.themePreferences === 'sepia')
        return 'outline-dark'
      else return 'outline-light'
    },
    tabsComplete() {
      const totalTabs =
        this.$store.state.general.widthWindow < 1200
          ? 6
          : this.$store.state.general.widthWindow < 1370
          ? 7
          : 8
      return this.tabsAccess.filter((tab, indexTab) => indexTab <= totalTabs)
    },
    tabsSplit() {
      const totalTabs =
        this.$store.state.general.widthWindow < 1200
          ? 6
          : this.$store.state.general.widthWindow < 1370
          ? 7
          : 8
      return this.tabsAccess.filter((tab, indexTab) => indexTab > totalTabs)
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeMenuBackground
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
      return this.$store.state.general.themesComponents.themeNav
    },
    tabActual() {
      return this.$store.state.general.tabActual
    },
    tabsAccess() {
      // const user = this.$store.state.user.user
      // const tabsPermission = this.tabs.filter((tab) => {
      //   const arrayTabs = user.access_to_user.trim().split(',')
      //   const findTab = arrayTabs.find(
      //     (ftab) => tab.name.trim().toLowerCase() === ftab.trim().toLowerCase()
      //   )
      //   if (tab.name.trim().toLowerCase() === 'index') return true
      //   return !!findTab
      // })
      // return tabsPermission
      const user = this.$store.state.user.user
      const arrayTabs = user.access_to_user.trim().split(',')
      const tabsSystem = [...this.$store.state.general.listTabs]
      const tabsPermission = tabsSystem.reduce((acumTab, tab) => {
        if (tab.childrens.length === 0) {
          const findTab = arrayTabs.find(
            (ftab) =>
              tab.name.trim().toLowerCase() === ftab.trim().toLowerCase()
          )
          if (findTab) acumTab.push(tab)
        } else {
          const childrensFinded = tab.childrens.reduce((acumChild, child) => {
            const findTab = arrayTabs.find(
              (ftab) =>
                child.name.trim().toLowerCase() === ftab.trim().toLowerCase()
            )
            if (findTab) acumChild.push(child)
            return acumChild
          }, [])
          if (childrensFinded.length > 0) {
            const tabCopy = { ...tab }
            tabCopy.childrens = childrensFinded
            acumTab.push(tabCopy)
          }
        }
        return acumTab
      }, [])
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
    showSubMenu(submenu = '') {
      this.submenu = submenu
    },
    hideSubMenu() {
      this.submenu = ''
    },
    menuEnter(submenu) {
      return this.submenu === submenu
    },
    closeSubMenu() {
      this.$refs.munuSplited.hide(true)
    },
    closeMenu() {
      this.$refs.submenu.hide(true)
    },
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
    ...mapActions({
      logout: 'user/logout',
      refreshDataUser: 'user/refreshDataUser',
      changeThemePreferences: 'general/changeThemePreferences',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
    }),
    async updateDataUser() {
      this.setLoading(true)
      await this.refreshDataUser([
        this.$store,
        this.$router,
        this.$bvToast,
        utils,
      ])
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

.item-submenu {
  position: relative;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.card-submenu {
  position: absolute;
  right: 100%;
  top: 0px;
  width: 220px;
}

.submenu-item {
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
