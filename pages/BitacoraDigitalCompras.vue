<template>
  <div>
    <h2 class="text-center my-3">Bitacora de Compras</h2>
    <b-input-group prepend="Sucursal" class="my-3">
      <b-form-select
        v-model="selected"
        :options="options"
        :disabled="!accessChangeSucursal"
        @change="setSucursal"
      ></b-form-select>
    </b-input-group>
    <span>
      <b-button variant="success" @click="openCard(false, {})">
        <b-icon icon="plus-circle-fill" />
        Agregar
      </b-button>
      <b-button variant="info" @click="loadListCompras(undefined)">
        <b-icon icon="arrow-repeat" />
        Refrescar
      </b-button>
      <b-button variant="danger" to="/bitacorareporte">
        <b-icon icon="file-earmark-pdf-fill" />
        Ir a Reportes
      </b-button>
      <b-button variant="warning" @click="viewEmpty(true)">
        <b-icon icon="card-heading" />
        Crear Folio Vacio
      </b-button>
    </span>
    <span class="groupDate">
      <b-button-group>
        <b-button
          :pressed="activeDateT"
          variant="outline-primary"
          @click="setActiveDate('today')"
        >
          Hoy
        </b-button>
        <b-button
          :pressed="activeDateM"
          variant="outline-primary"
          @click="setActiveDate('month')"
        >
          {{ textDateM }}
        </b-button>
        <b-button
          :pressed="activeDateY"
          variant="outline-primary"
          @click="setActiveDate('year')"
        >
          {{ textDateY }}
        </b-button>
        <b-button
          :pressed="activeDateA"
          variant="outline-primary"
          @click="setActiveDate('all')"
        >
          Todas
        </b-button>
      </b-button-group>
    </span>

    <b-container v-if="dataRefactor.length > 20" fluid="xl" class="mt-3">
      <b-row cols="1" cols-sm="2">
        <b-col sm="3" md="2" class="mb-2">
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="9" md="10" class="mb-2">
          <b-pagination
            v-model="currentPage"
            aria-controls="tableInventarioValuacion"
            :total-rows="rows"
            :per-page="perPage"
            align="fill"
            size="sm"
            first-number
            class="my-0"
            last-number
          >
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      id="tablePedidoSujerido"
      responsive
      striped
      hover
      sticky-header="700px"
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="my-3"
      :class="variantThemeTableBody"
    >
      <template #cell(Fecha)="row">
        {{ parseFecha(row.item.Fecha) }}
      </template>
      <template #cell(Subtotal)="row">
        {{ formatNumber(row.item.Subtotal) }}
      </template>
      <template #cell(Descuento)="row">
        {{ formatNumber(row.item.Descuento) }}
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.Ieps) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
      </template>
      <template #cell(Acciones)="row">
        <b-button variant="warning" size="sm" @click="openCard(true, row.item)">
          <b-icon icon="pencil" /> Editar
        </b-button>
      </template>
    </b-table>
    <div v-if="viewCard" class="container-tarjeta">
      <BitacoraDigitalComprasTarjeta
        :selected="selected"
        :change-suc-local="changeSucLocal"
        :load-list-compras="loadListCompras"
        :editing="editing"
        :body="body"
      />
    </div>
    <div v-if="formEmpty.view" class="container-empty">
      <b-card
        header-bg-variant="warning"
        header-text-variant="dark"
        text-variant="dark"
        style="width: 100%; max-width: 500px; margin: auto; margin-top: 100px"
      >
        <template #header>
          <h6 class="title-card">Agregando Folio</h6>
          <b-icon icon="x-lg" class="close-card" @click="viewEmpty(false)">
          </b-icon>
        </template>

        <b-form class="p-2">
          <b-input-group prepend="Sucursal" class="my-3">
            <b-form-select
              v-model="formEmpty.sucursal"
              :options="options"
            ></b-form-select>
          </b-input-group>

          <b-input-group prepend="Fecha" class="mb-3 p-0 mr-2">
            <b-form-datepicker
              v-model="formEmpty.fecha"
              locale="es-MX"
              today-button
              label-no-date-selected="Fecha no seleccionada"
              label-calendar="Calendario"
              label-current-month="Mes Actual"
              label-next-month="Mes Siguiente"
              label-prev-month="Mes Anterior"
              label-next-year="Año Siguiente"
              label-prev-year="Año anterior"
              label-help="Seleccione la fecha de Corte"
              label-today-button="Hoy"
            ></b-form-datepicker>
          </b-input-group>

          <b-button variant="success" block @click="prepareCreateEmpty">
            Generar
          </b-button>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import BitacoraDigitalComprasTarjeta from '../components/BitacoraDigitalComprasTarjeta.vue'

