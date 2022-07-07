<template>
  <div class="container-articles-not-valid card-settings">
    <b-card class="m-1">
      <h4 class="text-dark my-2">
        Articulos verificados en la tabla de ofertas
      </h4>
      <b-card-text>
        <b-table
          head-variant="dark"
          hover
          striped
          :fields="fields"
          :items="articles"
          responsive="sm"
        >
          <template #cell(Articulo)="row">
            {{ row.item.articulo }}
          </template>
          <template #cell(Nombre)="row">
            {{ row.item.nombre }}
          </template>
          <template #cell(Precio)="row">
            {{ utils.aplyFormatNumeric(utils.roundTo(row.item.PrecioActual)) }}
          </template>
          <template #cell(Oferta)="row">
            {{ utils.aplyFormatNumeric(utils.roundTo(row.item.oferta)) }}
          </template>
          <template #cell(Descuento)="row">
            {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Descuento)) }}
          </template>
          <template #cell(CreadoPor)="row">
            {{ row.item.creadoPor }}
          </template>
          <template #cell(ActualizadoPor)="row">
            {{ row.item.modificadoPor }}
          </template>
          <template #cell(OfertaProgramada)="row">
            <b-icon
              font-scale="1.5"
              :icon="iconOffered(row.item.Offered)"
              :variant="colorOffered(row.item.Offered)"
            />
          </template>
        </b-table>
      </b-card-text>
      <b-button variant="primary" class="mt-2" @click="setShowVerify(false)">
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
        'Precio',
        'Oferta',
        'Descuento',
        'CreadoPor',
        'ActualizadoPor',
        'OfertaProgramada',
      ],
      utils,
    }
  },
  computed: {
    articles() {
      return this.$store.state.ofertas.detallesVerify.articles.data
    },
  },
  methods: {
    ...mapMutations({
      setShowVerify: 'ofertas/setShowVerify',
    }),
    porcentage(value) {
      return utils.roundTo(value, 4, true) * 100 + '%'
    },
    iconOffered(offered) {
      return offered ? 'check-circle-fill' : 'x-circle-fill'
    },
    colorOffered(offered) {
      return offered ? 'success' : 'danger'
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
  overflow: auto;
}
</style>
