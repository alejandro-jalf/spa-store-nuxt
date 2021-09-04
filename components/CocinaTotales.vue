<template>
  <div>
    <div class="mb-2">
      <span v-if="width > 334">Sucursal:</span>
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
    </div>
    <b-table
      v-if="width > 575"
      striped
      hover
      head-variant="dark"
      responsive=""
      :fields="fields"
      :items="itemsRafactor"
      :class="variantThemeTableBody"
      :tbody-tr-class="rowClass"
    >
      <template #cell(Total)="row">
        {{ getTotal(row.item) }}
      </template>
    </b-table>
    <div v-else>
      <b-card
        v-for="(dia, indexDia) in itemsRafactor"
        :key="indexDia"
        no-body
        class="containerCard"
        :class="variantTheme"
      >
        <div class="dayTotal">Dia: {{ dia.Dia }}</div>
        <div class="totalAcum">Total: {{ getTotal(dia) }}</div>
        <div>
          <div class="d-inline-block">
            <span class="font-weight-bold">{{ fields[1] }}: </span>
            {{ dia[`${fields[1]}`] }},
          </div>
          <div class="d-inline-block">
            <span class="font-weight-bold">{{ fields[2] }}: </span>
            {{ dia[`${fields[2]}`] }}
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { BIconCircle, BIconCheckCircleFill } from 'bootstrap-vue'
import utils from '../modules/utils'

export default {
  components: {
    BIconCircle,
    BIconCheckCircleFill,
  },
  data() {
    return {
      sucursales: ['ZR', 'VC'],
      utils,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    sucursalSelected() {
      return this.$store.state.cocina.sucursalSelected
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
    fields() {
      return this.$store.state.cocina.dataMes.fieldsTotales
    },
    variantTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkBodyCard containerCarDark'
        return 'containerCard'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkBodyCard containerCarDark'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaBodyCard containerCard'
      else return 'containerCard'
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
    ...mapMutations({
      setSucursalSelected: 'cocina/setSucursalSelected',
    }),
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'end') return 'table-primary'
    },
    changeSucursal(sucursal) {
      this.setSucursalSelected(sucursal)
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
.dayTotal {
  font-weight: bold;
  position: absolute;
  top: 0px;
  left: 0px;
  background: #018299;
  color: #fff;
  border-radius: 3px 0px 5px 0px;
  width: 58px;
  text-align: center;
}

.totalAcum {
  font-weight: bold;
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: #018299;
  color: #fff;
  border-radius: 5px 0px 3px 0px;
  padding: 0px 10px;
  text-align: center;
}

.containerCard {
  padding: 27px 15px;
  margin-bottom: 10px;
  box-shadow: 2px 2px 2px #e6e6e6;
}
.containerCarDark {
  box-shadow: 2px 2px 2px #5d5d5d;
}

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
