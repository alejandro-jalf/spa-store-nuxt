<template>
  <div>
    <b-table
      striped
      hover
      head-variant="dark"
      responsive=""
      :fields="fields"
      :items="itemsRafactor"
      :class="variantThemeTableBody"
      class="mt-2"
      :tbody-tr-class="rowClass"
    >
      <template #cell(CrecimientoDiario)="row">
        <div :class="colorPorcentaje(row.item)">
          {{ porcentaje(row.item) }}
        </div>
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
      fields: [
        'Dia',
        'Julio',
        'Agosto',
        'CrecimientoDiario',
        'AcumuladoJulio',
        'AcumuladoAgosto',
        'Crecimiento Acumulado',
      ],
    }
  },
  computed: {
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
    itemsRafactor() {
      let sumaMes1 = 0
      let sumaMes2 = 0
      const datos = []
      this.$store.state.cocina.dataMes.data.forEach((sucursal) => {
        const diaFinded = datos.findIndex((suc) => suc.Dia === sucursal.Dia)
        if (diaFinded === -1) {
          const newSuc = {
            Dia: sucursal.Dia,
          }
          newSuc[
            `${sucursal.MesMovimientoLetra}`
          ] = this.utils.aplyFormatNumeric(this.utils.roundTo(sucursal.Venta))
          newSuc[`Venta${sucursal.MesMovimientoLetra}`] = sucursal.Venta
          datos.push(newSuc)
        } else {
          const mesFinded =
            datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`]
          if (!mesFinded) {
            datos[diaFinded][
              `${sucursal.MesMovimientoLetra}`
            ] = this.utils.aplyFormatNumeric(this.utils.roundTo(sucursal.Venta))
            datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`] =
              sucursal.Venta
          } else {
            const suma = parseFloat(
              datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`] +
                sucursal.Venta
            )
            datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`] = suma
            datos[diaFinded][
              `${sucursal.MesMovimientoLetra}`
            ] = this.utils.aplyFormatNumeric(this.utils.roundTo(suma))
          }
        }
        if (sucursal.MesMovimientoLetra === this.fields[1])
          sumaMes1 += sucursal.Venta
        if (sucursal.MesMovimientoLetra === this.fields[2])
          sumaMes2 += sucursal.Venta
      })
      const foot = {
        Dia: 'Total',
        status: 'end',
      }
      foot[`${this.fields[1]}`] = this.utils.aplyFormatNumeric(
        this.utils.roundTo(sumaMes1)
      )
      foot[`Venta${this.fields[1]}`] = sumaMes1
      foot[`${this.fields[2]}`] = this.utils.aplyFormatNumeric(
        this.utils.roundTo(sumaMes2)
      )
      foot[`Venta${this.fields[2]}`] = sumaMes2
      const datosSort = datos.sort((a, b) => a.Dia - b.Dia)
      datosSort.push(foot)
      return datosSort
    },
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'end') return 'table-primary'
    },
    porcentaje(item) {
      if (!item[`Venta${this.fields[1]}`]) item[`Venta${this.fields[1]}`] = 0
      if (!item[`Venta${this.fields[2]}`]) item[`Venta${this.fields[2]}`] = 0
      const porcentaje =
        (100 / item[`Venta${this.fields[1]}`]) *
          item[`Venta${this.fields[2]}`] -
        100
      return `${utils.roundTo(porcentaje)} %`
    },
    colorPorcentaje(item) {
      if (!item[`Venta${this.fields[1]}`]) item[`Venta${this.fields[1]}`] = 0
      if (!item[`Venta${this.fields[2]}`]) item[`Venta${this.fields[2]}`] = 0
      const porcentaje =
        (100 / item[`Venta${this.fields[1]}`]) *
          item[`Venta${this.fields[2]}`] -
        100
      return porcentaje < 0 ? 'table-danger' : 'table-success'
    },
  },
}
</script>
