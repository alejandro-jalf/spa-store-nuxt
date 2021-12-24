<template>
  <div>
    <h1 class="text-center">Validacion de inventario</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-button variant="info" @click="validaInventario">Buscar</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-container fluid="xl">
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
      id="tableInventarioValuacion"
      responsive
      outlined
      hover
      head-variant="dark"
      :per-page="perPage"
      :current-page="currentPage"
      :items="inventarioList"
      :fields="fields"
      :class="variantThemeTableBody"
      foot-clone
    >
      <template #cell(Existencia)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Existencia, 3)) }}
      </template>
      <template #cell(UCosto)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.UCosto)) }}
      </template>
      <template #cell(Valuacion)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Valuacion)) }}
      </template>
      <template #cell(Ieps)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Ieps)) }}
      </template>
      <template #cell(Iva)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Iva)) }}
      </template>
      <template #cell(ValuacionNeta)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.ValuacionNeta)) }}
      </template>
      <template #foot(Articulo)>{{ '' }}</template>
      <template #foot(Nombre)>{{ '' }}</template>
      <template #foot(Existencia)>{{ '' }}</template>
      <template #foot(UCosto)>{{ 'Totales' }}</template>
      <template #foot(Valuacion)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalValuacion))
      }}</template>
      <template #foot(Ieps)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalIeps))
      }}</template>
      <template #foot(Iva)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalIva))
      }}</template>
      <template #foot(ValuacionNeta)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalValuacionNeta))
      }}</template>
      <template #foot(Acciones)>{{ '' }}</template>
    </b-table>

    <h5 class="font-italic">{{ horaConsulta }}</h5>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      fields: [
        'Articulo',
        'Nombre',
        'Existencia',
        'UCosto',
        'Valuacion',
        'Ieps',
        'Iva',
        'ValuacionNeta',
        'Acciones',
      ],
      totalValuacion: 0,
      totalIeps: 0,
      totalIva: 0,
      totalValuacionNeta: 0,
      perPage: 15,
      currentPage: 3,
      pageOptions: [5, 10, 15, 20, 50, 100],
      selected: null,
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
        { value: 'BO%TRANSITO', text: 'SPABODEGA - TRANSITO' },
        { value: 'BO%ESPERANZA', text: 'SPABODEGA - LA ESPERANZA' },
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
    inventarioList() {
      const datos = []
      const lengthDatos = this.$store.state.valuacioninventario.data.data.length
      let totalValuacion = 0
      let totalIeps = 0
      let totalIva = 0
      let totalValuacionNeta = 0
      this.$store.state.valuacioninventario.data.data.forEach(
        (validacion, index) => {
          const data = { ...validacion }

          totalValuacion += data.Valuacion
          totalIeps += data.IepsValuacion
          totalIva += data.IvaValuacion
          totalValuacionNeta += data.ValuacionNeta

          data.UCosto = data.UltimoCosto
          data.Ieps = data.IepsValuacion
          data.Iva = data.IvaValuacion
          if (index === lengthDatos - 1) {
            this.totalValuacion = totalValuacion
            this.totalIeps = totalIeps
            this.totalIva = totalIva
            this.totalValuacionNeta = totalValuacionNeta
          }
          datos.push(data)
        }
      )
      return datos
    },
    rows() {
      return this.$store.state.valuacioninventario.data.data.length
    },
    horaConsulta() {
      return this.$store.state.valuacioninventario.horaConsulta
    },
    suc() {
      return this.$store.state.valuacioninventario.sucursal
    },
  },
  mounted() {
    this.selected = this.$store.state.valuacioninventario.sucursal
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
      setHoraConsulta: 'valuacioninventario/setHoraConsulta',
      setSucursal: 'valuacioninventario/setSucursal',
      setAlmacen: 'valuacioninventario/setAlmacen',
      setTienda: 'valuacioninventario/setTienda',
    }),
    ...mapActions({
      changeData: 'valuacioninventario/changeData',
    }),
    selectSucursal(sucursal) {
      if (sucursal === null) return false
      const sucArray = sucursal.split('%')
      this.setSucursal(sucursal)
      if (sucArray.length > 1) {
        this.selected = sucArray[0]
        if (sucArray[1] === 'TRANSITO') {
          this.setTienda(6)
          this.setAlmacen(15)
        } else {
          this.setTienda(6)
          this.setAlmacen(1)
        }
      } else if (sucursal === 'BO') {
        this.selected = sucursal
        this.setTienda(6)
        this.setAlmacen(21)
      } else if (sucursal === 'ZR') {
        this.selected = sucursal
        this.setTienda(1)
        this.setAlmacen(2)
      } else if (sucursal === 'VC') {
        this.selected = sucursal
        this.setTienda(2)
        this.setAlmacen(3)
      } else if (sucursal === 'OU') {
        this.selected = sucursal
        this.setTienda(5)
        this.setAlmacen(19)
      } else if (sucursal === 'JL') {
        this.selected = sucursal
        this.setTienda(4)
        this.setAlmacen(7)
      }
    },
    async validaInventario() {
      if (this.selected === null)
        this.showAlertDialog(['Falta seleccionar sucursal'])
      else {
        this.setLoading(true)
        const sucursal = this.$store.state.valuacioninventario.sucursal.split(
          '%'
        )
        const response = await this.changeData([
          sucursal[0],
          this.$store.state.valuacioninventario.tienda,
          this.$store.state.valuacioninventario.almacen,
        ])
        this.setLoading(false)
        if (!response.success)
          this.showAlertDialog([response.message, 'Error inesperado'])
        else {
          this.setHoraConsulta(
            utils.getDateNow().format('DD/MM/YYYY hh:mm:ss a')
          )
        }
      }
    },
  },
}
</script>

<style scoped>
.prevPagination {
  background: green;
  color: white;
}
</style>
