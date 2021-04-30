<template>
  <div>
    <b-sidebar id="sidebar-1" title="SPA 2020" :backdrop="true">
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
            :active="false"
            variant="light"
            :disabled="false"
            replace
            class="d-flex justify-content-between align-items-center"
          >
            <div class="any">
              <b-avatar></b-avatar>
              {{ tab.nickname }}
            </div>
            <!-- <b-badge variant="danger" pill> off </b-badge> -->
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
import { mapMutations } from 'vuex'
// import { BIcon } from 'bootstrap-vue'

export default {
  // components: {
  //   BIcon,
  // },
  data() {
    return {
      tabs: this.$store.state.general.listTabs,
      userName: this.$store.state.user.name,
    }
  },
  // props: {
  //   router: Object,
  // },
  computed: {
    tabsAccess() {
      const user = this.$store.state.user.user
      // eslint-disable-next-line no-console
      console.log('User', user)
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
    ...mapMutations({
      setLogin: 'user/setLogin',
      setUser: 'user/setUser',
    }),
    logout() {
      this.setLogin(false)
      this.setUser({})
      this.$router.push({ name: 'Login' })
    },
    isFocused({ name }) {
      return this.$route.name === name
    },
    // temp
    resetUrlApi() {
      localStorage.removeItem('apiConexiones')
      this.showAlertDialog(['Url eliminada'])
      this.logout(this.$router)
    },
  },
}
</script>
