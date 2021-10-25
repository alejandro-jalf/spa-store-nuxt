<template>
  <div class="pt-3">
    <div id="input-Sucursal" class="inputs">
      <b-input-group prepend="Sucursal">
        <b-form-select v-model="selected" :options="options"></b-form-select>
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
    <div class="font-weight-bold">
      REPORTE DE ASISTENCIA DEL 18/10/2021 AL 22/10/2021
    </div>
    <div class="font-weight-bold">SUCURSAL SPAZARAGOZA</div>
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
            {{ trabajadores.dias }}
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
import utils from '../modules/utils'

export default {
  data() {
    return {
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'OU', text: 'Oluta' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
        { value: 'HU', text: 'Huamuchil', disabled: true },
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
}
</script>

<style scoped>
.inputs {
  width: 33%;
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
