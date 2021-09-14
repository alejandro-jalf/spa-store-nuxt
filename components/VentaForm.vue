<template>
  <div>
    <b-card
      title="Producto"
      border-variant="primary"
      header="Agregando producto a la venta"
      header-bg-variant="primary"
      header-text-variant="white"
      :class="variantTheme"
    >
      <b-form inline class="mt-4 mb-2">
        <b-form-input
          id="textCodigoArticulo"
          v-model="formVentaAct.codigoArticulo"
          placeholder="Articulo"
          class="input-resp-dt-ofe"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-form-input
          id="textCodigoBarras"
          v-model="formVentaAct.codigoBarras"
          placeholder="Codigo de barras"
          class="input-resp-dt-ofe"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-form-input
          id="textNombre"
          v-model="formVentaAct.nombreArticulo"
          placeholder="Nombre del articulo"
          class="input-resp-dt-ofe"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-button id="btnSearch" variant="outline-success">Buscar</b-button>
      </b-form>
      <b-card-text class="text-bold">Cantidad</b-card-text>
      <b-form inline class="mt-4 mb-2">
        <b-form-input
          id="textPrecio"
          v-model="formVentaAct.codigoArticulo"
          placeholder="Precio"
          class="input-resp-dt-cant"
          readonly
        ></b-form-input>
        <b-form-input
          id="textCantidad"
          v-model="formVentaAct.codigoBarras"
          placeholder="Cantidad"
          class="input-resp-dt-cant"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-form-input
          id="textImporte"
          v-model="formVentaAct.nombreArticulo"
          placeholder="Importe"
          class="input-resp-dt-cant"
          readonly
        ></b-form-input>
        <b-button id="btnSearch" variant="success">Agregar</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      formVentaAct: {
        codigoBarras: '',
        codigoArticulo: '',
        nombreArticulo: '',
        precio: 0,
        cantidad: 0,
        importe: 0,
      },
    }
  },
  computed: {
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
  },
}
</script>

<style scoped>
.input-resp-dt-ofe,
#btnSearch {
  width: calc(25% - 5px);
  margin-bottom: 5px;
  margin-right: 5px;
}

.input-resp-dt-cant {
  width: calc(27% - 5px);
  margin-bottom: 5px;
  margin-right: 5px;
}

#textNombre {
  width: calc(40% - 5px);
}

#btnSearch {
  width: 100px;
}

@media screen and (max-width: 767px) {
  .input-resp-dt-ofe {
    width: 100%;
    margin-right: 0px;
  }
  #btnSearch {
    widows: 100%;
    margin-right: 0px;
  }
}
</style>
