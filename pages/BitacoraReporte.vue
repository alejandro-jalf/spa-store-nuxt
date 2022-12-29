<template>
  <div>
    <div class="containerInp">
      <b-input-group prepend="Suc">
        <b-form-select
          v-model="selected"
          :options="options"
          :disabled="!accessChangeSucursal"
          @change="setSucursal"
        ></b-form-select>
      </b-input-group>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Fecha Corte">
        <b-form-datepicker
          id="dateEnd"
          v-model="dateCorte"
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
    </div>
    <b-button variant="info" @click="loadReposiciones">
      <b-icon icon="search" />
      Buscar
    </b-button>

    <div class="content-titles">
      <img id="imgLogoSpa" class="imgLogo" src="@/assets/cesta.png" />
      <h1 class="mt-3">Reporte de Bitacora de Compras</h1>
      <h3>Super Promociones de Acayucan</h3>
      <h5>{{ textDetail }}</h5>
    </div>

    <div v-if="!emptyData">
      <b-button
        :variant="variantSuccess"
        :block="width < 528"
        class="mt-2"
        @click="generatePdf(false)"
      >
        <b-icon icon="download" />
        Descargar
      </b-button>
      <b-button
        :variant="variantInfo"
        :block="width < 528"
        class="mt-2"
        @click="generatePdf(true)"
      >
        <b-icon icon="printer-fill" />
        Vista Previa
      </b-button>
      <b-button
        :variant="variantClean"
        :block="width < 528"
        class="mt-2"
        @click="cleanData"
      >
        <b-icon icon="file-earmark-pdf-fill" />
        Limpiar tabla
      </b-button>
    </div>

    <b-table-simple
      id="tableAsistencias"
      hover
      responsive
      class="mt-3"
      :class="variantThemeTableBody"
    >
      <b-thead head-variant="dark">
        <b-tr>
          <b-th>Folio</b-th>
          <b-th>Nombre</b-th>
          <b-th>Documento</b-th>
          <b-th>Fecha</b-th>
          <b-th>Subtotal</b-th>
          <b-th>Descuento</b-th>
          <b-th>Ieps</b-th>
          <b-th>Iva</b-th>
          <b-th>Total</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr v-for="(rCompras, indext) in dataRefactor" :key="indext">
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Folio
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Nombre
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Documento
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Fecha
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Subtotal
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Descuento
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Ieps
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Iva
          }}</b-td>
          <b-td :class="bold(rCompras)" :variant="variant(rCompras)">{{
            rCompras.Total
          }}</b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
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

