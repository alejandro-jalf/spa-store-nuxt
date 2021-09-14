<template>
  <div>
    <b-sidebar
      id="sidebar-1"
      title="SPA"
      :backdrop="true"
      :text-variant="textSlider"
      :bg-variant="bgSlider"
    >
      <div class="px-3 py-5 overflow-auto mb-3">
        <div class="d-flex justify-content-center">
          <b-avatar variant="info" size="6rem"></b-avatar>
        </div>
        <div class="d-flex justify-content-around">
          <div>
            <strong>{{ userName }}</strong>
          </div>
        </div>
        <div class="text-center">
          <b-button variant="success" class="btnUpdate" @click="updateDataUser">
            <b-icon icon="arrow-counterclockwise" />
            Actualizar informacion
          </b-button>
        </div>
        <div v-if="atajoTheme === 'true'" class="mt-2 text-center">
          <b-button
            :variant="variantTheme"
            :pressed="themPreferencesSys"
            @click="changeThemePreferences('system')"
          >
            <b-icon icon="tv-fill" />
          </b-button>
          <b-button
            :variant="variantTheme"
            :pressed="themPreferencesDar"
            @click="changeThemePreferences('dark')"
          >
            <b-icon icon="moon" />
          </b-button>
          <b-button
            :variant="variantTheme"
            :pressed="themPreferencesLig"
            @click="changeThemePreferences('light')"
          >
            <b-icon icon="brightness-high-fill" />
          </b-button>
          <b-button
            :variant="variantTheme"
            :pressed="themPreferencesSep"
            @click="changeThemePreferences('sepia')"
          >
            <b-icon icon="cup-fill" />
          </b-button>
        </div>
        <b-list-group class="mt-3 mb-4">
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
              <b-icon :icon="tab.icon" class="mr-1" />
              {{ tab.nickname }}
            </div>
          </b-list-group-item>
        </b-list-group>
        <b-button
          block
          :variant="variantCloseSesion"
          class="mt-3"
          @click="logout([$store, $router])"
        >
          <b-icon icon="power" />
          Cerrar sesion
        </b-button>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  props: {
    logout: {
      type: Function,
      required: true,
    },
    refreshDataUser: {
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
    atajoTheme() {
      return this.$store.state.general.atajoTheme
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
    variantTheme() {
      return this.$store.state.general.themesComponents.themeVariantButton
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
    variantCloseSesion() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    variantList() {
      return this.$store.state.general.themesComponents.themeItemList2
    },
    textSlider() {
      return this.$store.state.general.themesComponents.themeTextSlider
    },
    bgSlider() {
      return this.$store.state.general.themesComponents.themeItemList2
    },
  },
  methods: {
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
    ...mapActions({
      changeThemePreferences: 'general/changeThemePreferences',
    }),
    ...mapMutations({
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
.btnUpdate {
  margin-top: 8px;
  width: 220px;
}

.sepia-sliderbar {
  background: #fdf0d0;
  color: #271601;
}
.dark-sliderbar {
  background: #292929;
  color: #f3f3f3;
}
</style>
