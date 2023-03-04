<template>
  <div>
    <b-input-group prepend="Sucursal" class="mt-3">
      <b-form-select
        v-model="selected"
        :options="options"
        :disabled="!accessChangeSucursal"
      ></b-form-select>
    </b-input-group>
    <div class="containerInp">
      <b-input-group prepend="Fecha Inicio">
        <b-form-datepicker
          id="dateStart"
          v-model="dateStart"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de Inicio"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Fecha Fin">
        <b-form-datepicker
          id="dateEnd"
          v-model="dateEnd"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de Termino"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button variant="info" @click="loadData">
      <b-icon icon="search" />
      Buscar
    </b-button>

    <div class="content-titles">
      <img id="imgLogoSpa" class="imgLogo" src="@/assets/cesta.png" />
      <h1 class="mt-3">Informe Operativo Mensual</h1>
      <h3>Super Promociones de Acayucan</h3>
      <h5>{{ textDetail }}</h5>
    </div>
    <divider class="bg-info" />
    <divider class="mt-3 mb-0" />
    <h4 class="text-center mb-0 py-1">Ventas</h4>
    <divider class="mt-0" />
    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fieldsVentas"
      :items="dataVentas"
      :class="variantThemeTableBody"
      class="mt-2"
      small
    >
      <template #cell(Subtotal)="row">
        {{ formatNumber(row.item.Subtotal) }}
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.Ieps) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
    </b-table>
    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fieldsUAI"
      :items="dataUAI"
      :class="variantThemeTableBody"
      class="mt-2"
      small
    >
      <template #cell(UtilidadImporte)="row">
        {{ formatNumber(row.item.UtilidadImporte) }}
      </template>
      <template #cell(UtilidadPorcentaje)="row">
        {{ formatNumber(row.item.UtilidadPorcentaje) }}
      </template>
    </b-table>
    <divider class="mt-3 mb-0" />
    <h4 class="text-center mb-0 py-1">Movimientos de Entrada</h4>
    <divider class="mt-0" />
    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fieldsME"
      :items="dataME"
      :class="variantThemeTableBody"
      class="mt-2"
      small
    >
      <template #cell(Subtotal)="row">
        {{ formatNumber(row.item.Subtotal) }}
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.Ieps) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
    </b-table>
    <divider class="mt-3 mb-0" />
    <h4 class="text-center mb-0 py-1">Movimientos de Salida</h4>
    <divider class="mt-0" />
    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fieldsME"
      :items="dataMS"
      :class="variantThemeTableBody"
      class="mt-2"
      small
    >
      <template #cell(Subtotal)="row">
        {{ formatNumber(row.item.Subtotal) }}
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.Ieps) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
    </b-table>
    <divider class="mt-3 mb-0" />
    <h4 class="text-center mb-0 py-1">Inventario</h4>
    <divider class="mt-0" />
    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fieldsME"
      :items="dataIF"
      :class="variantThemeTableBody"
      class="mt-2"
      small
    >
      <template #cell(Subtotal)="row">
        {{ formatNumber(row.item.Subtotal) }}
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.Ieps) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
    </b-table>
    <divider class="mt-3 mb-0" />
    <h4 class="text-center mb-0 py-1">Otros Servicios</h4>
    <divider class="mt-0" />
    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fieldsME"
      :items="dataR"
      :class="variantThemeTableBody"
      class="mt-2"
      small
    >
      <template #cell(Subtotal)="row">
        {{ formatNumber(row.item.Subtotal) }}
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.Ieps) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
    </b-table>

    <divider class="mt-3 mb-0" />
    <h4 class="text-center mb-0 py-1">
      Ventas por Subfamilias
      <b-badge variant="info" pill> {{ rows }} </b-badge>
    </h4>
    <divider class="mt-0 mb-2" />

    <b-container v-if="dataVPS.length > 20" fluid="xl">
      <b-row cols="1" cols-sm="2">
        <b-col sm="3" md="2" class="mb-2">
          <b-form-select
            id="per-page-select"
            v-model="perPageVPS"
            :options="pageOptionsVPS"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="9" md="10" class="mb-2">
          <b-pagination
            v-model="currentPageVPS"
            aria-controls="tableInventarioValuacion"
            :total-rows="rows"
            :per-page="perPageVPS"
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
      hover
      head-variant="dark"
      outlined
      responsive
      :per-page="perPageVPS"
      :current-page="currentPageVPS"
      :fields="fieldsVPS"
      :items="dataVPS"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(CostoValor)="row">
        {{ formatNumber(row.item.CostoValor) }}
      </template>
      <template #cell(Venta)="row">
        {{ formatNumber(row.item.Venta) }}
      </template>
      <template #cell(Utilidad)="row">
        {{ formatNumber(row.item.Utilidad) }}
      </template>
      <template #cell(Porcentaje)="row">
        {{ formatNumber(row.item.Porcentaje) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import Divider from '../components/Divider.vue'

export default {
  components: { Divider },
  data() {
    return {
      perPageVPS: 10,
      pageOptionsVPS: [10, 15, 20],
      currentPageVPS: 1,
      selected: 'ZR',
      dateStart: '',
      dateEnd: '',
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'TF', text: 'Tortilleria Acayucan F.', disabled: true },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'TY', text: 'Sayula Tortilleria', disabled: true },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
      fieldsVentas: ['Tipo', 'Subtotal', 'Ieps', 'Iva', 'Total'],
      fieldsUAI: [
        { key: 'Tipo', label: 'Tipo' },
        { key: 'UtilidadImporte', label: '$ Utilidad Importe' },
        { key: 'UtilidadPorcentaje', label: '% Utilidad Porcentaje' },
      ],
      fieldsVPS: [
        'Subfamilia',
        { key: 'CostoValor', label: 'Costo Sin Impuesto' },
        { key: 'Venta', label: 'Venta Sin Impuesto' },
        { key: 'Utilidad', label: 'Utilidad $' },
        { key: 'Porcentaje', label: 'Utilidad %' },
      ],
      fieldsME: [
        'Tipo',
        'Subtotal',
        { key: 'IepsCosto', label: 'Ieps' },
        'Iva',
        'Total',
      ],
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    textDetail() {
      const option = [...this.options]
      const suc = option.reduce((optAcum, opt) => {
        if (
          opt.value === this.$store.state.informeoperativomensual.sucursalFind
        )
          optAcum = opt.text
        return optAcum
      }, '')

      const dateStart = this.$store.state.informeoperativomensual.dateStart
      const dateEnd = this.$store.state.informeoperativomensual.dateEnd
      const dateStartRefactor =
        dateStart.slice(6, 8) +
        '/' +
        dateStart.slice(4, 6) +
        '/' +
        dateStart.slice(0, 4)
      const dateEndRefactor =
        dateEnd.slice(6, 8) +
        '/' +
        dateEnd.slice(4, 6) +
        '/' +
        dateEnd.slice(0, 4)

      return (
        'MOVIMIENTOS DE SUC ' +
        suc +
        ' DEL ' +
        dateStartRefactor +
        ' AL ' +
        dateEndRefactor
      )
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataVentas() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[7].data
    },
    dataUAI() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[5].data
    },
    dataME() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[2].data
    },
    dataMS() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[3].data
    },
    dataIF() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[1].data
    },
    dataR() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[4].data
    },
    dataVPS() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[6].data
    },
    rows() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data[6].data.length
    },
  },
  mounted() {
    this.dateStart = utils.getDateNow().format('yyyy-MM-DD')
    this.dateEnd = utils.getDateNow().format('yyyy-MM-DD')
    this.setSucursalForUser()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'informeoperativomensual/setSucursal',
    }),
    ...mapActions({
      changeData: 'informeoperativomensual/changeData',
    }),
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
    async loadData() {
      const sucursal = this.$store.state.informeoperativomensual.sucursal
      const dateStart = this.dateStart.replace(/-/g, '')
      const dateEnd = this.dateEnd.replace(/-/g, '')
      this.setLoading(true)
      const response = await this.changeData([sucursal, dateStart, dateEnd])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
  },
}
</script>

<style scoped>
.content-titles {
  text-align: left;
  height: max-content;
  min-height: 100px;
}

.imgLogo {
  width: 100px;
  height: 100px;
  float: left;
  margin-right: 40px;
}

.canvasLogo {
  position: fixed;
  top: 100px;
  left: -250px;
  z-index: 11;
}

.containerInp {
  display: inline-block;
  margin-top: 7px;
}

@media screen and (max-width: 1000px) {
  .containerInp {
    display: block;
  }
}
</style>
