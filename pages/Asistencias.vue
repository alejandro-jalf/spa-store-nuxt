<template>
  <div class="pt-3">
    <div id="input-Sucursal" class="inputs">
      <b-input-group prepend="Suc">
        <b-form-select
          v-model="selected"
          :options="options"
          @change="changeSuc"
        ></b-form-select>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="date-init"
          v-model="dateInit"
          label-no-date-selected="Fecha no seleccionada"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Al">
        <b-form-datepicker
          id="date-end"
          v-model="dateEnd"
          label-no-date-selected="Fecha no seleccionada"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button
      variant="info"
      :block="width < 992"
      @click="updateConsolidaciones"
    >
      <b-icon icon="search"></b-icon>
      <span v-if="width < 992">Buscar</span>
    </b-button>
    <div v-if="!firstSession">
      <div class="font-weight-bold mt-2">
        {{ fechas }}
      </div>
      <div class="font-weight-bold">{{ sucursalFinded }}</div>
      <b-button :variant="variantSuccess" class="mt-2" @click="createPdf">
        <b-icon icon="download"></b-icon>
        Descargar
      </b-button>
      <b-button :variant="variantClean" class="mt-2" @click="cleanData">
        <b-icon icon="ui-checks" />
        Limpiar lista de asistencias
      </b-button>
    </div>
    <h3 v-if="emptyData && !firstSession" class="mt-3 text-danger text-center">
      ¡No se encontraron registros de asistencias entre estas fechas!
    </h3>
    <div v-else>
      <b-table-simple
        v-if="width > 767"
        id="tableAsistencias"
        hover
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
            <b-td
              v-if="trabajadores.header"
              :rowspan="trabajadores.dias"
              class="nameTable"
            >
              {{ trabajadores.nombre }}
            </b-td>
            <b-th v-if="trabajadores.header" class="text-right">
              Dias Asists.
            </b-th>
            <b-th v-else>{{ trabajadores.fecha }}</b-th>
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
            <b-th v-if="!trabajadores.header">{{ trabajadores.trabajo }}</b-th>
            <b-th v-if="!trabajadores.header">{{ trabajadores.comida }}</b-th>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <div v-else>
        <asistencias-card
          v-for="(trabajadores, indexCard) in dataRefactor"
          :key="indexCard"
          :trabajador="trabajadores"
          :show-details="openDetails"
        />
      </div>
    </div>
    <b-modal
      ref="modalDetalles"
      header-bg-variant="info"
      header-text-variant="white"
      centered
      scrollable
    >
      <template #modal-header>
        <div class="headerTitle">{{ detalles.nombre }}</div>
      </template>
      <div class="text-dark">
        Hrs Total:
        <span class="font-weight-bold">{{ detalles.sumaHoras }}</span>
      </div>
      <div
        v-for="(asistencia, indexAsist) in detalles.asistencias"
        :key="indexAsist"
        class="containerAsistencias"
      >
        <hr />
        <div class="fechaTrabajador">{{ asistencia.fecha }}</div>
        <div>
          <span class="font-weight-bold">Entrada:</span>
          {{ asistencia.entrada }}
        </div>
        <div>
          <span class="font-weight-bold">S. Comida:</span>
          {{ asistencia.scomida }}
        </div>
        <div>
          <span class="font-weight-bold">E. Comida:</span>
          {{ asistencia.ecomida }}
        </div>
        <div>
          <span class="font-weight-bold">Salida:</span>
          {{ asistencia.salida }}
        </div>
        <div class="text-right">
          <span class="font-weight-bold">Trabajo:</span>
          {{ asistencia.trabajo }}
        </div>
        <div class="text-right">
          <span class="font-weight-bold">Comida:</span>
          {{ asistencia.comida }}
        </div>
      </div>
      <template #modal-footer>
        <div class="asistDias text-dark">
          Dias Asist: <span class="font-weight-bold">{{ detalles.dias }}</span>
        </div>
        <b-button variant="info" @click="closeDetails">Cerrar</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import AsistenciasCard from '../components/AsistenciasCard'

