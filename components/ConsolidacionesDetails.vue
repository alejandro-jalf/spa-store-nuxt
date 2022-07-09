<template>
  <div class="container-articles-not-valid card-settings">
    <b-card class="m-1">
      <h4 class="text-dark my-2">
        Detalles de la transferencia: {{ transferenciaActual.Transferencia }},
        para el almacen: {{ transferenciaActual.AlmacenDestino }}
      </h4>
      <h5 class="text-dark">
        Fecha: {{ utils.toDate(transferenciaActual.Fecha) }}
      </h5>
      <h5 class="text-dark">
        Hora: {{ utils.toHour(transferenciaActual.Hora) }}
      </h5>
      <b-card-text>
        <b-table
          ref="tableSelectProduct"
          head-variant="dark"
          hover
          striped
          :fields="fields"
          :items="articles"
          responsive="sm"
        >
          <template #cell(CantidadUV)="row">
            {{ formatNumber(row.item.CantidadRegular) }}
          </template>
          <template #cell(CantidadUC)="row">
            {{ formatNumber(row.item.CantidadRegularUC) }}
          </template>
          <template #cell(CostoUV)="row">
            {{ formatNumber(row.item.CostoUnitarioNeto) }}
          </template>
          <template #cell(CostoUC)="row">
            {{ formatNumber(row.item.CostoUnitarioNetoUC) }}
          </template>
          <template #cell(CostoTotal)="row">
            {{ formatNumber(row.item.CostoValorNeto) }}
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
  props: {
    transferenciaActual: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        'Articulo',
        'Nombre',
        'Descripcion',
        'Relacion',
        'CantidadUV',
        'CostoUV',
        'CostoUC',
        'CantidadUC',
        'CostoTotal',
      ],
      utils,
    }
  },
  computed: {
    articles() {
      return this.$store.state.consolidaciones.details.data
    },
  },
  methods: {
    ...mapMutations({
      setShowDetails: 'consolidaciones/setShowDetails',
    }),
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
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
  padding: 30px;
}

.card-settings {
  overflow-y: auto;
}
</style>
