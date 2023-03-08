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
    <div v-if="!isEmpty">
      <b-button
        :variant="variantSuccess"
        :block="width < 528"
        class="mt-2 mb-1"
        @click="createPdf(false)"
      >
        <b-icon icon="download" />
        Generar Excel
      </b-button>
      <b-button
        :variant="variantSuccess"
        :block="width < 528"
        class="mt-2 mb-1"
        @click="createPdf(false)"
      >
        <b-icon icon="download" />
        Descargar PDF
      </b-button>
      <b-button
        :variant="variantInfo"
        :block="width < 528"
        class="mb-1 mt-2"
        @click="createPdf(true)"
      >
        <b-icon icon="printer-fill" />
        Imprimir PDF
      </b-button>
    </div>
    <divider class="mt-2 mb-0" />
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
        {{ formatNumber(row.item.Total) }}
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
        {{ formatPercentage(row.item.UtilidadPorcentaje) }}
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
      <template #cell(IepsCosto)="row">
        {{ formatNumber(row.item.IepsCosto) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
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
      <template #cell(IepsCosto)="row">
        {{ formatNumber(row.item.IepsCosto) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
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
      <template #cell(IepsCosto)="row">
        {{ formatNumber(row.item.IepsCosto) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
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
      <template #cell(IepsCosto)="row">
        {{ formatNumber(row.item.IepsCosto) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.Iva) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
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
        {{ formatPercentage(row.item.Porcentaje) }}
      </template>
    </b-table>

    <divider class="mt-3 mb-0" />
    <h4 class="text-center mb-0 py-1">
      Compras por Subfamilias
      <b-badge variant="info" pill> {{ rowsCpS }} </b-badge>
    </h4>
    <divider class="mt-0 mb-2" />

    <b-container v-if="dataCPS.length > 20" fluid="xl">
      <b-row cols="1" cols-sm="2">
        <b-col sm="3" md="2" class="mb-2">
          <b-form-select
            id="per-page-select"
            v-model="perPageCPS"
            :options="pageOptionsCPS"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="9" md="10" class="mb-2">
          <b-pagination
            v-model="currentPageCPS"
            aria-controls="tableInventarioValuacion"
            :total-rows="rowsCpS"
            :per-page="perPageCPS"
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
      :per-page="perPageCPS"
      :current-page="currentPageCPS"
      :fields="fieldsCPS"
      :items="dataCPS"
      :class="variantThemeTableBody"
      class="mt-0 mb-5"
    >
      <template #cell(CostoValor)="row">
        {{ formatNumber(row.item.CostoValor) }}
      </template>
      <template #cell(IepsValorCosto)="row">
        {{ formatNumber(row.item.IepsValorCosto) }}
      </template>
      <template #cell(IvaValorCosto)="row">
        {{ formatNumber(row.item.IvaValorCosto) }}
      </template>
      <template #cell(CostoValorNeto)="row">
        {{ formatNumber(row.item.CostoValorNeto) }}
      </template>
    </b-table>

    <canvas
      id="canvas"
      class="canvasLogo"
      width="100px"
      height="100px"
    ></canvas>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { jsPDF } from 'jspdf'
import utils from '../modules/utils'
import Divider from '../components/Divider.vue'

export default {
  components: { Divider },
  data() {
    return {
      perPageVPS: 10,
      pageOptionsVPS: [10, 15, 20],
      currentPageVPS: 1,
      perPageCPS: 10,
      pageOptionsCPS: [10, 15, 20],
      currentPageCPS: 1,
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
        { key: 'UtilidadPorcentaje', label: '% Utilidad Porcentaje' },
        { key: 'UtilidadImporte', label: '$ Utilidad Importe' },
      ],
      fieldsVPS: [
        'Subfamilia',
        { key: 'CostoValor', label: 'Costo Sin Impuesto' },
        { key: 'Venta', label: 'Venta Sin Impuesto' },
        { key: 'Utilidad', label: 'Utilidad $' },
        { key: 'Porcentaje', label: 'Utilidad %' },
      ],
      fieldsCPS: [
        'Subfamilia',
        'CostoValor',
        'IepsValorCosto',
        'IvaValorCosto',
        'CostoValorNeto',
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
          opt.value ===
          this.$store.state.informeoperativomensual.sucursalConsult
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
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    isEmpty() {
      const data = this.$store.state.informeoperativomensual.data
      return data.data.length === 0
    },
    dataVentas() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[7].data
    },
    dataUAI() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[5].data
    },
    dataME() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[2].data
    },
    dataMS() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[3].data
    },
    dataIF() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[1].data
    },
    dataR() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[4].data
    },
    dataVPS() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[6].data
    },
    dataCPS() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return []
      return data.data[0].data
    },
    rows() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return 0
      return data.data[6].data.length
    },
    rowsCpS() {
      const data = this.$store.state.informeoperativomensual.data
      if (data.data.length === 0) return 0
      return data.data[0].data.length
    },
  },
  mounted() {
    this.dateStart = utils.getDateNow().format('yyyy-MM-DD')
    this.dateEnd = utils.getDateNow().format('yyyy-MM-DD')
    this.setSucursalForUser()
    this.loadDataImage()
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
    formatPercentage(value) {
      let rounded = utils.roundTo(value, 4) * 100
      if (rounded.toString().length > 5)
        rounded = Math.round(rounded * 100) / 100
      return rounded + '%'
    },
    loadDataImage() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const imageObject = document.getElementById('imgLogoSpa')
      context.drawImage(imageObject, 0, 0, 100, 100)
    },
    createPdf(preview) {
      const data = this.$store.state.informeoperativomensual.data.data
      const details = this.textDetail
      const suc = this.options.reduce((optAcum, opt) => {
        if (
          opt.value ===
          this.$store.state.informeoperativomensual.sucursalConsult
        )
          optAcum = opt.text
        return optAcum
      }, '')
      const logo = document.getElementById('canvas')
      this.createPdfTransferencias(suc, data, details, logo, preview)
    },
    createPdfTransferencias(sucursal, data, detalles, logo, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'letter')

      const dataVentas = data[7].data
      const dataUAI = data[5].data
      const dataME = data[2].data
      const dataMS = data[3].data
      const dataIF = data[1].data
      const dataR = data[4].data
      const dataVpS = data[6].data
      const dataCpS = data[0].data

      doc.setFontSize(16)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 125, 208)
      if (logo) {
        doc.text('INFORME OPERATIVO MENSUAL', 200, 18, 'right')
        doc.addImage(logo, 'PNG', 10, 11, 23, 23)
      } else doc.text('INFORME OPERATIVO MENSUAL', 105, 18, 'center')

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('SUPER PROMOCIONES DE ACAYUCAN SA DE CV', 200, 25, 'right')
      doc.setFontSize(13)
      doc.setFont('helvetica', 'normal')
      doc.text(detalles, 200, 31, 'right')

      doc.setFontSize(15)
      doc.setFont('helvetica', 'bold')

      doc.line(10, 38, 200, 38)
      doc.text('Ventas', 105, 43, 'center')
      doc.line(10, 45, 200, 45)

      const configHeader = {
        tableWidth: 190,
        margin: {
          left: 10,
        },
        styles: { fontSize: 10 },
        headStyles: {
          fontStyle: 'bold',
          halign: 'left',
          fillColor: [50, 50, 50],
          textColor: [255, 255, 255],
        },
        bodyStyles: { textColor: [0, 0, 0] },
      }

      let body = dataVentas.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Tipo },
          { content: this.formatNumber(dato.Subtotal) },
          { content: this.formatNumber(dato.Ieps) },
          { content: this.formatNumber(dato.Iva) },
          { content: this.formatNumber(dato.Total) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 47,
        ...configHeader,
        body,
        head: [['Tipo', 'Subtotal', 'Ieps', 'Iva', 'Total']],
      })

      let finalY = doc.lastAutoTable.finalY

      body = dataUAI.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Tipo },
          { content: this.formatPercentage(dato.UtilidadPorcentaje) },
          { content: this.formatNumber(dato.UtilidadImporte) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: finalY + 5,
        ...configHeader,
        body,
        head: [['Tipo', 'Utilidad Porcentual', 'Utilidad Importe']],
      })

      finalY = doc.lastAutoTable.finalY

      doc.line(10, finalY + 3, 200, finalY + 3)
      doc.text('Movimientos de Entrada', 105, finalY + 9, 'center')
      doc.line(10, finalY + 11, 200, finalY + 11)

      body = dataME.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Tipo },
          { content: this.formatNumber(dato.Subtotal) },
          { content: this.formatNumber(dato.Iva) },
          { content: this.formatNumber(dato.IepsCosto) },
          { content: this.formatNumber(dato.Total) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: finalY + 13,
        ...configHeader,
        body,
        head: [['Tipo', 'Subtotal', 'Ieps', 'Iva', 'Total']],
      })

      finalY = doc.lastAutoTable.finalY

      doc.line(10, finalY + 3, 200, finalY + 3)
      doc.text('Movimientos de Salida', 105, finalY + 9, 'center')
      doc.line(10, finalY + 11, 200, finalY + 11)

      body = dataMS.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Tipo },
          { content: this.formatNumber(dato.Subtotal) },
          { content: this.formatNumber(dato.Iva) },
          { content: this.formatNumber(dato.IepsCosto) },
          { content: this.formatNumber(dato.Total) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: finalY + 13,
        ...configHeader,
        body,
        head: [['Tipo', 'Subtotal', 'Ieps', 'Iva', 'Total']],
      })

      finalY = doc.lastAutoTable.finalY

      doc.line(10, finalY + 3, 200, finalY + 3)
      doc.text('Inventario', 105, finalY + 9, 'center')
      doc.line(10, finalY + 11, 200, finalY + 11)

      body = dataIF.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Tipo },
          { content: this.formatNumber(dato.Subtotal) },
          { content: this.formatNumber(dato.Iva) },
          { content: this.formatNumber(dato.IepsCosto) },
          { content: this.formatNumber(dato.Total) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: finalY + 13,
        ...configHeader,
        body,
        head: [['Tipo', 'Subtotal', 'Ieps', 'Iva', 'Total']],
      })

      finalY = doc.lastAutoTable.finalY

      doc.line(10, finalY + 3, 200, finalY + 3)
      doc.text('Otros Servicios', 105, finalY + 9, 'center')
      doc.line(10, finalY + 11, 200, finalY + 11)

      body = dataR.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Tipo },
          { content: this.formatNumber(dato.Subtotal) },
          { content: this.formatNumber(dato.Iva) },
          { content: this.formatNumber(dato.IepsCosto) },
          { content: this.formatNumber(dato.Total) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: finalY + 13,
        ...configHeader,
        body,
        head: [['Tipo', 'Subtotal', 'Ieps', 'Iva', 'Total']],
      })

      doc.addPage()

      doc.line(10, 10, 200, 10)
      doc.text('Ventas por Subfamilias', 105, 16, 'center')
      doc.line(10, 19, 200, 19)

      body = dataVpS.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Subfamilia },
          { content: this.formatNumber(dato.CostoValor) },
          { content: this.formatNumber(dato.Venta) },
          { content: this.formatNumber(dato.Utilidad) },
          { content: this.formatPercentage(dato.Porcentaje) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 21,
        ...configHeader,
        body,
        head: [
          [
            'Subfamilia',
            'Costo Sin Impuesto',
            'Venta Sin Impuesto',
            'Utilidad $',
            'Utilidad %',
          ],
        ],
      })

      finalY = doc.lastAutoTable.finalY

      doc.line(10, finalY + 3, 200, finalY + 3)
      doc.text('Compras por Subfamilias', 105, finalY + 9, 'center')
      doc.line(10, finalY + 11, 200, finalY + 11)

      body = dataCpS.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Subfamilia },
          { content: this.formatNumber(dato.CostoValor) },
          { content: this.formatNumber(dato.IepsValorCosto) },
          { content: this.formatNumber(dato.IvaValorCosto) },
          { content: this.formatNumber(dato.CostoValorNeto) },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: finalY + 13,
        ...configHeader,
        body,
        head: [
          [
            'Subfamilia',
            'Costo Valor',
            'Ieps Valor Costo',
            'Iva Valor Costo',
            'Costo Valor Neto',
          ],
        ],
      })

      const countPages = doc.getNumberOfPages()
      let pageCurrent = 0
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      for (let page = 0; page < countPages; page++) {
        doc.setPage(page)
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(`Pagina ${pageCurrent} de ${countPages}`, 207, 275, 'right')
      }

      if (preview) doc.output('dataurlnewwindow')
      else doc.save(`Informe Operativo Mensual - ${sucursal}.pdf`)
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
