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
          <div v-for="(tab, indexTab) in tabsAccess" :key="indexTab">
            <b-list-group-item
              v-if="tab.childrens.length === 0"
              :to="tab.path"
              replace
              :class="isActiveItem(tab.name)"
            >
              <b-icon v-if="tab.icon" :icon="tab.icon" class="mr-1" />
              {{ tab.nickname }}
            </b-list-group-item>
            <div v-else>
              <b-list-group-item
                v-b-toggle="'collapse-' + tab.nickname"
                replace
                :class="isActiveItem(tab.name, true, tab)"
                class="cursor-pointer"
              >
                <b-icon v-if="tab.icon" :icon="tab.icon" class="mr-1" />
                {{ tab.nickname }}
                <b-icon
                  :icon="iconOpenTab('collapse-' + tab.nickname)"
                  class="float-right"
                />
              </b-list-group-item>
              <b-collapse
                :id="'collapse-' + tab.nickname"
                accordion="acordion"
                :visible="visibleCollapse(true, tab)"
              >
                <b-list-group-item
                  v-for="(child, indexChild) in tab.childrens"
                  :key="indexChild"
                  :to="child.path"
                  replace
                  :class="isActiveItem(child.name)"
                  class="sub-tab"
                >
                  <b-icon v-if="child.icon" :icon="child.icon" class="mr-1" />
                  {{ child.nickname }}
                </b-list-group-item>
              </b-collapse>
            </div>
          </div>
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
import utils from '../modules/utils'

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
      subTab: {
        open: '',
        close: '',
      },
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
  mounted() {
    const that = this
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (isJustShown) that.subTab.open = collapseId
      else that.subTab.close = collapseId
    })
  },
  methods: {
    visibleCollapse(haveChildrens = false, tab = {}) {
      if (haveChildrens) {
        const childrenFinded = tab.childrens.find(
          (children) =>
            this.$store.state.general.tabActual.trim() ===
            children.name.trim().toLowerCase()
        )
        return !!childrenFinded
      }
      return false
    },
    isActiveItem(nickname, haveChildrens = false, tab = {}) {
      let complement = ''
      if (haveChildrens) {
        const childrenFinded = tab.childrens.find(
          (children) =>
            this.$store.state.general.tabActual.trim() ===
            children.name.trim().toLowerCase()
        )
        if (childrenFinded) complement = 'item-tab'
      }
      return this.$store.state.general.tabActual.trim() ===
        nickname.trim().toLowerCase()
        ? complement + ' item-tab-active'
        : complement
    },
    iconOpenTab(idTab) {
      return this.subTab.open !== this.subTab.close &&
        idTab === this.subTab.open
        ? 'caret-down-fill'
        : 'caret-right-fill'
    },
    ...mapActions({
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
.item-tab-active {
  background: rgba(0, 183, 255);
  color: #fff;
}

.item-tab {
  background: rgba(0, 140, 255);
  color: #fff;
}

.sub-tab {
  border-left: 8px solid rgba(0, 140, 255);
  padding-left: 35px;
}

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
