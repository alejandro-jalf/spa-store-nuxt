<template>
  <div class="NavBarLeft">
    <div class="text-center mb-3 mt-3">
      <img src="../assets/cesta.png" width="40px" height="40px" />
      SPA
      <br />
      <strong>{{ userName }}</strong>
    </div>
    <div v-if="atajoTheme === 'true'" class="mb-4 text-center">
      <b-button
        variant="outline-light"
        :pressed="themPreferencesSys"
        @click="setThemePreferences('system')"
      >
        <b-icon-tv-fill></b-icon-tv-fill>
      </b-button>
      <b-button
        variant="outline-light"
        :pressed="themPreferencesDar"
        @click="setThemePreferences('dark')"
      >
        <b-icon-moon></b-icon-moon>
      </b-button>
      <b-button
        variant="outline-light"
        :pressed="themPreferencesLig"
        @click="setThemePreferences('light')"
      >
        <b-icon-brightness-high-fill></b-icon-brightness-high-fill>
      </b-button>
      <b-button
        variant="outline-light"
        :pressed="themPreferencesSep"
        @click="setThemePreferences('sepia')"
      >
        <b-icon-cup-fill></b-icon-cup-fill>
      </b-button>
    </div>
    <div class="container-item-list">
      <b-list-group-item
        v-for="(tab, indexTab) in tabsAccess"
        :key="indexTab"
        :to="tab.path"
        replace
        :class="isActiveItem(tab.nickname)"
      >
        <b-icon-house-door-fill
          v-if="tab.icon === 'house-door-fill'"
          class="mr-1"
        ></b-icon-house-door-fill>
        <b-icon-percent
          v-else-if="tab.icon === 'percent'"
          class="mr-1"
        ></b-icon-percent>
        <b-icon-shop v-else-if="tab.icon === 'shop'" class="mr-1"></b-icon-shop>
        <b-icon-people-fill
          v-else-if="tab.icon === 'people-fill'"
          class="mr-1"
        ></b-icon-people-fill>
        <b-icon-cloud-check-fill
          v-else-if="tab.icon === 'cloud-check-fill'"
          class="mr-1"
        ></b-icon-cloud-check-fill>
        <b-icon-collection
          v-else-if="tab.icon === 'collection'"
          class="mr-1"
        ></b-icon-collection>
        <b-icon-box-seam
          v-else-if="tab.icon === 'box-seam'"
          class="mr-1"
        ></b-icon-box-seam>
        <b-icon-asterisk v-else class="mr-1"></b-icon-asterisk>
        {{ tab.nickname }}
      </b-list-group-item>
    </div>
    <div class="background-btn-close"></div>
    <b-button
      class="btnCloseSesion"
      variant="outline-info"
      @click="logout([$store, $router])"
    >
      <b-icon-power></b-icon-power>
      Cerrar sesion
    </b-button>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import {
  BIconHouseDoorFill,
  BIconPercent,
  BIconShop,
  BIconPeopleFill,
  BIconCloudCheckFill,
  BIconCollection,
  BIconAsterisk,
  BIconBoxSeam,
  BIconPower,
  BIconMoon,
  BIconBrightnessHighFill,
  BIconCupFill,
  BIconTvFill,
} from 'bootstrap-vue'

export default {
  components: {
    BIconHouseDoorFill,
    BIconPercent,
    BIconShop,
    BIconPeopleFill,
    BIconCloudCheckFill,
    BIconCollection,
    BIconAsterisk,
    BIconBoxSeam,
    BIconPower,
    BIconMoon,
    BIconBrightnessHighFill,
    BIconCupFill,
    BIconTvFill,
  },
  data() {
    return {
      tabs: this.$store.state.general.listTabs,
      userName: this.$store.state.user.name,
    }
  },
  computed: {
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
    atajoTheme() {
      return this.$store.state.general.atajoTheme
    },
    themeThis() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'this thisThemeDark'
        return 'this'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'this thisThemeDark'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'this thisThemeSepia'
      else return 'this'
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
  methods: {
    ...mapMutations({
      setThemePreferences: 'general/setThemePreferences',
    }),
    ...mapActions({
      logout: 'user/logout',
    }),
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
    isActiveItem(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
        ? 'item-tab-active'
        : 'item-tab'
    },
  },
}
</script>

<style scoped>
.NavBarLeft {
  color: #fff;
  background: rgb(61, 61, 61);
  position: fixed;
  top: 0px;
  left: 0px;
  width: 250px;
  height: calc(100% + 2px);
  z-index: 4;
}

.container-item-list {
  padding-bottom: 80px;
  overflow: auto;
  height: 71%;
}

.item-tab {
  background: rgb(61, 61, 61);
  color: #fff;
}

.item-tab-active {
  background: rgba(0, 183, 255, 0.705);
  color: #fff;
}
.thisThemeDark {
  color: #161616;
}

.thisThemeSepia {
  color: #f1e7d0;
}

.background-btn-close {
  position: absolute;
  width: 100%;
  height: 60px;
  background: rgb(61, 61, 61);
  z-index: 3;
  bottom: 0px;
  left: 0px;
  border-top: 1px solid rgb(82, 82, 82);
  box-shadow: 0px -3px 5px rgb(41, 41, 41);
}

.btnCloseSesion {
  position: absolute;
  width: 220px;
  bottom: 10px;
  left: 15px;
  z-index: 4;
}
</style>
