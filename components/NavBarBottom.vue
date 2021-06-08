<template>
  <div class="container-tabs" :class="backgroundMenu">
    <div class="container-items-overflow">
      <div class="container-items">
        <b-link
          v-for="(tab, indexTabBottom) in tabsAccess"
          :key="indexTabBottom"
          :to="tab.path"
          replace
          :class="isActiveItem(tab.nickname)"
        >
          <b-icon-house-door-fill v-if="tab.icon === 'house-door-fill'">
          </b-icon-house-door-fill>
          <b-icon-percent v-else-if="tab.icon === 'percent'"></b-icon-percent>
          <b-icon-shop v-else-if="tab.icon === 'shop'"></b-icon-shop>
          <b-icon-people-fill v-else-if="tab.icon === 'people-fill'">
          </b-icon-people-fill>
          <b-icon-cloud-check-fill v-else-if="tab.icon === 'cloud-check-fill'">
          </b-icon-cloud-check-fill>
          <b-icon-collection v-else-if="tab.icon === 'collection'">
          </b-icon-collection>
          <b-icon-box-seam
            v-else-if="tab.icon === 'box-seam'"
          ></b-icon-box-seam>
          <b-icon-asterisk v-else></b-icon-asterisk>
          <div v-if="visibleNickname" class="nickname">{{ tab.nickname }}</div>
        </b-link>
      </div>
    </div>
    <b-dropdown
      class="more-tabs"
      no-caret
      variant="link"
      menu-class="p-0"
      toggle-class="text-white"
    >
      <template #button-content>
        <b-icon-three-dots-vertical></b-icon-three-dots-vertical>
      </template>
      <div class="container-menu" :class="variantTheme">
        <div>
          <b-icon-person-circle class="mr-3"></b-icon-person-circle>
          {{ userName }}
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
        <div class="text-right mt-5">
          <b-button variant="link" @click="logout([$store, $router])">
            <b-icon-power></b-icon-power>
            Cerrar sesion
          </b-button>
        </div>
      </div>
    </b-dropdown>
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
  BIconThreeDotsVertical,
  BIconPersonCircle,
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
    BIconThreeDotsVertical,
    BIconPersonCircle,
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
      visibleNickname: true,
    }
  },
  computed: {
    backgroundMenu() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'bg-dark'
        return 'bg-info'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'bg-dark'
      else return 'bg-info'
    },
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
    let countTabsAccess = this.tabsAccess.length
    const itemsTab = document.querySelectorAll('.item-tab')
    const moreActions = document.querySelector('.more-tabs')
    let widthWindow = window.innerWidth
    let widthItemTab = parseInt((widthWindow - 50) / countTabsAccess)

    for (let x = 0; x < itemsTab.length; x++) {
      if (widthItemTab > 200) itemsTab[x].style.width = '200px'
      else if (widthItemTab < 60) itemsTab[x].style.width = '60px'
      else itemsTab[x].style.width = widthItemTab + 'px'
      if (widthItemTab >= 106) {
        this.visibleNickname = true
        itemsTab[x].style.paddingTop = '2px'
        itemsTab[x].style.paddingBottom = '0px'
      } else {
        this.visibleNickname = false
        itemsTab[x].style.paddingTop = '12px'
        itemsTab[x].style.paddingBottom = '8px'
      }
    }

    if (widthWindow - 50 < countTabsAccess * itemsTab[0].clientWidth)
      moreActions.style.boxShadow = '0px 5px 3px 3px rgba(90, 90, 90, 0.5)'
    else moreActions.style.boxShadow = '0px 5px 3px 3px rgba(90, 90, 90, 0)'

    window.addEventListener('resize', () => {
      widthWindow = window.innerWidth
      countTabsAccess = this.tabsAccess.length
      widthItemTab = parseInt((widthWindow - 50) / countTabsAccess)

      for (let x = 0; x < itemsTab.length; x++) {
        if (widthItemTab > 200) itemsTab[x].style.width = '200px'
        else if (widthItemTab < 60) itemsTab[x].style.width = '60px'
        else itemsTab[x].style.width = widthItemTab + 'px'
        if (widthItemTab >= 106) {
          this.visibleNickname = true
          itemsTab[x].style.paddingTop = '2px'
          itemsTab[x].style.paddingBottom = '0px'
        } else {
          this.visibleNickname = false
          itemsTab[x].style.paddingTop = '12px'
          itemsTab[x].style.paddingBottom = '8px'
        }
      }

      if (widthWindow - 50 < countTabsAccess * itemsTab[0].clientWidth)
        moreActions.style.boxShadow = '0px 5px 3px 3px rgba(122, 122, 122, 1)'
      else
        moreActions.style.boxShadow = '0px 5px 3px 3px rgba(122, 122, 122, 0)'
    })
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
    }),
    ...mapMutations({
      setThemePreferences: 'general/setThemePreferences',
    }),
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
    isActiveItem(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
        ? 'item-tab item-tab-active'
        : 'item-tab'
    },
  },
}
</script>

<style scoped>
.container-tabs {
  position: fixed;
  z-index: 2;
  bottom: 0px;
  left: 0px;
  color: #fff;
  height: 52px;
  width: 100%;
  text-align: center;
}

.container-items-overflow {
  width: calc(100% - 50px);
  overflow: auto;
}

.container-items {
  width: max-content;
  height: 100%;
}

.item-tab {
  font-size: 20px;
  display: inline-block;
  width: 106px;
  height: 100%;
  padding-top: 1px;
  color: rgb(212, 212, 212);
}

.item-tab-active {
  color: rgb(255, 255, 255);
  border-bottom: 2px solid rgb(255, 255, 255);
}

.nickname {
  font-size: 12px;
}

.more-tabs {
  position: fixed;
  z-index: 3;
  right: 0px;
  bottom: 0px;
  width: 50px;
  height: 52px;
  font-size: 25px;
  padding-top: 0px;
}

.container-menu {
  width: 300px;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 1px 3px 5px 1px rgb(131, 131, 131);
}

.menuDark {
  background: rgb(211, 211, 211);
}
</style>
