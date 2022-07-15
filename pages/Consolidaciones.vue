<template>
  <div class="container-consolidaciones">
    <div class="footerConexiones">
      <span class="mr-3 mt-2">
        <span class="font-weight-bold">Sucursal: </span>
        {{ sucursal }}
      </span>
      <b-button
        v-if="accessChangeSucursal"
        variant="success"
        @click="alertShow = true"
      >
        Cambiar sucursal
      </b-button>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="dateStart"
          v-model="dateStar"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Al">
        <b-form-datepicker id="dateEnd" v-model="dateEnd"></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button
      variant="success"
      :block="width < 1100"
      :class="{ 'mt-2': width < 1100 }"
      @click="updateConsolidaciones"
    >
      Buscar
    </b-button>

    <div></div>

    <b-button-group size="md mt-4">
      <b-button
        :pressed="!showDetails"
        variant="outline-info"
        @click="setShowDetails(false)"
      >
        Lista De Consolidaciones
      </b-button>
      <b-button
        :pressed="showDetails"
        variant="outline-info"
        @click="setShowDetails(true)"
      >
        Detalles de consolidacion
      </b-button>
    </b-button-group>
    <div class="line-buttons bg-info"></div>

    <div v-if="!showDetails">
      <b-table
        v-if="width > 991"
        id="tableConsolidaciones"
        responsive
        striped
        hover
        :fields="fields"
        :items="dataRefactor"
        head-variant="dark"
        class="mt-3"
        :class="variantThemeTableBody"
      >
        <template #cell(Articulos)="row">
          <b-badge
            pill
            variant="info"
            class="py-1 px-2"
            style="font-size: 14px"
          >
            {{ row.item.Articulos }}
          </b-badge>
        </template>
        <template #cell(Fecha)="row">
          {{ utils.toDate(row.item.Fecha) }}
        </template>
        <template #cell(Hora)="row">
          {{ utils.toHour(row.item.Hora) }}
        </template>
        <template #cell(Detalles)="row">
          <b-button variant="info" size="sm" @click="viewDetails(row.item)">
            Detalles
          </b-button>
        </template>
      </b-table>
      <div v-else>
        <b-card
          v-for="(consolidacion, indexConsolidacion) in dataRefactor"
          :key="indexConsolidacion"
          no-body
          class="containerCard"
          :class="variantTheme"
        >
          <div :class="getColorClass(consolidacion.Estatus)">
            <span class="float-right">
              {{ consolidacion.Estatus }}
            </span>
            <div class="container-transferencia">
              <span class="font-weight-bold">Transferencia:</span>
              {{ consolidacion.Transferencia }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Entrada:</span>
              {{ consolidacion.Entrada }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Referencia:</span>
              {{ consolidacion.Referencia }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Destino:</span>
              {{ consolidacion.AlmacenDestino }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Observaciones:</span>
              {{ consolidacion.Observaciones }}
            </div>
            <div class="d-block">
              <span class="font-italic float-right">
                {{ utils.toDate(consolidacion.Fecha) }}
                {{ utils.toHour(consolidacion.Hora) }}
              </span>
            </div>
          </div>
        </b-card>
      </div>
    </div>
    <ConsolidacionesDetails
      v-else
      :transferencia-actual="transferenciaActual"
      :sucursales="sucursales"
    />

    <b-modal
      id="alertSucursal"
      :visible="alertShow"
      title="Cambiando sucursal"
      header-bg-variant="warning"
      header-text-variant="white"
      :centered="true"
    >
      <b-container fluid>
        <b-form-select
          :value="suc"
          :options="options"
          @change="selectSucursal"
        ></b-form-select>
      </b-container>

      <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="updateSucursal"
          >
            Aceptar
          </b-button>
          <b-button
            variant="secondary"
            size="sm"
            class="float-right mr-2"
            @click="hideAlertDialog"
          >
            Cancelar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ConsolidacionesDetails from '../components/ConsolidacionesDetails'
import utils from '../modules/utils'

export default {
  components: {
    ConsolidacionesDetails,
  },
  data() {
    return {
      alertShow: false,
      dateStar: '',
      dateEnd: '',
      fields: [
        'Fecha',
        'Hora',
        'Transferencia',
        'Articulos',
        'Entrada',
        'Referencia',
        'AlmacenDestino',
        'Observaciones',
        'Estatus',
        'Detalles',
      ],
      utils,
      sucursales: {
        ZR: 'SPAZARAGOZA',
        VC: 'SPAVICTORIA',
        OU: 'SPAOLUTA',
        JL: 'SPAJALTIPAN',
        ER: 'SPAENRIQUEZ',
        SY: 'SPASAYULA',
        BO: 'SPABODEGA',
      },
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      transferenciaActual: {},
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
    showDetails() {
      return this.$store.state.consolidaciones.showDetails
    },
    dataRefactor() {
      const datos = []
      this.$store.state.consolidaciones.data.data.forEach((consolidacion) => {
        const data = { ...consolidacion }
        if (data.Estatus === 'Fallo') data._rowVariant = 'warning'
        else if (data.Estatus !== 'Exito') data._rowVariant = 'danger'
        datos.push(data)
      })
      return datos
    },
    sucursal() {
      const sucursales = this.sucursales
      return sucursales[`${this.$store.state.consolidaciones.sucursal}`]
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    suc() {
      return this.$store.state.consolidaciones.sucursal
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
  },
  mounted() {
    const tableConsolidaciones = document.getElementById('tableConsolidaciones')
    const dateNow = new Date()
    const now =
      dateNow.getFullYear() +
      '-' +
      utils.completeDateHour(dateNow.getMonth() + 1) +
      '-' +
      utils.completeDateHour(dateNow.getDate())
    this.dateStar = now
    this.dateEnd = now

    this.selected = this.$store.state.consolidaciones.sucursal

    if (tableConsolidaciones) {
      tableConsolidaciones.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableConsolidaciones.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
    this.$root.$on('bv::modal::hidden', (evt) => {
      if (evt.componentId === 'alertSucursal') {
        this.hideAlertDialog()
      }
    })

    this.setSucursalForUser()
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'consolidaciones/setSucursal',
      setShowDetails: 'consolidaciones/setShowDetails',
    }),
    ...mapActions({
      changeData: 'consolidaciones/changeData',
      loadDetails: 'consolidaciones/loadDetails',
    }),
    stateBtn(from) {
      if (from === 'list') {
        this.stateList = true
        this.stateDetails = false
      } else {
        this.stateList = false
        this.stateDetails = true
      }
    },
    getColorClass(estatus) {
      if (estatus === 'Fallo') return 'container-info-warning'
      else if (estatus === 'Exito') return 'container-info'
      else return 'container-info-danger'
    },
    async viewDetails(data) {
      this.setLoading(true)
      const response = await this.loadDetails([
        this.$store.state.consolidaciones.sucursal,
        data.Transferencia,
        data,
      ])
      this.setLoading(false)
      this.transferenciaActual = data
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    async updateConsolidaciones() {
      this.setLoading(true)
      const response = await this.changeData([
        this.dateStar.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
        this.$store.state.consolidaciones.sucursal,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.setShowDetails(false)
    },
    selectSucursal(sucursal) {
      this.selected = sucursal
    },
    updateSucursal() {
      this.hideAlertDialog()
      if (this.selected === null)
        this.showAlertDialog([
          'Falta seleccionar una sucursal',
          'Error al cambiar sucursal',
        ])
      else this.setSucursal(this.selected)
    },
    hideAlertDialog() {
      this.alertShow = false
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
  },
}
</script>

<style scoped>
.line-buttons {
  margin-bottom: 20px;
  width: calc(100% - 5px);
  margin-left: 5px;
  height: 1px;
  margin-top: -1px;
}

.container-transferencia {
  display: inline-block;
  max-width: 320px;
  width: 100%;
  margin: 5px;
}

.containerCard {
  padding: 0px;
  margin: 10px 0px 0px 0px;
}

.container-info-danger {
  padding: 10px;
  background: rgba(173, 1, 1, 0.712);
  border-radius: 3px;
  color: #fff;
}

.container-info-warning {
  padding: 10px;
  background: rgba(251, 255, 29, 0.596);
  border-radius: 3px;
  color: #000;
}

.container-info {
  padding: 10px;
  border-radius: 3px;
}

.container-consolidaciones {
  padding-top: 10px;
  padding-bottom: 60px;
}

.footerConexiones {
  background: rgba(196, 167, 167, 0.411);
  width: 100%;
  padding: 10px;
  padding-right: 10px;
  margin-bottom: 30px;
}

.containerInp {
  display: inline-block;
  margin-top: 7px;
}

@media screen and (max-width: 1100px) {
  .containerInp {
    display: block;
  }
}
</style>
