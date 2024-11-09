<template>
  <div>
    <h3 class="text-center my-3">Busqueda de Documentos</h3>
    <b-input-group prepend="Sucursal" class="mb-2">
      <b-form-select
        v-model="selected"
        :options="options"
        :disabled="!accessChangeSucursal"
        @change="changeSucursal"
      ></b-form-select>
    </b-input-group>
    <b-input-group prepend="Base De Datos" class="mb-2">
      <b-form-select v-model="selectedDB" :options="optionsDB" />
      <b-button variant="success" @click="refreshDataBases">Refrescar</b-button>
    </b-input-group>
    <b-form inline>
      <b-input-group prepend="Documento" class="docref">
        <b-form-input
          ref="inputDoc"
          v-model="document"
          placeholder="Enter(Buscar) ó ctrl+Enter(Listar)"
          :class="backgroundInputTheme"
          @keyup="eventDownDoc"
          @focus="$refs.inputDoc.select()"
        />
      </b-input-group>
      <b-input-group prepend="Referencia" class="docref">
        <b-form-input
          ref="inputRef"
          v-model="referencia"
          placeholder="Enter(Buscar) ó ctrl+Enter(Listar)"
          :class="backgroundInputTheme"
          @keyup="eventDownRef"
          @focus="$refs.inputRef.select()"
        />
      </b-input-group>
    </b-form>
    <div v-if="!isEmpty">
      <Divider />
      <div class="mb-3 mt-3">
        <b-button
          :variant="variantSuccess"
          :block="width < 528"
          class="mt-2"
          @click="createPdf(false)"
        >
          <b-icon icon="download" />
          PDF
        </b-button>
        <b-button
          :variant="variantInfo"
          :block="width < 528"
          class="mt-2"
          @click="createPdf(true)"
        >
          <b-icon icon="printer-fill" />
          PDF
        </b-button>
        <b-button
          :variant="variantClean"
          :block="width < 528"
          class="mt-2"
          @click="setData({ articles: 0, dataDoc: {}, data: [] })"
        >
          <b-icon icon="arrow-left-right" />
          Limpiar detalles
        </b-button>
      </div>
      <span class="float-right">
        <div class="mb-2">
          Tipo:
          <span class="font-weight-bold">
            {{ getTipoDocumento(dataDoc.TipoDocumento) }}
          </span>
        </div>
        <div class="mb-2">
          Fecha:
          <span class="font-weight-bold">
            {{ utils.toDate(dataDoc.Fecha) }}
          </span>
        </div>
        <div v-if="showTercero(dataDoc.TipoDocumento)" class="mb-2">
          N° Proveedor:
          <span class="font-weight-bold">
            {{ dataDoc.Tercero }}
          </span>
        </div>
        <div v-if="showTercero(dataDoc.TipoDocumento)" class="mb-2">
          Proveedor:
          <span class="font-weight-bold">
            {{ dataDoc.NombreTercero }}
          </span>
        </div>
        <div class="mb-2" :class="colorEstatus(dataDoc.Estatus)">
          Estatus:
          <span class="font-weight-bold">
            {{ getEstatus(dataDoc.Estatus) }}
          </span>
        </div>
      </span>
      <div class="mb-2">
        Documento:
        <span class="font-weight-bold">
          {{ dataDoc.Documento }}
        </span>
      </div>
      <div class="mb-2">
        Referencia:
        <span class="font-weight-bold">
          {{ dataDoc.Referencia }}
        </span>
      </div>
      <div class="mb-2">
        Almacen:
        <span class="font-weight-bold">
          {{ dataDoc.DescripcionAlmacen }}
        </span>
      </div>
      <div class="mb-2">
        Caja:
        <span class="font-weight-bold">
          {{ dataDoc.Caja }}
        </span>
      </div>
      <div class="mb-2">
        Cajero:
        <span class="font-weight-bold">
          {{ dataDoc.Cajero + ' - ' + dataDoc.NombreCajero }}
        </span>
      </div>
      <div class="mb-3">
        Observaciones:
        <span class="font-weight-bold">
          {{ dataDoc.Observaciones }}
        </span>
      </div>
      <span>
        <h5>
          <b-badge pill variant="info">{{ countArticles }} Articulos</b-badge>
        </h5>
        <b-form-group label="Resaltar Articulos Con:">
          <b-form-radio-group
            id="radio-group-1"
            v-model="selectedHighlight"
            :options="optionsHighlight"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
      </span>
      <b-table
        ref="tableSelectProduct"
        head-variant="dark"
        hover
        striped
        :fields="fields"
        :items="articles"
        sticky-header="800px"
        responsive="sm"
        :class="variantThemeTableBody"
      >
        <template #cell(CantidadRegular)="row">
          {{ formatNumber(row.item.CantidadRegular) }}
        </template>
        <template #cell(Subtotal)="row">
          {{ formatNumber(row.item.Subtotal) }}
        </template>
      </b-table>
      <div>
        (
        {{ utils.numeroALetras(dataDoc.Total, {}, false) }}
        )
      </div>
      <div class="float-right text-right mb-5">
        <span class="font-weight-bold d-inline"> Subtotal: </span>
        <div class="rectangle">
          {{ formatNumber(dataDoc.Subtotal) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Descuento: </span>
        <div class="rectangle">
          {{ formatNumber(dataDoc.Descuentos) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Ieps: </span>
        <div class="rectangle">
          {{ formatNumber(dataDoc.IepsValor) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Iva: </span>
        <div class="rectangle">
          {{ formatNumber(dataDoc.IvaValor) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Total: </span>
        <div class="rectangle">
          {{ formatNumber(dataDoc.Total) }}
        </div>
      </div>
    </div>
    <div v-if="showSearch" class="container-search">
      <DocumentosWinSearchVue
        :documents="documents"
        :rec-referencia="referencia"
        :rec-document="document"
        :set-show-search="setShowSearch"
        :sucursal="selected"
        :data-base="selectedDB"
        :search-by-document="searchByDocument"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { jsPDF } from 'jspdf'
import utils from '../modules/utils'
import 'jspdf-autotable'
import DocumentosWinSearchVue from '~/components/DocumentosWinSearch.vue'

export default {
  components: {
    DocumentosWinSearchVue,
  },
  data() {
    return {
      selectedHighlight: 'ninguno',
      optionsHighlight: [
        { text: 'Iva', value: 'iva' },
        { text: 'Ieps', value: 'ieps' },
        { text: 'Descuento', value: 'descuento' },
        { text: 'Ninguno', value: 'ninguno' },
      ],
      sucursales: [],
      fields: [
        'Articulo',
        { key: 'Nombre', label: 'Descripcion' },
        'Relacion',
        'Costo',
        { key: 'CantidadRegular', label: 'Cant' },
        { key: 'UnidadVenta', label: 'Unid' },
        { key: 'Subtotal', label: 'Importe' },
        'Iva',
        'Ieps',
        { key: 'Descuento', label: 'Desc' },
      ],
      utils,
      selected: 'ZR',
      selectedDB: '',
      optionsDB: [],
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'TF', text: 'Tortilleria Acayucan F.', disabled: true },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'TY', text: 'Sayula Tortilleria', disabled: true },
        { value: 'SC', text: 'Soconusco', disabled: true },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
      document: '',
      referencia: '',
      documents: [
        { value: 'A', text: 'Transferencia de Entrada(A)' },
        { value: 'C', text: 'Compra(C)' },
        { value: 'D', text: 'Devolucion a Cliente(D)' },
        { value: 'E', text: 'Ajuste de Entrada(E)' },
        { value: 'I', text: 'Consumo Interno(I)' },
        { value: 'M', text: 'Merma(M)' },
        { value: 'P', text: 'Devolucion a Proveedor(P)' },
        { value: 'S', text: 'Ajuste de Salida(S)' },
        { value: 'T', text: 'Transferencia de Salida(T)' },
        { value: 'V', text: 'Venta(V)' },
        { value: 'X', text: '' },
        { value: 'Z', text: '' },
      ],
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    sucursal() {
      const sucursales = this.sucursales
      return sucursales[`${this.$store.state.documentoswin.sucursal}`]
    },
    showSearch() {
      return this.$store.state.documentoswin.showSearch
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
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
    dataDoc() {
      return this.$store.state.documentoswin.data.dataDoc
    },
    isEmpty() {
      return this.$store.state.documentoswin.data.articles === 0
    },
    countArticles() {
      return this.$store.state.documentoswin.data.articles
    },
    articles() {
      const articles = []
      const highLight = this.selectedHighlight
      this.$store.state.documentoswin.data.data.forEach((article) => {
        const data = { ...article }

        if (highLight === 'iva' && data.Iva !== 0) data._rowVariant = 'warning'
        if (highLight === 'ieps' && data.Ieps !== 0)
          data._rowVariant = 'warning'
        if (highLight === 'descuento' && data.Descuento !== 0)
          data._rowVariant = 'warning'
        articles.push(data)
      })
      return articles
    },
  },
  mounted() {
    this.setSucursalForUser()
    this.setOptionsDB()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'documentoswin/setSucursal',
      setDataBases: 'documentoswin/setDataBases',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setData: 'documentoswin/setData',
      setShowSearch: 'documentoswin/setShowSearch',
    }),
    ...mapActions({
      changeData: 'documentoswin/changeData',
    }),
    eventDownDoc(e) {
      if (e.ctrlKey && e.keyCode === 13) this.setShowSearch(true)
      else if (e.keyCode === 13) this.searchByDocument('documento')
    },
    eventDownRef(e) {
      if (e.ctrlKey && e.keyCode === 13) this.setShowSearch(true)
      else if (e.keyCode === 13) this.searchByDocument('referencia')
    },
    getTipoDocumento(tipoDocumento) {
      const nameDoc = this.documents.find((doc) => doc.value === tipoDocumento)
      return nameDoc ? nameDoc.text : tipoDocumento
    },
    getEstatus(estatus) {
      return estatus === 'E' ? 'Vigente' : 'Cancelado'
    },
    colorEstatus(estatus) {
      return estatus === 'E' ? 'success' : 'danger'
    },
    showTercero(tipoDocumento) {
      return tipoDocumento === 'C' || tipoDocumento === 'P'
    },
    changeSucursal(suc) {
      this.setSucursal(suc)
      const dbSaved = this.$store.state.documentoswin.dataBases
      if (!dbSaved[`${suc}`])
        this.showAlertDialog(['No se encontro la sucursal'])
      else if (dbSaved[`${suc}`].length === 0) this.loadOptionsDB(dbSaved, suc)
      else {
        this.optionsDB = dbSaved[`${suc}`]
        this.selectedDB = this.optionsDB[0]
      }
    },
    refreshDataBases() {
      const dbSaved = this.$store.state.documentoswin.dataBases
      this.loadOptionsDB(dbSaved, this.selected)
    },
    async loadOptionsDB(dbSaved, suc) {
      this.setLoading(true)
      const dataBases = await this.loadDataBase(suc)
      this.setLoading(false)
      if (dataBases.success) {
        this.optionsDB = dataBases.data.reduce((dbs, db) => {
          dbs.push(db.DataBaseName)
          return dbs
        }, [])
        const newDB = { ...dbSaved }
        newDB[`${suc}`] = this.optionsDB
        this.setDataBases(newDB)
        this.selectedDB = this.optionsDB[0]
      } else this.showAlertDialog([dataBases.message])
    },
    setOptionsDB() {
      const dbSaved = this.$store.state.documentoswin.dataBases
      if (dbSaved[`${this.selected}`].length > 0) {
        this.optionsDB = dbSaved[`${this.selected}`]
        this.selectedDB = this.optionsDB[0]
      }
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        this.selected = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(this.selected)
      } else {
        const sucSelected = this.$store.state.documentoswin.sucursal
        this.selected = sucSelected
      }
    },
    async searchByDocument(from = 'documento', document = '') {
      this.setLoading(true)
      let doc = from === 'documento' ? this.document : this.referencia
      if (document.trim() !== '') doc = document
      const response = await this.changeData([
        this.selected,
        doc,
        this.selectedDB,
        from,
      ])
      if (!response.success) this.showAlertDialog([response.message])
      else if (response.articles === 0)
        this.showAlertDialog(['No se encontro el documento'])
      this.setLoading(false)
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    async loadDataBase(sucursal) {
      try {
        const url =
          process.env.spastore_url_backend +
          'api/v1/general/databases/' +
          sucursal

        const response = await this.$axios({
          url,
          method: 'get',
        })

        return response.data
      } catch (error) {
        if (error.response) return error.response.data
        return {
          success: false,
          message: 'Error con el servidor',
          error,
        }
      }
    },
    createPdf(preview) {
      this.createPdfTransferencias(
        'Enriquez',
        this.$store.state.documentoswin.data,
        preview
      )
    },
    createPdfTransferencias(sucursal, data, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'letter')

      const dataDocument = data.dataDoc
      const dataArticles = data.data

      const showDataProvider = () => {
        if (this.showTercero(dataDocument.TipoDocumento)) {
          doc.text('N° Proveedor: ', 140, 24)
          doc.text('Proveedor: ', 140, 30)
          doc.text(dataDocument.Tercero, 162, 24)
          doc.text(dataDocument.NombreTercero, 140, 36)
        }
      }

      const headerPage = () => {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)

        doc.text('Documento: ', 10, 12)
        doc.text('Referencia: ', 10, 18)
        doc.text('Almacen: ', 10, 24)
        doc.text('Caja: ', 10, 30)
        doc.text('Cajero: ', 10, 36)
        doc.text('Observaciones: ', 10, 42)

        doc.text('Tipo: ', 140, 12)
        doc.text('Fecha: ', 140, 18)
        doc.text('Estatus: ', 140, 42)

        doc.setFont('helvetica', 'bold')

        doc.text(dataDocument.Documento, 28, 12)
        doc.text(dataDocument.Referencia, 27, 18)
        doc.text(dataDocument.DescripcionAlmacen, 24, 24)
        doc.text(dataDocument.Caja, 20, 30)
        doc.text(
          dataDocument.Cajero + ' - ' + dataDocument.NombreCajero,
          22,
          36
        )
        doc.text(dataDocument.Observaciones, 33, 42)

        doc.text(this.getTipoDocumento(dataDocument.TipoDocumento), 150, 12)
        doc.text(utils.toDate(dataDocument.Fecha), 152, 18)
        doc.text(this.getEstatus(dataDocument.Estatus), 162, 42)

        showDataProvider()
      }

      headerPage()

      const body = dataArticles.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Articulo },
          { content: dato.Nombre },
          { content: dato.Relacion },
          {
            content: this.formatNumber(dato.Costo),
          },
          {
            content: this.formatNumber(dato.CantidadRegular),
          },
          { content: dato.UnidadVenta },
          {
            content: this.formatNumber(dato.Subtotal),
          },
          { content: dato.Iva },
          { content: dato.Ieps },
          { content: dato.Descuento },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 46,
        tableWidth: 190,
        margin: {
          left: 10,
        },
        styles: { fontSize: 8 },
        headStyles: {
          fontStyle: 'bold',
          halign: 'left',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        bodyStyles: { textColor: [0, 0, 0], cellPadding: 1 },
        head: [
          [
            'ARTICULO',
            'NOMBRE',
            'RELACION',
            'COSTO',
            'CANT',
            'UNIDAD',
            'IMPORTE',
            'IVA',
            'IEPS',
            'DESC',
          ],
        ],
        body,
      })

      const finalY = doc.lastAutoTable.finalY
      doc.setFont('helvetica', 'bold')
      doc.setDrawColor(0, 0, 0)
      if (finalY > 210) {
        doc.addPage()
        headerPage()

        doc.line(10, 70, 200, 70)
        doc.text('Subtotal:', 165, 75, 'right')
        doc.text('Descuento:', 165, 80, 'right')
        doc.text('Ieps:', 165, 85, 'right')
        doc.text('Iva:', 165, 90, 'right')
        doc.text('Total:', 165, 95, 'right')

        doc.setFont('helvetica', 'normal')
        doc.text(
          '(' + utils.numeroALetras(dataDocument.Total, {}, false) + ')',
          12,
          75
        )

        doc.text(this.formatNumber(dataDocument.Subtotal), 195, 75, 'right')
        doc.text(this.formatNumber(dataDocument.Descuentos), 195, 80, 'right')
        doc.text(this.formatNumber(dataDocument.IepsValor), 195, 85, 'right')
        doc.text(this.formatNumber(dataDocument.IvaValor), 195, 90, 'right')
        doc.text(this.formatNumber(dataDocument.Total), 195, 95, 'right')

        doc.line(30, 117, 75, 117)
        doc.text('Realizo', 52, 121, 'center')
        doc.line(110, 117, 155, 117)
        doc.text('Superviso', 132, 121, 'center')
      } else {
        doc.line(10, 210, 200, 210)
        doc.text('Subtotal:', 165, 215, 'right')
        doc.text('Descuento:', 165, 220, 'right')
        doc.text('Ieps:', 165, 225, 'right')
        doc.text('Iva:', 165, 230, 'right')
        doc.text('Total:', 165, 235, 'right')

        doc.setFont('helvetica', 'normal')
        doc.text(
          '(' + utils.numeroALetras(dataDocument.Total, {}, false) + ')',
          12,
          215
        )
        doc.text(this.formatNumber(dataDocument.Subtotal), 195, 215, 'right')
        doc.text(this.formatNumber(dataDocument.Descuentos), 195, 220, 'right')
        doc.text(this.formatNumber(dataDocument.IepsValor), 195, 225, 'right')
        doc.text(this.formatNumber(dataDocument.IvaValor), 195, 230, 'right')
        doc.text(this.formatNumber(dataDocument.Total), 195, 235, 'right')

        doc.line(30, 257, 75, 257)
        doc.text('Realizo', 52, 261, 'center')
        doc.line(110, 257, 155, 257)
        doc.text('Superviso', 132, 261, 'center')
      }

      const countPages = doc.getNumberOfPages()
      let pageCurrent = 0
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      for (let page = 0; page < countPages; page++) {
        doc.setPage(page)
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(`Pagina ${pageCurrent} de ${countPages}`, 207, 275, 'right')
        doc.text('Documento: ' + dataDocument.Documento, 8, 275)
        if (pageCurrent === 1) doc.line(10, 52, 200, 52)
      }

      if (preview) doc.output('dataurlnewwindow')
      else doc.save(`${sucursal} - Documento.pdf`)
    },
  },
}
</script>

<style scoped>
.docref {
  width: calc(50% - 5px);
  margin-bottom: 15px;
  margin-right: 5px;
}
.rectangle {
  display: inline-block;
  width: 150px;
}

.danger {
  background: rgb(130, 0, 0);
  color: rgb(255, 255, 255);
}

.success {
  background: rgb(0, 130, 0);
  color: rgb(255, 255, 255);
}

.container-search {
  position: fixed;
  display: inline-block;
  overflow-y: auto;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(52, 52, 52, 0.648);
  padding: 30px;
  z-index: 10;
}
</style>
