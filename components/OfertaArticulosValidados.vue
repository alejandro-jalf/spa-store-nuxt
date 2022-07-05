<template>
  <div class="container-articles-not-valid">
    <b-card class="m-1 card-settings">
      <h4 class="text-dark my-2">Detalles de articulos</h4>
      <b-alert :show="isEmptyDetails">
        <h5>
          Por el momento no hay ningun detalle con algun articulo, todos estan
          listos para ser programados.
        </h5>
      </b-alert>
      <b-card-text v-if="!isEmptyDetails">
        <b-table
          ref="tableSelectProduct"
          head-variant="dark"
          hover
          :fields="fields"
          :items="articles"
          responsive="sm"
        >
        </b-table>
      </b-card-text>
      <b-button variant="primary" class="mt-2" @click="setShowDetails(false)">
        Entendido
      </b-button>
    </b-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      fields: [
        'Articulo',
        'Nombre',
        'Precio1IVAUV',
        'Oferta',
        'UltimoCosto',
        'UtilidadOferta',
        'OfertaValida',
        'OfertaCaduca',
        'OfertaFechaVigente',
      ],
    }
  },
  computed: {
    textTheme() {
      return this.$store.state.general.themesComponents.themeTextSlider
    },
    isEmptyDetails() {
      return (
        this.$store.state.ofertas.detallesValidacion.articles.data.length <= 0
      )
    },
    articles() {
      return this.$store.state.ofertas.detallesValidacion.articles.data
    },
  },
  methods: {
    ...mapMutations({
      setShowDetails: 'ofertas/setShowDetails',
    }),
    downSelect() {
      const tam = this.formModalProductos.products.length
      if (this.formModalProductos.position < tam - 1) {
        this.formModalProductos.position++
        this.$refs.tableSelectProduct.selectRow(
          this.formModalProductos.position
        )
      }
    },
    upSelect() {
      if (this.formModalProductos.position > 0) {
        this.formModalProductos.position--
        this.$refs.tableSelectProduct.selectRow(
          this.formModalProductos.position
        )
      }
    },
  },
}
</script>

<style scoped>
.container-articles-not-valid {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: rgba(44, 44, 44, 0.494);
  padding: 20px;
}

.card-settings {
  overflow-y: auto;
}
</style>
