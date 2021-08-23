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
      <!-- <template #cell(CrecimientoDiario)="row">
        <div :class="colorPorcentaje(row.item)">
          {{ porcentaje(row.item) }}
        </div>
      </template> -->
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
      suma1: 0,
      suma2: 0,
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
        if (sucursal.MesMovimientoLetra === this.fields[1])
          sumaMes1 += sucursal.Venta
        if (sucursal.MesMovimientoLetra === this.fields[2])
          sumaMes2 += sucursal.Venta
        const diaFinded = datos.findIndex((suc) => suc.Dia === sucursal.Dia)
        if (diaFinded === -1) {
          const newSuc = {
            Dia: sucursal.Dia,
            CrecimientoDiario: '-100.00 %',
            _cellVariants: { CrecimientoDiario: 'danger' },
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
          const porcentaje = this.porcentaje(
            datos[diaFinded][`Venta${this.fields[1]}`],
            datos[diaFinded][`Venta${this.fields[2]}`]
          )
          datos[diaFinded].CrecimientoDiario = porcentaje + ' %'
          datos[diaFinded]._cellVariants = {
            CrecimientoDiario: porcentaje < 0 ? 'danger' : 'success',
          }
        }
      })
      const porcentaje = this.porcentaje(sumaMes1, sumaMes2)
      const foot = {
        Dia: 'Total',
        status: 'end',
        CrecimientoDiario: porcentaje + ' %',
        _cellVariants: {
          CrecimientoDiario: porcentaje < 0 ? 'danger' : 'success',
        },
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
      let ventaAnterior1 = 0
      let ventaAnterior2 = 0
      datos.map((dia) => {
        if (!dia[`Venta${this.fields[1]}`]) dia[`Venta${this.fields[1]}`] = 0
        if (!dia[`Venta${this.fields[2]}`]) dia[`Venta${this.fields[2]}`] = 0

        dia[`Acumulado${this.fields[1]}`] = this.utils.aplyFormatNumeric(
          this.utils.roundTo(dia[`Venta${this.fields[1]}`] + ventaAnterior1)
        )
        dia[`Acumulado${this.fields[2]}`] = this.utils.aplyFormatNumeric(
          this.utils.roundTo(dia[`Venta${this.fields[2]}`] + ventaAnterior2)
        )
        ventaAnterior1 = dia[`Venta${this.fields[1]}`] + ventaAnterior1
        ventaAnterior2 = dia[`Venta${this.fields[2]}`] + ventaAnterior2
        return dia
      })
      datosSort.push(foot)
      return datosSort
    },
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'end') return 'table-primary'
    },
    porcentaje(mes1, mes2) {
      if (!mes1) mes1 = 0
      if (!mes2) mes2 = 0
      const porcentaje = (100 / mes1) * mes2 - 100
      return utils.roundTo(porcentaje)
    },
    sumaAcum1(valor) {
      this.suma1 += valor
      const sum = this.suma1
      return sum
    },
  },
}
</script>