export default {
  data() {
    return {
      selected: 'ZR',
      dateCorte: '',
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
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    emptyData() {
      return this.$store.state.bitacorareporte.data.data.length === 0
    },
    textDetail() {
      const option = [...this.options]
      const suc = option.reduce((optAcum, opt) => {
        if (opt.value === this.$store.state.bitacorareporte.sucursalFind)
          optAcum = opt.text
        return optAcum
      }, '')

      return (
        'Detalle de Suc. ' +
        suc +
        ' Al ' +
        this.$store.state.bitacorareporte.dateCorte
      )
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    dataRefactor() {
      const datos = []

      const insertRow = (datos = [], dato = {}, footer = false) => {
        datos.push({
          footer,
          Nombre: dato.Nombre,
          Documento: dato.Documento,
          Folio: dato.Consecutivo,
          Fecha: utils.formatWithMoment(dato.Fecha, 'DD/MM/yyyy'),
          Subtotal: utils.aplyFormatNumeric(utils.roundTo(dato.Subtotal)),
          Descuento: utils.aplyFormatNumeric(utils.roundTo(dato.Descuento)),
          Ieps: utils.aplyFormatNumeric(utils.roundTo(dato.Ieps)),
          Iva: utils.aplyFormatNumeric(utils.roundTo(dato.Iva)),
          Total: utils.aplyFormatNumeric(utils.roundTo(dato.Total)),
        })
      }

      const total = {
        Nombre: 'Total',
        Documento: '',
        Consecutivo: '',
        Fecha: '',
        Subtotal: 0,
        Descuento: 0,
        Ieps: 0,
        Iva: 0,
        Total: 0,
      }

      this.$store.state.bitacorareporte.data.data.forEach((dato) => {
        insertRow(datos, dato)
        total.Subtotal += dato.Subtotal
        total.Descuento += dato.Descuento
        total.Ieps += dato.Ieps
        total.Iva += dato.Iva
        total.Total += dato.Total
      })
      insertRow(datos, total, true)

      return datos
    },
  },
  mounted() {
    this.setSucursalForUser()
    this.setDateInitials()
    this.loadDataImage()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'bitacorareporte/setSucursal',
      setData: 'bitacorareporte/setData',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'bitacorareporte/changeData',
    }),
    bold(data) {
      return data.footer ? 'font-weight-bold' : ''
    },
    variant(data) {
      return data.footer ? 'secondary' : ''
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        this.selected = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(this.selected)
      } else {
        const sucSelected = this.$store.state.bitacorareporte.sucursal
        this.selected = sucSelected
      }
    },
    setDateInitials() {
      const dayActual = utils.getDateNow()
      this.dateCorte = dayActual.format('yyyy-MM-DD')
    },
    cleanData() {
      this.setData({ data: [] })
    },
    loadDataImage() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const imageObject = document.getElementById('imgLogoSpa')
      context.drawImage(imageObject, 0, 0, 100, 100)
    },
    async loadReposiciones() {
      this.setLoading(true)
      // this.loadDataImage()
      const response = await this.changeData([
        this.dateCorte.replace(/-/g, ''),
        this.$store.state.bitacorareporte.sucursal,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Fallo inesperado'])
    },
    generatePdf(preview) {
      const detalles = this.textDetail
      const data = [...this.dataRefactor]
      const logo = document.getElementById('canvas')
      const sucursal = this.selected
      this.createPdf(detalles, sucursal, data, logo, preview)
    },
    createPdf(detalles, sucursal, data, logo, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'letter')

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 125, 208)
      if (logo) {
        doc.text('BITACORA DE COMPRAS', 200, 20, 'right')
        doc.addImage(logo, 'PNG', 10, 15, 23, 23)
      } else doc.text('BITACORA DE COMPRAS', 105, 20, 'center')

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(15)
      doc.text('SUPER PROMOCIONES DE ACAYUCAN SA DE CV', 200, 29, 'right')
      doc.setFontSize(13)
      doc.setFont('helvetica', 'normal')
      doc.text(detalles, 200, 36, 'right')

      const getStyle = (dato) => {
        return dato.footer
          ? {
              fontStyle: 'bold',
              fillColor: [210, 210, 210],
            }
          : {}
      }

      const body = data.reduce((acumData, dato) => {
        acumData.push([
          {
            content: dato.Folio,
            styles: getStyle(dato),
          },
          {
            content: dato.Nombre,
            styles: getStyle(dato),
          },
          {
            content: dato.Documento,
            styles: getStyle(dato),
          },
          {
            content: dato.Fecha,
            styles: getStyle(dato),
          },
          {
            content: dato.Subtotal,
            styles: getStyle(dato),
          },
          {
            content: dato.Descuento,
            styles: getStyle(dato),
          },
          {
            content: dato.Ieps,
            styles: getStyle(dato),
          },
          {
            content: dato.Iva,
            styles: getStyle(dato),
          },
          {
            content: dato.Total,
            styles: getStyle(dato),
          },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 47,
        tableWidth: 190,
        margin: {
          left: 10,
        },
        styles: { fontSize: 7 },
        headStyles: {
          fontStyle: 'bold',
          halign: 'center',
          fillColor: [0, 125, 208],
          textColor: [255, 255, 255],
        },
        bodyStyles: { textColor: [0, 0, 0] },
        head: [
          [
            'Folio',
            'Nombre',
            'Documento',
            'Fecha',
            'Subtotal',
            'Descuento',
            'Ieps',
            'Iva',
            'Total',
          ],
        ],
        body,
      })

      const countPages = doc.getNumberOfPages()
      let pageCurrent = 0
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      for (let page = 0; page < countPages; page++) {
        doc.setPage(page)
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(`Pagina ${pageCurrent} de ${countPages}`, 207, 275, 'right')
        doc.text(
          'Impreso ' + utils.getDateNow().format('DD-MM-yyyy HH:mm:ss'),
          8,
          275
        )
      }

      if (preview) doc.output('dataurlnewwindow')
      else doc.save(`Bitacora de compras ${sucursal}.pdf`)
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
