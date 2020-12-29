<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>
        <img src="../assets/cesta.png" width="30px" height="30px" />
        SPA 2020
      </b-navbar-brand>

      <b-navbar-nav v-if="display > 0" class="mr-auto">
        <b-nav-item>
          <b-badge variant="light" class="p-2 text-uppercase mr-2">
            <b-icon-door-open></b-icon-door-open>
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
            v-for="(tab, index) in tabs"
            :key="index"
            :to="tab.ruta"
            :disabled="false"
            replace
          >
            {{ tab.titulo }}
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
            <b-dropdown-item @click="logout($router)">
              Cerrar sesion
            </b-dropdown-item>
            <!-- temp -->
            <b-dropdown-item @click="resetUrlApi()">
              Reset urlApi
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- <NavBarSlider :router="$router" /> -->
    <NavBarSlider />
  </div>
</template>

<script>
// import { mapMutations, mapState } from 'vuex'
import { BIconDoorOpen } from 'bootstrap-vue'
import NavBarSlider from './NavBarSlider'

export default {
  components: {
    NavBarSlider,
    BIconDoorOpen,
  },
  data() {
    return {
      data: 0,
      display: 0,
      tabActual: 'Inicio',
      tabs: [
        {
          titulo: 'Inicio',
          ruta: '/',
        },
        {
          titulo: 'Acerca de',
          ruta: '/about',
        },
        {
          titulo: 'Ofertas',
          ruta: '/ofertas',
        },
        {
          titulo: 'Punto de venta',
          ruta: '/ventav',
        },
      ],
      userName: 'admin',
    }
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
    // ...mapMutations(['logout', 'showAlertDialog']),
    // actived({ name }, access) {
    //   const finded = access.find((element) => element === name)
    //   return typeof finded === 'undefined'
    // },
    // temp
    // resetUrlApi() {
    //   localStorage.removeItem("apiConexiones");
    //   this.showAlertDialog(["Url eliminada"]);
    //   this.logout(this.$router);
    // }
  },
  // computed: {
  //   ...mapState(["tabs", "userAccessTo", "userName", "tabActual"])
  // }
}
</script>
