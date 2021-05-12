<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>
        <img src="../assets/cesta.png" width="30px" height="30px" />
        SPA
      </b-navbar-brand>

      <b-navbar-nav v-if="display > 0" class="mr-auto">
        <b-nav-item>
          <b-badge variant="light" class="p-2 text-uppercase mr-2">
            <b-icon icon="geo-fill"></b-icon>
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
          <b-nav-item
            v-for="(tab, index) in tabsAccess"
            :key="index"
            :to="tab.path"
            :disabled="false"
            replace
          >
            {{ tab.nickname }}
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>
                <b-avatar></b-avatar>
                {{ userName }}
              </em>
            </template>
            <b-dropdown-item @click="logout()">Cerrar sesion</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <NavBarSlider :logout="logout" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
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
    }
  },
  computed: {
    tabActual() {
      return this.$store.state.general.tabActual
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
    const btnToggle = document.getElementById('toggle')
    this.display = btnToggle.offsetTop

    const instancia = this
    window.addEventListener('resize', function () {
      const display = btnToggle.offsetTop
      instancia.display = display
    })
  },
  methods: {
    ...mapMutations({
      setLogin: 'user/setLogin',
      setUser: 'user/setUser',
      setConexiones: 'conexiones/setConexiones',
      setListArticulos: 'existenciasarticulo/setListArticulos',
      setArticulosFinded: 'existenciasarticulo/setArticulosFinded',
      setArticuloDetails: 'existenciasarticulo/setArticuloDetails',
    }),
    logout() {
      sessionStorage.removeItem('spastore_users_list')
      this.setConexiones({})
      this.setListArticulos({ data: [] })
      this.setArticulosFinded(0)
      this.setArticuloDetails({})
      this.setLogin(false)
      this.setUser({})
      this.$router.push({ name: 'Login' })
    },
  },
}
</script>
