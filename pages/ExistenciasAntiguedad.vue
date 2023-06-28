<template>
  <div>
    <h4 class="my-3 text-center">Antiguedad de Existencias</h4>
    <b-input-group prepend="Sucursal" class="mb-3">
      <b-form-select
        v-model="selected"
        :options="options"
        :disabled="!accessChangeSucursal"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-form-input
          v-model="dias"
          type="number"
          class="w-25"
          placeholder="Dias"
        />
        <b-button variant="info" @click="getAntiguedadExistencias">
          Consulta
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <img id="imgLogoSpa" class="imgLogo" src="@/assets/cesta.png" />
    <h5 v-if="haveData">
      {{
        `Detalles de Existencias Con ${diasConsult}+ Dias en Suc ${sucConsult} al ${getDateActual()}`
      }}
    </h5>

    <span v-if="countExistencias > 0">
      <b-button
        :variant="variantSuccess"
        class="mt-2 mb-1"
        @click="createPdf(false)"
      >
        <b-icon icon="download" />
        Descargar PDF
      </b-button>
      <b-button
        :variant="variantInfo"
        class="mb-1 mt-2"
        @click="createPdf(true)"
      >
        <b-icon icon="printer-fill" />
        Imprimir PDF
      </b-button>
    </span>

    <b-container v-if="dataExistencias.length > 20" fluid="xl" class="mt-4">
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
            aria-controls="tableExistenciaAntiguedad"
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
      hover
      head-variant="dark"
      outlined
      responsive
      small
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataExistencias"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(ExistUV)="row">
        {{ formatNumber(row.item.ExistUV) }}
      </template>
      <template #cell(CostoNet)="row">
        {{ formatNumber(row.item.CostoNet) }}
      </template>
      <template #cell(CostoExist)="row">
        {{ formatNumber(row.item.CostoExist) }}
      </template>
      <template #cell(FechaCompra)="row">
        {{ utils.toDate(row.item.FechaCompra) }}
      </template>
      <template #cell(StockMinimo)="row">
        {{ formatNumber(row.item.StockMinimo) }}
      </template>
      <template #cell(StockMaximo)="row">
        {{ formatNumber(row.item.StockMaximo) }}
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

export default {
  data() {
    return {
      utils,
      perPage: 20,
      dias: 45,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      fields: [
        { key: 'Subfamilia', label: 'Subfamilia', sortable: false },
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'ExistUV', label: 'Exist. UV', sortable: true },
        { key: 'Relacion', label: 'Relacion', sortable: true },
        { key: 'CostoNet', label: 'Costo Neto', sortable: true },
        { key: 'CostoExist', label: 'Costo Exist.', sortable: true },
        { key: 'Fecha Compra', label: 'Fecha Compra', sortable: true },
        { key: 'Dias', label: 'Dias', sortable: true },
        { key: 'StockMinimo', label: 'Min', sortable: true },
        { key: 'StockMaximo', label: 'Max', sortable: true },
        { key: 'Estatus', label: 'Estatus', sortable: true },
      ],
      selected: 'ZR',
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
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    rows() {
      return this.$store.state.existenciasantiguedad.data.data.length
    },
    countExistencias() {
      return this.$store.state.existenciasantiguedad.data.data.length
    },
    haveData() {
      return !!this.$store.state.existenciasantiguedad.sucConsult
    },
    diasConsult() {
      return this.$store.state.existenciasantiguedad.dias
    },
    sucConsult() {
      return this.getSucursalBySiglas(
        this.$store.state.existenciasantiguedad.sucConsult
      )
    },
    dataExistencias() {
      return this.$store.state.existenciasantiguedad.data.data
    },
  },
  mounted() {
    this.setSucursalForUser()
    this.loadDataImage()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'existenciasantiguedad/setSucursal',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'existenciasantiguedad/changeData',
    }),
    loadDataImage() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const imageObject = document.getElementById('imgLogoSpa')
      context.drawImage(imageObject, 0, 0, 100, 100)
    },
    getSucursalBySiglas(sucursal) {
      return this.options.reduce((suc, option) => {
        if (option.value === sucursal) suc = option.text
        return suc
      }, 'Zaragoza')
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
        this.selected = sucursalUser
      } else this.selected = this.$store.state.existenciasantiguedad.sucursal
    },
    selectSucursal(suc) {
      this.setSucursal(suc)
    },
    getDateActual() {
      return utils.getDateNow().format('DD/MM/YYYY')
    },
    async getAntiguedadExistencias() {
      if (!this.dias || this.dias <= 0) {
        this.showAlertDialog(['Debe establecer los dias de antiguedad'])
        return false
      }
      this.setLoading(true)
      const response = await this.changeData([
        this.$store.state.existenciasantiguedad.sucursal,
        this.dias,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    createPdf(preview) {
      const logo = document.getElementById('canvas')
      const detalles = `Detalles de Existencias Con ${
        this.diasConsult
      }+ Dias en Suc ${this.sucConsult} al ${this.getDateActual()}`
      const data = this.$store.state.existenciasantiguedad.data.data
      this.createPdfExistencias(this.sucConsult, data, logo, detalles, preview)
    },
    createPdfExistencias(sucursal, data, logo, detalles, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('l', 'mm', 'letter')

      const headerPage = () => {
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 125, 208)
        if (logo) {
          doc.text('ANTIGUEDAD DE EXISTENCIAS', 265, 20, 'right')
          doc.addImage(logo, 'PNG', 10, 15, 23, 23)
        } else doc.text('REPOSICIONES DE COMPRAS', 105, 20, 'center')

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(15)
        doc.text('SUPER PROMOCIONES DE ACAYUCAN', 265, 29, 'right')
        doc.setFontSize(13)
        doc.setFont('helvetica', 'normal')
        doc.text(detalles, 265, 36, 'right')
      }

      headerPage()

      const body = data.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Subfamilia },
          { content: dato.Articulo },
          { content: dato.Nombre },
          { content: this.formatNumber(dato.ExistUV) },
          { content: dato.Relacion },
          { content: this.formatNumber(dato.CostoNet) },
          { content: this.formatNumber(dato.CostoExist) },
          { content: utils.toDate(dato.FechaCompra) },
          { content: dato.Dias },
          { content: this.formatNumber(dato.StockMinimo) },
          { content: this.formatNumber(dato.StockMaximo) },
          { content: dato.Estatus },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 47,
        tableWidth: 255,
        margin: {
          left: 10,
        },
        styles: { fontSize: 9 },
        headStyles: {
          fontStyle: 'bold',
          halign: 'left',
          fillColor: [0, 125, 208],
          textColor: [255, 255, 255],
        },
        bodyStyles: { textColor: [0, 0, 0] },
        head: [
          [
            'Subfamilia',
            'Articulo',
            'Nombre',
            'Exist. UV',
            'Relacion',
            'Costo Neto',
            'Costo Exist.',
            'Fecha Compra',
            'Dias',
            'Min',
            'Max',
            'Estatus',
          ],
        ],
        body,
      })

      const countPages = doc.getNumberOfPages()
      let pageCurrent = 0
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      const horaImpreso = utils.getDateNow().format('DD-MM-yyyy hh:mm a')
      for (let page = 0; page < countPages; page++) {
        doc.setPage(page)
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(`Pagina ${pageCurrent} de ${countPages}`, 270, 207, 'right')
        doc.text('Impreso ' + horaImpreso, 8, 207)
      }

      if (preview) doc.output('dataurlnewwindow')
      else doc.save(`Antiguedad Existencias de ${sucursal}.pdf`)
    },
  },
}
</script>

<style scoped>
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
</style>
