<template>
  <div>
    <h1 class="mb-5 mt-5">Analitica de cocina</h1>
    <div class="mb-4">
      <b-form inline>
        <b-input-group prepend="Mes 1" class="mr-2">
          <b-form-select v-model="mes1" :options="options"></b-form-select>
        </b-input-group>
        <b-input-group prepend="Mes 2" class="mr-2">
          <b-form-select v-model="mes2" :options="options"></b-form-select>
        </b-input-group>
        <b-button variant="info" @click="setDataMonth()">Buscar</b-button>
      </b-form>
    </div>
    <b-tabs content-class="mt-2">
      <b-tab title="Totales" active>
        <cocina-totales />
      </b-tab>
      <b-tab title="Crecimiento">
        <cocina-crecimiento />
      </b-tab>
      <b-tab title="Detalles">
        <cocina-detalles />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import CocinaTotales from '../components/CocinaTotales'
import CocinaCrecimiento from '../components/CocinaCrecimiento'
import CocinaDetalles from '../components/CocinaDetalles.vue'
import utils from '../modules/utils'

export default {
  components: {
    CocinaTotales,
    CocinaCrecimiento,
    CocinaDetalles,
  },
  data() {
    return {
      mes1: null,
      mes2: null,
      options: [],
    }
  },
  mounted() {
    this.loadMeses()
  },
  methods: {
    ...mapActions({
      loadDataMoth: 'cocina/loadDataMoth',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setShowGraph: 'cocina/setShowGraph',
    }),
    loadMeses() {
      const dateActual = new Date()
      this.options.push({
        value: null,
        text: 'Seleccione un mes',
      })
      for (let year = dateActual.getFullYear(); year >= 2016; year--) {
        for (let month = 12; month >= 1; month--) {
          if (year === dateActual.getFullYear()) {
            if (month - 1 <= dateActual.getMonth()) {
              this.options.push({
                value: `${year}${utils.completeDateHour(month)}01`,
                text: `${utils._arrayMonths[month - 1]}/${year}`,
              })
            }
          } else if (year > 2016) {
            this.options.push({
              value: `${year}${utils.completeDateHour(month)}01`,
              text: `${utils._arrayMonths[month - 1]}/${year}`,
            })
          } else if (month > 8) {
            this.options.push({
              value: `${year}${utils.completeDateHour(month)}01`,
              text: `${utils._arrayMonths[month - 1]}/${year}`,
            })
          }
        }
      }
    },
    verifyMeses() {
      if (this.mes1 === null) {
        this.showAlertDialog(['Debe elejir un mes en: "Mes 1"'])
        return false
      }
      if (this.mes2 === null) {
        this.showAlertDialog(['Debe elejir un mes en: "Mes 2"'])
        return false
      }
      if (this.mes1 === this.mes2) {
        this.showAlertDialog(['Los meses son iguales'])
        return false
      }
      if (parseInt(this.mes1) > parseInt(this.mes2)) {
        this.showAlertDialog(['El mes 1 debe ser menor que el mes 2'])
        return false
      }
      return true
    },
    async setDataMonth() {
      if (!this.verifyMeses()) return false
      this.setLoading(true)
      this.setShowGraph(false)
      const response = await this.loadDataMoth({
        sucursales: 'ZR,VC',
        dateStart: this.mes1,
        dateEnd: this.mes2,
      })
      if (response.case)
        this.showAlertDialog([
          'Erro con el servidor intentelo as tarde',
          'Error al consultar',
          'danger',
        ])
      else if (!response.success)
        this.showAlertDialog([response.message, 'Error al consultar'])

      this.setShowGraph(true)
      this.setLoading(false)
    },
  },
}
</script>
