<template>
  <div class="NavBarLeft">
    <div class="text-center mb-3 mt-3">
      <img src="../assets/cesta.png" width="40px" height="40px" />
      SPA
      <br />
      <strong>{{ userName }}</strong>
      <b-button
        variant="outline-success"
        class="btnUpdate"
        @click="updateDataUser"
      >
        <b-icon icon="arrow-counterclockwise" />
        Actualizar informacion
      </b-button>
    </div>
    <div v-if="atajoTheme === 'true'" class="mb-4 text-center">
      <b-button
        variant="outline-light"
        :pressed="themPreferencesSys"
        @click="changeThemePreferences('system')"
      >
        <b-icon icon="tv-fill" />
      </b-button>
      <b-button
        variant="outline-light"
        :pressed="themPreferencesDar"
        @click="changeThemePreferences('dark')"
      >
        <b-icon icon="moon" />
      </b-button>
      <b-button
        variant="outline-light"
        :pressed="themPreferencesLig"
        @click="changeThemePreferences('light')"
      >
        <b-icon icon="brightness-high-fill" />
      </b-button>
      <b-button
        variant="outline-light"
        :pressed="themPreferencesSep"
        @click="changeThemePreferences('sepia')"
      >
        <b-icon icon="cup-fill" />
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
        <b-icon
          v-if="tab.icon !== 'stack-icon'"
          :icon="tab.icon"
          class="mr-1"
        />
        <b-iconstack v-else-if="tab.name === 'existenciasproveedor'">
          <b-icon stacked icon="collection" />
          <b-icon stacked icon="box-seam" shift-v="-1.5" scale="0.6" />
        </b-iconstack>
        {{ tab.nickname }}
      </b-list-group-item>
    </div>
    <div class="background-btn-close"></div>
    <b-button
      class="btnCloseSesion"
      variant="outline-info"
      @click="logout([$store, $router])"
    >
      <b-icon icon="power" />
      Cerrar sesion
    </b-button>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import utils from '../modules/utils'

export default {
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
      setLoading: 'general/setLoading',
    }),
    ...mapActions({
      logout: 'user/logout',
      refreshDataUser: 'user/refreshDataUser',
      changeThemePreferences: 'general/changeThemePreferences',
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
.btnUpdate {
  margin-top: 8px;
  width: 220px;
}
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