export default {
  components: {
    AsistenciasCard,
  },
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
      detalles: {
        nombre: '',
        sumaHoras: '',
        dias: 5,
        asistencias: {},
      },
    }
  },
  computed: {
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    firstSession() {
      return this.$store.state.asistencia.data.firstSession
    },
    emptyData() {
      return this.$store.state.asistencia.data.data.length === 0
    },
    width() {
      return this.$store.state.general.widthWindow
    },
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
            nombre: dato.nombre,
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
    const tableAsistencias = document.getElementById('tableAsistencias')
    const sucSel = this.$store.state.asistencia.sucursal
    this.selected = sucSel
    this.setDateInitials()

    if (tableAsistencias) {
      tableAsistencias.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableAsistencias.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setSucursal: 'asistencia/setSucursal',
      setDateInit: 'asistencia/setDateInit',
      setDateEnd: 'asistencia/setDateEnd',
      cleanData: 'asistencia/cleanData',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'asistencia/changeData',
    }),
    openDetails(trabajador) {
      const asistencias = this.dataRefactor.reduce((acumDetails, t) => {
        if (t.nombre === trabajador.nombre && !t.header)
          acumDetails.push({
            fecha: t.fecha,
            entrada: t.entrada,
            scomida: t.scomida,
            ecomida: t.ecomida,
            salida: t.salida,
            trabajo: t.trabajo,
            comida: t.comida,
          })
        return acumDetails
      }, [])

      this.detalles = {
        nombre: trabajador.nombre,
        dias: trabajador.dias,
        sumaHoras: trabajador.sumaHoras,
        asistencias,
      }
      this.$refs.modalDetalles.show()
    },
    closeDetails() {
      this.$refs.modalDetalles.hide()
    },
    createPdf() {
      const dataSuc = utils.getDataSucursal(
        this.$store.state.asistencia.sucursalFind
      )
      if (dataSuc === null) {
        this.showAlertDialog(['Sucursal no encontrada'])
        return false
      }

      const fechaActual = utils.getDateNow().format('DD/MM/YYYY hh:mm:ss a')

      utils.createPdfAsistenciasSpa(
        dataSuc.empresa,
        dataSuc.direccion,
        dataSuc.municipio,
        this.fechas,
        this.sucursalFinded,
        this.dataRefactor,
        fechaActual
      )
    },
    setDateInitials() {
      const dayActual = utils.getDateNow().day()
      const saturday = utils.getDateNow().add(-(dayActual + 1), 'days')
      const friday = utils.getDateNow().add(5 - dayActual, 'days')
      this.dateInit = saturday.format('yyyy-MM-DD')
      this.dateEnd = friday.format('yyyy-MM-DD')
    },
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
.headerTitle {
  font-size: 16px;
  font-weight: bold;
}

.asistDias {
  position: absolute;
  left: 15px;
  bottom: 18px;
}

.containerAsistencias {
  position: relative;
  color: #000;
}

.fechaTrabajador {
  position: absolute;
  top: -12px;
  left: 0px;
  font-weight: bold;
  border-radius: 5px;
  padding: 2px 5px;
  background: rgb(1, 143, 224);
  color: #fff;
}

.inputs {
  width: (33% - 8px);
  margin-bottom: 10px;
  display: inline-block;
}

@media screen and (max-width: 1199px) {
  .inputs {
    width: calc(49% - 19px);
  }

  #input-Sucursal {
    width: 100%;
  }

  .nameTable {
    width: 250px;
  }
}

@media screen and (max-width: 991px) {
  .inputs {
    width: calc(49% + 2px);
  }
}

@media screen and (max-width: 767px) {
  .inputs {
    width: 100%;
  }
}
</style>
