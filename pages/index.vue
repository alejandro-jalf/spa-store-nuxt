<template>
  <div class="container">
    <div>
      <h1 class="mt-4 text-center title">Super Promociones de Acayucan</h1>
      <div class="text-center mb-3">
        <img src="../assets/cesta.png" alt="" width="250px" />
      </div>
      <b-card
        header-bg-variant="info"
        header-text-variant="white"
        border-variant="info"
        class="mb-5"
      >
        <template #header>
          <b-icon icon="gear-fill"></b-icon>
          Configuraciones
        </template>
        <div class="font-weight-bold">Pagina inicial:</div>
        <hr class="m-0 mb-2" />
        <div class="titleConf">
          La opcion seleccionada es la que se abrira al iniciar la aplicación
        </div>
        <b-button
          v-for="(tab, indexTab) in listAccess"
          :key="indexTab"
          variant="outline-info"
          class="buttonSelect text-left"
          :pressed="activo(tab)"
          :block="blockButton"
          @click="setActivo(tab)"
        >
          <b-icon :icon="iconActivo(tab)" scale="0.7"></b-icon>
          {{ tab }}
        </b-button>

        <b-button
          variant="success"
          class="float-right mt-5"
          :block="blockButton"
        >
          <b-icon icon="shield-fill-check"></b-icon>
          Guardar Cambios
        </b-button>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      principal: 'ventav',
      width: 0,
    }
  },
  computed: {
    listAccess() {
      if (this.$store.state.user.user.access_to_user)
        return this.$store.state.user.user.access_to_user.split(',')
      return []
    },
    blockButton() {
      return this.width <= 500
    },
  },
  mounted() {
    this.width = window.innerWidth
    const that = this
    window.addEventListener('resize', () => {
      that.width = window.innerWidth
    })
  },
  methods: {
    activo(tab) {
      return tab === this.principal
    },
    iconActivo(tab) {
      return tab !== this.principal ? 'square' : 'check-square-fill'
    },
    setActivo(tab) {
      this.principal = tab
    },
  },
}
</script>

<style scoped>
.buttonSelect {
  padding: 0px 3px;
  padding-right: 5px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.titleConf {
  font-weight: 500;
  margin-bottom: 10px;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
