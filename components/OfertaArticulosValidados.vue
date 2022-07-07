<template>
  <div class="container-articles-not-valid card-settings">
    <b-card class="m-1">
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
          striped
          :fields="fields"
          :items="articles"
          responsive="sm"
        >
          <template #cell(UtilidadOferta)="row">
            {{ porcentage(row.item.UtilidadOferta) }}
          </template>
          <template #cell(Precio1)="row">
            {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Precio1IVAUV)) }}
          </template>
          <template #cell(Oferta)="row">
            {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Oferta)) }}
          </template>
          <template #cell(UltimoCosto)="row">
            {{ utils.aplyFormatNumeric(utils.roundTo(row.item.UltimoCosto)) }}
          </template>
          <template #cell(Detalles)="row">
            <div class="font-weight-bold">
              {{ getDetailsForArticle(row.item) }}
            </div>
            <div class="ml-3">
              {{ getDetailsOfUtilitie(row.item.OfertaValida) }}
            </div>
            <div class="ml-3">
              {{ getDetailsOfCaducidad(row.item.OfertaCaduca) }}
            </div>
            <div class="ml-3">
              {{ getDetailsOfVigencia(row.item) }}
            </div>
          </template>
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
import utils from '../modules/utils'

export default {
  data() {
    return {
      fields: [
        'Articulo',
        'Nombre',
        'Precio1',
        'Oferta',
        'UltimoCosto',
        'UtilidadOferta',
        'Detalles',
      ],
      utils,
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
    porcentage(value) {
      return utils.roundTo(value, 4, true) * 100 + '%'
    },
    getDetailsForArticle(article) {
      if (
        article.OfertaValida === 'NO' ||
        article.OfertaCaduca === 'NO' ||
        article.OfertaFechaVigente === 'SI'
      )
        return 'No se puede programar la oferta para este articulo por los siguientes detalles:'
      return ''
    },
    getDetailsOfUtilitie(ofertaValida) {
      if (ofertaValida === 'NO')
        return `- La utilidad de oferta esta por debajo del 10% que se pide como minimo.`
      return ''
    },
    getDetailsOfCaducidad(ofertaCaduca) {
      if (ofertaCaduca === 'NO')
        return `- Se encontro una oferta del mismo articulo que es por tiempo indefinido(No caduca).`
      return ''
    },
    getDetailsOfVigencia(article) {
      if (article.OfertaFechaVigente === 'SI' && article.OfertaCaduca === 'SI')
        return `- Se encontro una oferta del mismo articulo y que esta dentro de las mismas fechas.`
      return ''
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
