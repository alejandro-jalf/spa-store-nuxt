<template>
  <div>
    <div>
      <div style="display: inline-block">
        <b-form inline>
          <span class="font-weight-bold mr-2">Del</span>
          <b-form-datepicker
            id="example-datepicker"
            v-model="date1"
            class="dateForm"
          ></b-form-datepicker>
        </b-form>
      </div>
      <div style="display: inline-block">
        <b-form inline>
          <span class="font-weight-bold mr-2 ml-4">Al</span>
          <b-form-datepicker
            id="example-datepicker2"
            v-model="date2"
            class="dateForm"
          ></b-form-datepicker>
        </b-form>
      </div>
    </div>
    <b-table
      striped
      hover
      head-variant="dark"
      responsive=""
      :fields="fields"
      :items="itemsRafactor"
      :class="variantThemeTableBody"
      class="mt-4"
      :tbody-tr-class="rowClass"
    >
      <template #cell(CantidadRegular)="row">
        {{ formatNumeric(row.item.CantidadRegular) }}
      </template>
      <template #cell(VentaValorNeta)="row">
        {{ formatNumeric(row.item.VentaValorNeta) }}
      </template>
      <template #cell(Fecha)="row">
        {{ toDate(row.item.Fecha, row.item.status) }}
      </template>
      <template #cell(Hora)="row">
        {{ toHour(row.item.Hora, row.item.status) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      date1: '',
      date2: '',
    }
  },
  computed: {
    fields() {
      return this.$store.state.cocina.detalles.fields
    },
    itemsRafactor() {
      const datos = []
      let sumaCantidad = 0
      let sumaVenta = 0

      this.$store.state.cocina.detalles.data.forEach((detalle) => {
        datos.push(detalle)
        sumaCantidad += detalle.CantidadRegular
        sumaVenta += detalle.VentaValorNeta
      })

      datos.push({
        Suc: 'Total',
        status: 'end',
        CantidadRegular: sumaCantidad,
        VentaValorNeta: sumaVenta,
      })
      return datos
    },
    variantThemeTableBody() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeTableBody'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeTableBody'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeItemList'
      else return ''
    },
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'end') return 'table-primary'
    },
    formatNumeric(num) {
      return utils.aplyFormatNumeric(utils.roundTo(num))
    },
    toDate(date, status) {
      if (status === 'end') return ''
      return utils.toDate(date)
    },
    toHour(hour, status) {
      if (status === 'end') return ''
      return utils.toHour(hour)
    },
  },
}
</script>