export default {
  components: {
    BitacoraDigitalComprasTarjeta,
  },
  data() {
    return {
      perPage: 15,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      selected: 'ZR',
      editing: false,
      body: {},
      formEmpty: {
        sucursal: 'ZR',
        fecha: '',
        view: false,
      },
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'SC', text: 'SPASOCONUSCO' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      fields: [
        { key: 'Sucursal', label: 'Suc' },
        'Fecha',
        'Folio',
        'Proveedor',
        'Subtotal',
        'Ieps',
        'Iva',
        'Total',
        'Descuento',
        'Estatus',
        'Acciones',
      ],
      activeDateY: false,
      activeDateM: false,
      activeDateT: true,
      activeDateA: false,
      textDateY: '',
      textDateM: '',
      active: 'today',
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    viewCard() {
      return this.$store.state.bitacoradigitalcompras.view === 'SI'
    },
    dataRefactor() {
      let datos = []
      datos = this.$store.state.bitacoradigitalcompras.data.data
      return datos.filter((row, index) => {
        const fecha = utils.toMoment(row.Fecha)
        const today = utils.getDateNow()
        if (this.active === 'today') {
          if (fecha.isSame(today, 'day')) return row
        } else if (this.active === 'month') {
          if (fecha.isSame(today, 'month')) return row
        } else if (this.active === 'year') {
          if (fecha.isSame(today, 'year')) return row
        } else return row
      })
    },
    rows() {
      return this.dataRefactor.length
    },
  },
  mounted() {
    this.setSucursalForUser()
    const date = new Date()
    this.textDateY = date.getFullYear().toString()
    this.textDateM = utils._arrayMonths[date.getMonth()] + '/' + this.textDateY
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'bitacoradigitalcompras/setSucursal',
      setView: 'bitacoradigitalcompras/setView',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      getBitacoraCompras: 'bitacoradigitalcompras/getBitacoraCompras',
    }),
    viewEmpty(view) {
      this.formEmpty.view = view
    },
    openCard(editing, body) {
      this.editing = editing
      this.body = body
      this.setView('SI')
    },
    changeSucLocal(suc) {
      this.selected = suc
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        this.selected = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(this.selected)
      } else {
        const sucSelected = this.$store.state.bitacoradigitalcompras.sucursal
        this.selected = sucSelected
      }
    },
    formatNumber(value) {
      if (!value) return '0.00'
      if (value === 'Offline') return value
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    parseFecha(fecha) {
      if (!fecha) return '--'
      return utils.toMoment(fecha).format('DD/MM/YYYY')
    },
    setActiveDate(from) {
      this.active = from
      this.activeDateY = false
      this.activeDateA = false
      this.activeDateM = false
      this.activeDateT = false
      if (this.active === 'month') this.activeDateM = true
      else if (this.active === 'year') this.activeDateY = true
      else if (this.active === 'today') this.activeDateT = true
      else if (this.active === 'all') this.activeDateA = true
    },
    async loadListCompras(fecha) {
      const sucursal = this.$store.state.bitacoradigitalcompras.sucursal || 'ZR'
      this.setLoading(true)
      const response = await this.getBitacoraCompras([sucursal, fecha])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    validateFormEmpty() {
      if (this.formEmpty.sucursal.trim() === '') {
        this.showAlertDialog(['No ha seleccionado una sucursal', 'Campo vacio'])
        return false
      }
      if (this.formEmpty.fecha.trim() === '') {
        this.showAlertDialog(['No ha seleccionado una fecha', 'Campo vacio'])
        return false
      }
      return true
    },
    prepareCreateEmpty() {
      if (!this.validateFormEmpty()) return false
      const msj = `¿Quiere generar el codigo vacio para la sucursal [${this.formEmpty.sucursal}] en la fecha (${this.formEmpty.fecha})?`

      this.showAlertDialogOption([
        msj,
        'Generando Folio',
        () => {
          this.hideAlertDialogOption()
          this.pushFolioEmpty()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async pushFolioEmpty() {
      try {
        const fecha = this.formEmpty.fecha.replaceAll('-', '')
        const body = { sucursal: this.formEmpty.sucursal, fecha }

        const url =
          process.env.spastore_url_backend +
          'api/v1/bitacoradigital/compras/empty'
        const response = await this.$axios({
          url,
          method: 'post',
          data: body,
        })

        if (response.data.success) {
          this.showAlertDialog(['Folio Generado', 'Exito', 'success'])
          this.viewEmpty(false)
          this.loadListCompras(fecha)
        } else this.showAlertDialog(['Fallo al generar el folio', 'Fallo'])
      } catch (error) {
        if (error.response)
          this.showAlertDialog([
            error.response.data.message,
            'Fallo con el servidor',
          ])
        else
          this.showAlertDialog([
            'Ocurrio un error durante el proceso',
            'Fallo con el servidor',
          ])
      }
    },
  },
}
</script>

<style scoped>
.groupDate {
  float: right;
  margin-top: 5px;
}

.container-tarjeta,
.container-empty {
  position: fixed;
  z-index: 15;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: #0000009e;
  padding: 20px;
}

.title-card {
  margin: 0px;
  display: inline-block;
}

.close-card {
  float: right;
}
</style>
