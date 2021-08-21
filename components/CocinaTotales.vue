<template>
  <div>
    Sucursal:
    <b-badge
      v-for="(sucursal, indexSuc) in sucursales"
      :key="indexSuc"
      pill
      variant="info"
      class="sucursal"
      @click="changeSucursal(sucursal)"
    >
      <b-icon-check-circle-fill v-if="sucursalSelected === sucursal" />
      <b-icon-circle v-else />
      {{ sucursal }}
    </b-badge>
    <b-badge
      pill
      variant="info"
      class="sucursal"
      @click="changeSucursal('ALL')"
    >
      <b-icon-check-circle-fill v-if="sucursalSelected === 'ALL'" />
      <b-icon-circle v-else />
      TODO
    </b-badge>
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
      <template #cell(Total)="row">
        {{ getTotal(row.item) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { BIconCircle, BIconCheckCircleFill } from 'bootstrap-vue'
import utils from '../modules/utils'

export default {
  components: {
    BIconCircle,
    BIconCheckCircleFill,
  },
  data() {
    return {
      sucursalSelected: 'ZR',
      sucursales: ['ZR', 'VC'],
      utils,
      fields: ['Dia', 'Agosto', 'Julio', 'Total'],
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
      const sucursal = this.sucursalSelected
      let sumaMes1 = 0
      let sumaMes2 = 0
      const datos = []
      if (sucursal !== 'ALL') {
        this.$store.state.cocina.dataMes.data.forEach((item) => {
          if (item.Suc === sucursal) {
            const mesFinded = datos.findIndex(
              (acumItem) => acumItem.Dia === item.Dia
            )
            if (mesFinded === -1) {
              const newSuc = {
                Dia: item.Dia,
              }
              newSuc[
                `${item.MesMovimientoLetra}`
              ] = this.utils.aplyFormatNumeric(this.utils.roundTo(item.Venta))
              newSuc[`Venta${item.MesMovimientoLetra}`] = item.Venta
              datos.push(newSuc)
            } else {
              datos[mesFinded][
                `${item.MesMovimientoLetra}`
              ] = this.utils.aplyFormatNumeric(this.utils.roundTo(item.Venta))
              datos[mesFinded][`Venta${item.MesMovimientoLetra}`] = item.Venta
            }
            if (item.MesMovimientoLetra === this.fields[1])
              sumaMes1 += item.Venta
            if (item.MesMovimientoLetra === this.fields[2])
              sumaMes2 += item.Venta
          }
        })
      } else {
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
              ] = this.utils.aplyFormatNumeric(
                this.utils.roundTo(sucursal.Venta)
              )
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
      }
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
  mounted() {
    // eslint-disable-next-line no-console
    // console.log(this.data)
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'end') return 'table-primary'
    },
    changeSucursal(sucursal) {
      this.sucursalSelected = sucursal
    },
    getTotal(item) {
      if (!item[`Venta${this.fields[1]}`]) item[`Venta${this.fields[1]}`] = 0
      if (!item[`Venta${this.fields[2]}`]) item[`Venta${this.fields[2]}`] = 0
      return this.utils.aplyFormatNumeric(
        this.utils.roundTo(
          item[`Venta${this.fields[1]}`] + item[`Venta${this.fields[2]}`]
        )
      )
    },
  },
}
</script>

<style scoped>
.sucursal {
  padding: 5px 10px 5px 5px;
  font-size: 19px;
  margin-right: 5px;
  cursor: pointer;
}

.sucursal:hover {
  background: rgb(1, 88, 122);
}
</style>
