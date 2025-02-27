<template>
  <div>
    <h2 class="text-center my-3">Bitacora de Compras</h2>
    <span>
      <b-button variant="success">
        <b-icon icon="plus-circle-fill" />
        Agregar
      </b-button>
      <b-button variant="info" @click="loadListCompras">
        <b-icon icon="arrow-repeat" />
        Refrescar
      </b-button>
      <b-button variant="danger" to="/bitacorareporte">
        <b-icon icon="file-earmark-pdf-fill" />
        Ir a Reportes
      </b-button>
      <b-button variant="warning">
        <b-icon icon="card-heading" />
        Crear Folio Vacio
      </b-button>
    </span>
    <span class="groupDate">
      <b-button-group>
        <b-button
          :pressed="activeDateT"
          variant="outline-primary"
          @click="setActiveDate('today')"
        >
          Hoy
        </b-button>
        <b-button
          :pressed="activeDateM"
          variant="outline-primary"
          @click="setActiveDate('month')"
        >
          {{ textDateM }}
        </b-button>
        <b-button
          :pressed="activeDateY"
          variant="outline-primary"
          @click="setActiveDate('year')"
        >
          {{ textDateY }}
        </b-button>
        <b-button
          :pressed="activeDateA"
          variant="outline-primary"
          @click="setActiveDate('all')"
        >
          Todas
        </b-button>
      </b-button-group>
    </span>

    <b-container v-if="dataRefactor.length > 20" fluid="xl" class="mt-3">
      <b-row cols="1" cols-sm="2">
        <b-col sm="3" md="2" class="mb-2">
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="9" md="10" class="mb-2">
          <b-pagination
            v-model="currentPage"
            aria-controls="tableInventarioValuacion"
            :total-rows="rows"
            :per-page="perPage"
            align="fill"
            size="sm"
            first-number
            class="my-0"
            last-number
          >
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      id="tablePedidoSujerido"
      responsive
      striped
      hover
      sticky-header="700px"
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="my-3"
      :class="variantThemeTableBody"
    >
      <template #cell(Fecha)="row">
        {{ parseFecha(row.item.Fecha) }}
      </template>
      <template #cell(Subtotal)="row">
        {{ formatNumber(row.item.Subtotal) }}
      </template>
      <template #cell(Descuento)="row">
        {{ formatNumber(row.item.Descuento) }}
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.Ieps) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
      </template>
      <template #cell(Acciones)>
        <b-button variant="info" size="sm">
          <b-icon icon="files" />
        </b-button>
      </template>
    </b-table>
    <div class="container-tarjeta">
      <BitacoraDigitalComprasTarjeta />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import BitacoraDigitalComprasTarjeta from '../components/BitacoraDigitalComprasTarjeta.vue'

export default {
  components: {
    BitacoraDigitalComprasTarjeta,
  },
  data() {
    return {
      perPage: 15,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'SC', text: 'SPASOCONUSCO' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      fields: [
        { key: 'Sucursal', label: 'Suc' },
        'Fecha',
        'Folio',
        'Proveedor',
        'Subtotal',
        'Ieps',
        'Iva',
        'Total',
        'Descuento',
        'Estatus',
        'Acciones',
      ],
      activeDateY: false,
      activeDateM: false,
      activeDateT: true,
      activeDateA: false,
      textDateY: '',
      textDateM: '',
      active: 'today',
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      let datos = []
      datos = this.$store.state.bitacoradigitalcompras.data.data
      return datos.filter((row, index) => {
        const fecha = utils.toMoment(row.Fecha)
        const today = utils.getDateNow()
        if (this.active === 'today') {
          if (fecha.isSame(today, 'day')) return row
        } else if (this.active === 'month') {
          if (fecha.isSame(today, 'month')) return row
        } else if (this.active === 'year') {
          if (fecha.isSame(today, 'year')) return row
        } else return row
      })
    },
    rows() {
      return this.dataRefactor.length
    },
  },
  mounted() {
    const date = new Date()
    this.textDateY = date.getFullYear().toString()
    this.textDateM = utils._arrayMonths[date.getMonth()] + '/' + this.textDateY
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'bitacoradigitalcompras/setSucursal',
    }),
    ...mapActions({
      getBitacoraCompras: 'bitacoradigitalcompras/getBitacoraCompras',
    }),
    formatNumber(value) {
      if (!value) return '0.00'
      if (value === 'Offline') return value
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    parseFecha(fecha) {
      if (!fecha) return '--'
      return utils.toMoment(fecha).format('DD/MM/YYYY')
    },
    setActiveDate(from) {
      this.active = from
      this.activeDateY = false
      this.activeDateA = false
      this.activeDateM = false
      this.activeDateT = false
      if (this.active === 'month') this.activeDateM = true
      else if (this.active === 'year') this.activeDateY = true
      else if (this.active === 'today') this.activeDateT = true
      else if (this.active === 'all') this.activeDateA = true
    },
    async loadListCompras() {
      const sucursal = this.$store.state.bitacoradigitalcompras.sucursal || 'ZR'
      this.setLoading(true)
      const response = await this.getBitacoraCompras([sucursal])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.groupDate {
  float: right;
  margin-top: 5px;
}

.container-tarjeta {
  position: fixed;
  z-index: 15;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: #0000009e;
  padding: 20px;
}
</style>
