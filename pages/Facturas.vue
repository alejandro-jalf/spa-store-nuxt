<template>
  <div>
    <h4 class="text-center my-4">Consulta de Facturas</h4>
    <b-input-group prepend="Suc" size="sm">
      <b-form-select
        :value="sucursal"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
    </b-input-group>
    <div class="containerInp">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="dateStart"
          v-model="dateStar"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de inicio"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Al">
        <b-form-datepicker
          id="dateEnd"
          v-model="dateEnd"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de Termino"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button
      variant="info"
      size="sm"
      :block="width < 1000"
      :class="{ 'mt-2': width < 1000 }"
      @click="loadFacturas"
    >
      <b-icon icon="arrow-repeat" />
      Consultar
    </b-button>
    <h3 v-if="hasDates" class="text-center mt-4">
      {{ title }}
      <b-badge variant="info" class="h5">
        {{ countRegisters }} Registro(s)
      </b-badge>
    </h3>
    <div v-if="hasDates" class="container-select">
      <b-form-group label="Mostrar">
        <b-form-radio-group
          id="radio-group-1"
          v-model="selected"
          :options="optionsRadio"
          name="radio-options"
          @change="changeTimbrado"
        ></b-form-radio-group>
      </b-form-group>
    </div>
    <b-table
      hover
      small
      head-variant="dark"
      sticky-header="750px"
      outlined
      responsive
      :fields="fields"
      :items="dataFacturas"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(Fecha)="row">
        {{ utils.toDate(row.item.Fecha) }}
      </template>
      <template #cell(IVA)="row">
        {{ formatNumber(row.item.IVA) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
      </template>
      <template #cell(Subtotal)="row">
        {{ utils.roundTo(row.item.Subtotal) }}
      </template>
      <template #cell(Descuento)="row">
        {{ utils.roundTo(row.item.Descuento) }}
      </template>
      <template #cell(EdoTimbre)="row">
        {{ estadoTimbre(row.item.EdoTimbre) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      sucursal: 'ZR',
      dateStar: '',
      dateEnd: '',
      selected: 'Todas',
      optionsRadio: ['Todas', 'Timbrados', 'No Timbrados'],
      utils,
      fields: [
        { key: 'R_RFC', label: 'RFC', sortable: true },
        { key: 'Tercero', label: 'Cliente', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'MDocumento', label: 'Folio Interno', sortable: true },
        { key: 'TipoC', label: 'Tipo', sortable: true },
        { key: 'Tienda', label: 'Tienda', sortable: true },
        { key: 'Serie', label: 'Serie', sortable: true },
        { key: 'Folio', label: 'Folio', sortable: true },
        { key: 'Fecha', label: 'Fecha', sortable: true },
        { key: 'Subtotal', label: 'Subtotal', sortable: true },
        { key: 'IVA', label: 'IVA', sortable: true },
        { key: 'Descuento', label: 'Descuento', sortable: true },
        { key: 'Total', label: 'Total', sortable: true },
        { key: 'Estado', label: 'Estado', sortable: true },
        { key: 'EdoTimbre', label: 'Timbrado', sortable: true },
      ],
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    countRegisters() {
      return this.$store.state.facturas.data.data.length
    },
    hasDates() {
      return (
        this.$store.state.facturas.fechaStart !== undefined &&
        this.$store.state.facturas.fechaStart !== null &&
        this.$store.state.facturas.fechaEnd !== undefined &&
        this.$store.state.facturas.fechaEnd !== null
      )
    },
    title() {
      const data = { ...this.$store.state.facturas }
      return `Facturas de la sucursal ${data.sucursalConsult}, del ${utils
        .toMoment(data.fechaStart)
        .format('DD/MM/YYYY')} al ${utils
        .toMoment(data.fechaEnd)
        .format('DD/MM/YYYY')}`
    },
    dataFacturas() {
      const datos = []
      this.$store.state.facturas.data.data.forEach((factura) => {
        const item = { ...factura }
        if (item.EdoTimbre === 0) item._rowVariant = 'warning'
        else if (item.EdoTimbre !== 2) item._rowVariant = 'danger'
        datos.push(item)
      })
      if (this.selected !== 'Todas') {
        if (this.selected === 'Timbrados')
          return datos.filter((factura) => factura.EdoTimbre === 2)
        else return datos.filter((factura) => factura.EdoTimbre === 0)
      }
      return datos
    },
  },
  mounted() {
    this.loadVariables()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'facturas/setSucursal',
      setTimbrado: 'facturas/setTimbrado',
    }),
    ...mapActions({
      changeData: 'facturas/changeData',
    }),
    changeTimbrado(value) {
      this.setTimbrado(value)
    },
    estadoTimbre(status) {
      if (status === 0) return 'NO'
      if (status === 2) return 'SI'
      if (status === 1) return '?'
      return status
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    loadVariables() {
      const data = { ...this.$store.state.facturas }
      this.sucursal = data.sucursal
      if (
        this.$store.state.facturas.timbrado &&
        this.$store.state.facturas.timbrado !== null
      )
        this.selected = this.$store.state.facturas.timbrado
      if (
        this.$store.state.facturas.fechaEnd !== undefined &&
        this.$store.state.facturas.fechaEnd !== null
      ) {
        this.dateStar =
          data.fechaStart.slice(0, 4) +
          '-' +
          data.fechaStart.slice(4, 6) +
          '-' +
          data.fechaStart.slice(6, 8)
        this.dateEnd =
          data.fechaEnd.slice(0, 4) +
          '-' +
          data.fechaEnd.slice(4, 6) +
          '-' +
          data.fechaEnd.slice(6, 8)
      }
    },
    selectSucursal(suc) {
      this.sucursal = suc
      this.setSucursal(suc)
    },
    async loadFacturas() {
      if (this.dateStar.trim() === '') {
        this.showAlertDialog(['Falta seleccionar fecha de inicio'])
        return false
      }
      if (this.dateEnd.trim() === '') {
        this.showAlertDialog(['Falta seleccionar fecha de termino'])
        return false
      }
      this.setLoading(true)
      const sucursal = this.sucursal
      const response = await this.changeData([
        sucursal,
        this.dateStar.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.container-select {
  border-radius: 5px;
  border: 1px solid rgb(0, 115, 164);
  padding: 5px 15px;
  margin-bottom: 10px;
}

.containerInp {
  display: inline-block;
  margin-top: 3px;
  margin-bottom: 7px;
}

@media screen and (max-width: 1000px) {
  .containerInp {
    display: block;
  }
}
</style>
