<template>
  <div class="pt-3">
    <div id="input-Sucursal" class="inputs">
      <b-input-group prepend="Sucursal">
        <b-form-select
          v-model="selected"
          :options="options"
          @change="changeSuc"
        ></b-form-select>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Fecha inicio">
        <b-form-datepicker
          id="date-init"
          v-model="dateInit"
          label-no-date-selected="Fecha no seleccionada"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Fecha final">
        <b-form-datepicker
          id="date-end"
          v-model="dateEnd"
          label-no-date-selected="Fecha no seleccionada"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button variant="info" @click="updateConsolidaciones">
      <b-icon icon="search"></b-icon>
    </b-button>
    <div class="font-weight-bold">
      {{ fechas }}
    </div>
    <div class="font-weight-bold">{{ sucursalFinded }}</div>
    <b-button variant="outline-success" class="mt-2">
      <b-icon icon="download"></b-icon>
      Descargar
    </b-button>
    <b-table-simple
      hover
      small
      caption-top
      responsive
      class="mt-2"
      :class="variantThemeTableBody"
    >
      <b-thead head-variant="dark">
        <b-tr>
          <b-th>Nombre</b-th>
          <b-th>Fecha</b-th>
          <b-th>Asist.</b-th>
          <b-th>Entrada</b-th>
          <b-th>S. Comida</b-th>
          <b-th>E. Comida</b-th>
          <b-th>Salida</b-th>
          <b-th>Trabajo</b-th>
          <b-th>Comida</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr v-for="(trabajadores, indext) in dataRefactor" :key="indext">
          <b-td v-if="trabajadores.header" :rowspan="trabajadores.dias">
            {{ trabajadores.nombre }}
          </b-td>
          <b-th v-if="trabajadores.header" class="text-right">
            Dias Asists.
          </b-th>
          <b-td v-else>{{ trabajadores.fecha }}</b-td>
          <b-th v-if="trabajadores.header" variant="secondary">
            {{ trabajadores.dias - 1 }}
          </b-th>
          <b-td v-else>{{ trabajadores.asistencia }}</b-td>
          <b-td v-if="trabajadores.header"></b-td>
          <b-td v-else>{{ trabajadores.entrada }}</b-td>
          <b-td v-if="trabajadores.header"></b-td>
          <b-td v-else>{{ trabajadores.scomida }}</b-td>
          <b-th v-if="trabajadores.header">Hrs Total</b-th>
          <b-td v-else>{{ trabajadores.ecomida }}</b-td>
          <b-th
            v-if="trabajadores.header"
            colspan="2"
            variant="secondary"
            class="text-center"
          >
            {{ trabajadores.sumaHoras }}
          </b-th>
          <b-td v-else>{{ trabajadores.salida }}</b-td>
          <b-td v-if="!trabajadores.header">{{ trabajadores.trabajo }}</b-td>
          <b-td v-if="!trabajadores.header">{{ trabajadores.comida }}</b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'SPAZARAGOZA', text: 'Zaragoza' },
        { value: 'SPAOFICINA', text: 'Oficina' },
        { value: 'SPAVICTORIA', text: 'Victoria' },
        { value: 'SPAOLUTA', text: 'Oluta' },
        { value: 'SPAJALTIPAN', text: 'Jaltipan' },
        { value: 'SPABODEGA', text: 'Bodega' },
        { value: 'HUAMUCHL', text: 'Huamuchil', disabled: true },
      ],
      dateInit: '',
      dateEnd: '',
      utils,
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    sucursalFinded() {
      return 'SUCURSAL ' + this.$store.state.asistencia.sucursalFind
    },
    fechas() {
      return (
        'REPORTE DE ASISTENCIA DEL ' +
        this.$store.state.asistencia.dateInit +
        ' AL ' +
        this.$store.state.asistencia.dateEnd
      )
    },
    dataRefactor() {
      const datos = []
      let position = 0
      let positionHeader = 0
      this.$store.state.asistencia.data.data.forEach((dato) => {
        positionHeader = position
        datos.push({
          header: true,
          dias: 1,
          nombre: dato.nombre,
          fecha: 'Dias Asists.',
          ecomida: 'Hrs Total',
          sumaHoras: '0 Hrs 0 Min',
        })
        position++
        dato.asistencias.forEach((dia) => {
          datos[positionHeader].dias++
          position++
          const hrsWorkMonrning = utils.difHours(dia.entrada, dia.scomida)
          const hrsWorkArternon = utils.difHours(dia.ecomida, dia.salida)
          const hrsBreak = utils.difHours(dia.scomida, dia.ecomida)
          let hrsWork = ''
          if (dia.entrada === '') {
            if (dia.ecomida !== '') hrsWork = hrsWorkArternon
          } else if (dia.salida === '') {
            if (dia.scomida !== '') hrsWork = hrsWorkMonrning
          } else if (hrsBreak !== '')
            hrsWork = utils.sumHours(hrsWorkMonrning, hrsWorkArternon)
          else hrsWork = utils.difHours(dia.entrada, dia.salida)
          datos.push({
            header: false,
            fecha: dia.fecha,
            asistencia: 'SI',
            entrada: utils.formatWithMoment(dia.entrada, 'HH:mm:ss'),
            scomida: utils.formatWithMoment(dia.scomida, 'HH:mm:ss'),
            ecomida: utils.formatWithMoment(dia.ecomida, 'HH:mm:ss'),
            salida: utils.formatWithMoment(dia.salida, 'HH:mm:ss'),
            trabajo: hrsWork,
            comida: hrsBreak,
          })
          if (hrsWork !== '') {
            datos[positionHeader].sumaHoras = utils.sumHours(
              hrsWork,
              datos[positionHeader].sumaHoras
            )
          }
        })
      })
      return datos
    },
  },
  mounted() {
    const sucSel = this.$store.state.asistencia.sucursal
    this.selected = sucSel
    const dateNow = new Date()
    const now =
      dateNow.getFullYear() +
      '-' +
      utils.completeDateHour(dateNow.getMonth() + 1) +
      '-' +
      utils.completeDateHour(dateNow.getDate())
    this.dateInit = now
    this.dateEnd = now
  },
  methods: {
    ...mapMutations({
      setSucursal: 'asistencia/setSucursal',
      setDateInit: 'asistencia/setDateInit',
      setDateEnd: 'asistencia/setDateEnd',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'asistencia/changeData',
    }),
    changeSuc(suc) {
      this.setSucursal(suc)
    },
    validateData() {
      if (
        this.$store.state.asistencia.sucursal === null ||
        this.$store.state.asistencia.sucursal === 'null'
      ) {
        this.showAlertDialog(['Necesita seleccionar una sucursal'])
        return false
      }
      if (this.dateInit === '') {
        this.showAlertDialog(['No ha seleccionado la fecha de inicio'])
        return false
      }
      if (this.dateEnd === '') {
        this.showAlertDialog(['No ha seleccionado la fecha final'])
        return false
      }
      return true
    },
    async updateConsolidaciones() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.changeData([
        this.dateInit.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
        this.$store.state.asistencia.sucursal,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.inputs {
  width: (33% - 8px);
  margin-bottom: 10px;
  display: inline-block;
}

@media screen and (max-width: 1200px) {
  .inputs {
    width: 49%;
  }

  #input-Sucursal {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .inputs {
    width: 100%;
  }
}
</style>
