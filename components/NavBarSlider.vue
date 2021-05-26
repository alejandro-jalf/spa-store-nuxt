<template>
  <div>
    <b-sidebar
      id="sidebar-1"
      title="SPA"
      :backdrop="true"
      :text-variant="textSlider"
      :bg-variant="bgSlider"
    >
      <div class="px-3 py-5 overflow-auto">
        <div class="d-flex justify-content-center">
          <b-avatar variant="info" size="6rem"></b-avatar>
        </div>
        <div class="d-flex justify-content-around">
          <div>
            <strong>{{ userName }}</strong>
          </div>
        </div>
        <b-list-group class="mt-2 mb-5">
          <b-list-group-item
            v-for="(tab, indexTab) in tabsAccess"
            :key="indexTab"
            :to="tab.path"
            :active="isActive(tab.nickname)"
            :variant="variantList"
            :disabled="false"
            replace
            class="d-flex justify-content-between align-items-center"
          >
            <div class="any">
              <b-icon-house-door-fill
                v-if="tab.icon === 'house-door-fill'"
                class="mr-1"
              ></b-icon-house-door-fill>
              <b-icon-percent
                v-else-if="tab.icon === 'percent'"
                class="mr-1"
              ></b-icon-percent>
              <b-icon-shop
                v-else-if="tab.icon === 'shop'"
                class="mr-1"
              ></b-icon-shop>
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
            </div>
          </b-list-group-item>
        </b-list-group>
        <b-button
          block
          :variant="variantCloseSesion"
          @click="logout([$store, $router])"
        >
          <b-icon-power></b-icon-power>
          Cerrar sesion
        </b-button>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
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
  },
  props: {
    logout: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      tabs: this.$store.state.general.listTabs,
      userName: this.$store.state.user.name,
    }
  },
  computed: {
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
    variantCloseSesion() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'outline-info'
        return 'info'
      }
      return this.$store.state.general.themePreferences === 'dark'
        ? 'outline-info'
        : 'info'
    },
    variantList() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'dark'
        return 'light'
      }
      return this.$store.state.general.themePreferences === 'dark'
        ? 'dark'
        : 'light'
    },
    textSlider() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'light'
        return 'dark'
      }
      return this.$store.state.general.themePreferences === 'dark'
        ? 'light'
        : 'dark'
    },
    bgSlider() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'dark'
        return 'light'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'dark'
      else return 'light'
    },
  },
  methods: {
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
  },
}
</script>

<style scoped>
.sepia-sliderbar {
  background: #fdf0d0;
  color: #271601;
}
.dark-sliderbar {
  background: #292929;
  color: #f3f3f3;
}
</style>
