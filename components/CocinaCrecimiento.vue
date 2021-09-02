<template>
  <div>
    <div class="container-result">
      <span class="font-weight-bold">Dias {{ fields[1] }}:</span>
      {{ diasMes1 }}
    </div>
    <div class="container-result">
      <span class="font-weight-bold">Dias {{ fields[2] }}:</span>
      {{ diasMes2 }}
    </div>
    <br />
    <div class="container-result">
      <span class="font-weight-bold">Promedio {{ fields[1] }}:</span>
      {{ promedio1 }}
    </div>
    <div class="container-result">
      <span class="font-weight-bold">Promedio {{ fields[2] }}:</span>
      {{ promedio2 }}
    </div>
    <br />
    <div class="container-result">
      <span class="font-weight-bold">Tendencia {{ fields[2] }}:</span>
      {{ tendencia }}
    </div>
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
    ></b-table>
    <h2>Grafico</h2>
    <div class="mb-5">
      <b-button variant="info" @click="changeGrafico('bar')">
        <b-icon-check-circle-fill v-if="tipoGrafico === 'bar'" />
        <b-icon-circle v-else />
        Barra
      </b-button>
      <b-button variant="info" @click="changeGrafico('line')">
        <b-icon-check-circle-fill v-if="tipoGrafico === 'line'" />
        <b-icon-circle v-else />
        Linea
      </b-button>
    </div>
    <cocina-chart
      v-if="showGraph"
      :datos-reactor="itemsRafactor"
      :fields="fields"
      :utils="utils"
      :tipo="tipoGrafico"
    />
    <div v-else class="spin">
      <b-spinner variant="primary" label="Spinning"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { BIconCircle, BIconCheckCircleFill } from 'bootstrap-vue'
import CocinaChart from '../components/CocinaChart'
import utils from '../modules/utils'

export default {
  components: {
    CocinaChart,
    BIconCircle,
    BIconCheckCircleFill,
  },
  data() {
    return {
      utils,
      diasMes1: 0,
      diasMes2: 0,
      promedio1: 0,
      promedio2: 0,
      tendencia: 0,
    }
  },
  computed: {
    showGraph() {
      return this.$store.state.cocina.showGraph
    },
    tipoGrafico() {
      return this.$store.state.cocina.tipo
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
      return this.$store.state.cocina.dataMes.fieldsCrecimiento
    },
    itemsRafactor() {
      let sumaMes1 = 0
      let sumaMes2 = 0
      let porcentaje = 0
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
          porcentaje = this.porcentaje(
            datos[diaFinded][`Venta${this.fields[1]}`],
            datos[diaFinded][`Venta${this.fields[2]}`]
          )
          datos[diaFinded].CrecimientoDiario = porcentaje + ' %'
          datos[diaFinded]._cellVariants = {
            CrecimientoDiario: porcentaje < 0 ? 'danger' : 'success',
          }
        }
      })
      porcentaje = this.porcentaje(sumaMes1, sumaMes2)
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
      datos.map((dia, index) => {
        if (index === 0) {
          this.diasMes1 = 0
          this.diasMes2 = 0
        }

        if (!dia[`Venta${this.fields[1]}`]) dia[`Venta${this.fields[1]}`] = 0
        else this.diasMes1++
        if (!dia[`Venta${this.fields[2]}`]) dia[`Venta${this.fields[2]}`] = 0
        else this.diasMes2++

        ventaAnterior1 += dia[`Venta${this.fields[1]}`]
        ventaAnterior2 += dia[`Venta${this.fields[2]}`]

        dia[`Acumulado${this.fields[1]}`] = this.utils.aplyFormatNumeric(
          this.utils.roundTo(ventaAnterior1)
        )
        dia[`Acumulado${this.fields[2]}`] = this.utils.aplyFormatNumeric(
          this.utils.roundTo(ventaAnterior2)
        )

        porcentaje = this.porcentaje(ventaAnterior1, ventaAnterior2)
        dia.CrecimientoAcumulado = porcentaje + ' %'
        dia._cellVariants.CrecimientoAcumulado =
          porcentaje < 0 ? 'danger' : 'success'

        if (index === datos.length - 1) {
          this.promedio1 = this.utils.aplyFormatNumeric(
            this.utils.roundTo(sumaMes1 / this.diasMes1)
          )
          this.promedio2 = this.utils.aplyFormatNumeric(
            this.utils.roundTo(sumaMes2 / this.diasMes2)
          )
          this.tendencia = this.utils.aplyFormatNumeric(
            this.utils.roundTo((sumaMes2 / this.diasMes2) * this.diasMes1)
          )
        }
        return dia
      })
      datosSort.push(foot)
      return datosSort
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setTipoGrafico: 'cocina/setTipoGrafico',
      setShowGraph: 'cocina/setShowGraph',
    }),
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
    changeGrafico(tipo) {
      const that = this
      this.setShowGraph(false)
      setTimeout(() => {
        that.setTipoGrafico(tipo)
        this.setShowGraph(true)
      }, 10)
    },
  },
}
</script>

<style scoped>
.container-result {
  display: inline-block;
  margin-top: 10px;
  padding: 10px;
  background: rgba(251, 251, 251, 0.274);
  border-radius: 10px;
  margin-right: 5px;
  border: 1px solid rgb(175, 175, 175);
}

.spin {
  text-align: center;
  display: block;
  width: 100%;
  height: 550px;
  padding-top: 150px;
  background: rgba(255, 255, 255, 0.342);
}
</style>
