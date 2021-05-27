<template>
  <div class="NavBarLeft">
    <div class="text-center mb-3 mt-3">
      <img src="../assets/cesta.png" width="40px" height="40px" />
      SPA
      <br />
      <strong>{{ userName }}</strong>
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
        <b-icon-caret-left-fill
          v-if="isActive(tab.nickname)"
          :class="themeThis"
        ></b-icon-caret-left-fill>
      </b-list-group-item>
    </div>
    <b-button class="btnCloseSesion" variant="outline-info" @click="logout()">
      <b-icon-power></b-icon-power>
      Cerrar sesion
    </b-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  BIconCaretLeftFill,
  BIconHouseDoorFill,
  BIconPercent,
  BIconShop,
  BIconPeopleFill,
  BIconCloudCheckFill,
  BIconCollection,
  BIconAsterisk,
  BIconBoxSeam,
  BIconPower,
} from 'bootstrap-vue'

export default {
  components: {
    BIconCaretLeftFill,
    BIconHouseDoorFill,
    BIconPercent,
    BIconShop,
    BIconPeopleFill,
    BIconCloudCheckFill,
    BIconCollection,
    BIconAsterisk,
    BIconBoxSeam,
    BIconPower,
  },
  data() {
    return {
      tabs: this.$store.state.general.listTabs,
      userName: this.$store.state.user.name,
    }
  },
  computed: {
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
        return !!findTab
      })
      return tabsPermission
    },
  },
  methods: {
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
  height: 80%;
}

.item-tab {
  background: rgb(61, 61, 61);
  color: #fff;
}

.item-tab-active {
  background: rgba(0, 183, 255, 0.705);
  color: #fff;
}

.this {
  position: absolute;
  right: -21px;
  top: 0px;
  width: 50px;
  height: 50px;
  color: #f3f5f4;
}

.thisThemeDark {
  color: #161616;
}

.thisThemeSepia {
  color: #f1e7d0;
}

.btnCloseSesion {
  position: absolute;
  width: 220px;
  bottom: 10px;
  left: 15px;
}
</style>
