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
      <b-button :variant="variantSuccess" @click="createExcel">
        <b-icon icon="download" />
        Descargar EXCEL
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
      foot-clone
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

      <template #foot(Subfamilia)>{{ 'Totales' }}</template>
      <template #foot(Articulo)>{{ formatNumber(rows) }}</template>
      <template #foot(Nombre)>{{ '' }}</template>
      <template #foot(ExistUV)>{{ formatNumber(unidades) }}</template>
      <template #foot(Relacion)>{{ '' }}</template>
      <template #foot(CostoNet)>{{ '' }}</template>
      <template #foot(CostoExist)>{{ formatNumber(totalNeto) }}</template>
      <template #foot(FechaCompra)>{{ '' }}</template>
      <template #foot(StockMinimo)>{{ '' }}</template>
      <template #foot(Dias)>{{ '' }}</template>
      <template #foot(StockMaximo)>{{ '' }}</template>
      <template #foot(Estatus)>{{ '' }}</template>
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
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      perPage: 10,
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
        { key: 'FechaCompra', label: 'Fecha Compra', sortable: true },
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
        { value: 'SC', text: 'Soconusco' },
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
    unidades() {
      const data = this.$store.state.existenciasantiguedad.data.data
      const piezas = data.reduce((pzas, articulo) => {
        pzas += articulo.ExistUV
        return pzas
      }, 0)
      return piezas
    },
    totalNeto() {
      const data = this.$store.state.existenciasantiguedad.data.data
      const costo = data.reduce((sumaCosto, articulo) => {
        sumaCosto += articulo.CostoExist
        return sumaCosto
      }, 0)
      return costo
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
      const articulos = data.length
      let unidades = 0
      let totalNeto = 0

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

      const getCell = (value) => {
        const text = typeof value === 'string' ? value : ''
        return {
          content: value ? this.formatNumber(value) : text,
          styles: {
            fontStyle: 'bold',
            fillColor: [0, 125, 208],
            textColor: [255, 255, 255],
          },
        }
      }

      headerPage()

      const body = data.reduce((acumData, dato) => {
        unidades += dato.ExistUV
        totalNeto += dato.CostoExist
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

      body.push([
        getCell('Totales'),
        getCell(articulos),
        getCell(),
        getCell(unidades),
        getCell(),
        getCell(),
        getCell(totalNeto),
        getCell(),
        getCell(),
        getCell(),
        getCell(),
        getCell(),
      ])

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

    createExcel() {
      const sucurlsal = this.sucConsult
      const wb = XLSX.utils.book_new()
      wb.Props = {
        Title: 'Antiguedad Existencias - ' + sucurlsal,
        Subject: 'Mas45Dias',
        Author: this.$store.state.user.name,
      }
      wb.SheetNames.push('Hoja')

      const header = [
        'Subfamilia',
        'Articulo',
        'Nombre',
        'ExistUV',
        'Relacion',
        'CostoNeto',
        'CostoExist',
        'FechaCompra',
        'Dias',
        'Min',
        'Max',
        'Estatus',
      ]

      const existencia45 = [
        ...this.$store.state.existenciasantiguedad.data.data,
      ]
      const listRefactor = []
      const articles = existencia45.length
      let unidades = 0
      let totalCosto = 0

      listRefactor.push(
        { Subfamilia: 'SUPER PROMOCIONES DE ACAYUCAN SA DE CV' },
        { Nombre: 'ZARAGOZA #109. CP 96000' },
        { Subfamilia: 'SUC: ' + sucurlsal },
        { Nombre: 'ACAYUCAN, VERACRUZ.' },
        { Subfamilia: 'Antiguedad Existencias ' },
        {},
        {},
        {
          Subfamilia: 'Subfamilia',
          Articulo: 'Articulo',
          Nombre: 'Nombre',
          ExistUV: 'Exist UV',
          Relacion: 'Relacion',
          CostoNeto: 'Costo Neto',
          CostoExist: 'Costo Exist',
          FechaCompra: 'Fecha Compra',
          Dias: 'Dias',
          Min: 'Min',
          Max: 'Max',
          Estatus: 'Estatus',
        }
      )

      existencia45.forEach((article) => {
        unidades += article.ExistUV
        totalCosto += article.CostoExist
        listRefactor.push({
          Subfamilia: article.Subfamilia,
          Articulo: article.Articulo,
          Nombre: article.Nombre,
          ExistUV: article.ExistUV,
          Relacion: article.Relacion,
          CostoNeto: article.CostoNet,
          CostoExist: article.CostoExist,
          FechaCompra: article.FechaCompra,
          Dias: article.Dias,
          Min: article.StockMinimo,
          Max: article.StockMaximo,
          Estatus: article.Estatus,
        })
      })

      listRefactor.push({
        Subfamilia: 'Totales',
        Articulo: articles,
        Nombre: '',
        ExistUV: unidades,
        Relacion: '',
        CostoNeto: '',
        CostoExist: totalCosto,
        FechaCompra: '',
        Dias: '',
        Min: '',
        Max: '',
        Estatus: '',
      })

      const data = XLSX.utils.json_to_sheet(listRefactor, {
        header,
        skipHeader: true,
        origin: 'A2',
      })

      wb.Sheets.Hoja = data
      wb.Sheets.Hoja['!cols'] = [
        { wpx: 200 },
        { wpx: 70 },
        { wpx: 250 },
        { wpx: 70 },
        { wpx: 90 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 90 },
      ]

      const num = 3
      if (num !== 2) {
        const fechaA = utils.getDateNow().format('YYYY MMDD')
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

        FileSaver.saveAs(
          new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
          fechaA + ' - Antiguedad Existencias - ' + sucurlsal + '.xlsx'
        )
      }
    },
    s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      // eslint-disable-next-line prettier/prettier
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
      return buf
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
