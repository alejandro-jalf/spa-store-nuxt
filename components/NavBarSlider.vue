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
            to="/"
            :active="false"
            variant="light"
            :disabled="false"
            replace
            class="d-flex justify-content-between align-items-center"
          >
            <div class="any">
              <b-avatar></b-avatar>
              Inicio
            </div>
            <b-badge variant="danger" pill> off </b-badge>
          </b-list-group-item>
          <b-list-group-item
            to="/about"
            :active="false"
            variant="light"
            :disabled="false"
            replace
            class="d-flex justify-content-between align-items-center"
          >
            <div class="any">
              <b-avatar></b-avatar>
              Acerca de
            </div>
            <b-badge variant="danger" pill> off </b-badge>
          </b-list-group-item>
        </b-list-group>
        <b-button block variant="info" @click="logout(router)">
          Cerrar sesion
        </b-button>
        <!-- Temp -->
        <b-button block variant="warning" @click="resetUrlApi()">
          Reset urlApi
        </b-button>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
// import { mapMutations, mapState } from "vuex";
// import { BIcon } from 'bootstrap-vue'

export default {
  // components: {
  //   BIcon,
  // },
  data() {
    return {
      tabs: [
        {
          titulo: 'Inicio',
          icono: 'house-fill',
          ruta: '/',
        },
        {
          titulo: 'Acerca de',
          icono: 'cloud-fill',
          ruta: '/about',
        },
      ],
      userName: 'admin',
    }
  },
  // props: {
  //   router: Object,
  // },
  methods: {
    // ...mapMutations(['logout', 'showAlertDialog']),
    // actived({ name }, access) {
    //   const finded = access.find(element => element === name);
    //   return typeof finded === "undefined";
    // },
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
  // computed: {
  //   ...mapState(["tabs", "userAccessTo", "userName"])
  // }
}
</script>
