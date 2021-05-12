<template>
  <div>
    <b-sidebar id="sidebar-1" title="SPA" :backdrop="true">
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
            variant="light"
            :disabled="false"
            replace
            class="d-flex justify-content-between align-items-center"
          >
            <div class="any">
              <b-icon :icon="tab.icon" class="mr-1"></b-icon>
              {{ tab.nickname }}
            </div>
          </b-list-group-item>
        </b-list-group>
        <b-button block variant="info" @click="logout()">
          Cerrar sesion
        </b-button>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
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
  },
  methods: {
    isActive(nickname) {
      return this.$store.state.general.tabActual.trim() === nickname.trim()
    },
  },
}
</script>
