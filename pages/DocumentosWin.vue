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
          v-model="document"
          placeholder="Enter(Buscar) ó ctrl+Enter(Listar)"
          :class="backgroundInputTheme"
          @keyup.enter="searchByDocument"
        />
      </b-input-group>
      <b-input-group prepend="Referencia" class="docref">
        <b-form-input
          v-model="referencia"
          placeholder="Enter(Buscar) ó ctrl+Enter(Listar)"
          :class="backgroundInputTheme"
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
          @click="setConsolidacionActual({ data: [] })"
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
        <div class="mb-2">
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
      <h5>
        <b-badge pill variant="info">{{ countArticles }} Articulos</b-badge>
      </h5>
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
        <!-- <template #cell(CantUV)="row">
          {{ formatNumber(row.item.CantidadRegular) }}
        </template>
        <template #cell(CantUC)="row">
          {{ formatNumber(row.item.CantidadRegularUC) }}
        </template>
        <template #cell(CostoUV)="row">
          {{
            formatNumberWithFooter(row.item.CostoUnitarioNeto, row.item.footer)
          }}
        </template>
        <template #cell(CostoIvaUV)="row">
          <span class="font-weight-bold">
            {{
              formatNumberWithFooter(
                row.item.CostoUnitarioNetoIva,
                row.item.footer
              )
            }}
          </span>
        </template>
        <template #cell(CostoUC)="row">
          {{
            formatNumberWithFooter(
              row.item.CostoUnitarioNetoUC,
              row.item.footer
            )
          }}
        </template>
        <template #cell(CostoIvaUC)="row">
          <span class="font-weight-bold">
            {{
              formatNumberWithFooter(
                row.item.CostoUnitarioNetoUCIva,
                row.item.footer
              )
            }}
          </span>
        </template> -->
        <template #cell(CostoValorNeto)="row">
          <span class="font-weight-bold">
            {{ formatNumber(row.item.CostoValorNeto) }}
          </span>
        </template>
      </b-table>
      <Divider class="my-3" />
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
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { jsPDF } from 'jspdf'
import utils from '../modules/utils'
import 'jspdf-autotable'

export default {
  data() {
    return {
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
        { key: 'A', label: 'Transferencia de Entrada(A)' },
        { key: 'C', label: 'Compra(C)' },
        { key: 'D', label: 'Devolucion a Cliente(D)' },
        { key: 'E', label: 'Ajuste de Entrada(E)' },
        { key: 'I', label: 'Consumo Interno(I)' },
        { key: 'M', label: 'Merma(M)' },
        { key: 'P', label: 'Devolucion a Proveedor(P)' },
        { key: 'S', label: 'Ajuste de Salida(S)' },
        { key: 'T', label: 'Transferencia de Salida(T)' },
        { key: 'V', label: 'Venta(V)' },
        { key: 'X', label: '' },
        { key: 'Z', label: '' },
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
      return this.$store.state.documentoswin.data.data
    },
    total() {
      return this.$store.state.documentoswin.details.data.reduce(
        (sum, article) => {
          sum += article.CostoConIva
          return sum
        },
        0
      )
    },
    iva() {
      return this.$store.state.documentoswin.details.data.reduce(
        (sum, article) => {
          sum += article.Iva
          return sum
        },
        0
      )
    },
    subTotal() {
      return this.$store.state.documentoswin.details.data.reduce(
        (sum, article) => {
          sum += article.CostoValorNeto
          return sum
        },
        0
      )
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
    }),
    ...mapActions({
      changeData: 'documentoswin/changeData',
    }),
    getTipoDocumento(tipoDocumento) {
      const nameDoc = this.documents.find((doc) => doc.key === tipoDocumento)
      return nameDoc ? nameDoc.label : tipoDocumento
    },
    getEstatus(estatus) {
      return estatus === 'E' ? 'Vigente' : 'Cancelado'
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
    validate(Observaciones) {
      return Observaciones === 'Entrada No Encontrada' ? 'danger' : ''
    },
    async searchByDocument() {
      this.setLoading(true)
      const response = await this.changeData([
        this.selected,
        this.document,
        this.selectedDB,
      ])
      if (!response.success) this.showAlertDialog([response.message])
      else if (response.articles === 0)
        this.showAlertDialog(['No se encontro el documento'])
      this.setLoading(false)
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    formatNumberWithFooter(value, footer) {
      if (footer) return ''
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
        this.sucursal,
        this.$store.state.documentoswin.details.data,
        this.consolidacionActual,
        preview
      )
    },
    createPdfTransferencias(
      sucursal,
      data,
      dataConsolidacion,
      preview = false
    ) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'letter')

      const headerPage = () => {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text('SUPER PROMOCIONES DE ACAYUCAN', 105, 15, 'center')
        doc.setFont('helvetica', 'bold')
        doc.text('Envia: ' + sucursal, 105, 22, 'center')
        doc.setFont('helvetica', 'normal')

        doc.setFontSize(9)
        doc.text('Fecha: ', 182, 27, 'right')

        doc.text('Origen: ', 10, 27)
        doc.text('Documento: ', 10, 33)
        doc.text('Destino: ', 10, 39)

        doc.text(
          'Observaciones: ' + dataConsolidacion.Observaciones.toUpperCase(),
          105,
          46,
          'center'
        )

        doc.setFont('helvetica', 'bold')
        doc.text(utils.toDate(dataConsolidacion.Fecha), 200, 27, 'right')
        doc.text(
          'Destino: ' + dataConsolidacion.Referencia.toUpperCase(),
          200,
          33,
          'right'
        )
        doc.text(
          'Transfirio: ' + dataConsolidacion.NombreCajero.toUpperCase(),
          200,
          39,
          'right'
        )

        doc.text(dataConsolidacion.AlmacenOrigen, 24, 27)
        doc.text(dataConsolidacion.Transferencia, 30, 33)
        doc.text(dataConsolidacion.AlmacenDestino, 24, 39)
      }

      headerPage()

      const body = data.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Articulo },
          {
            content: this.formatNumber(dato.CantidadRegular),
          },
          { content: dato.Nombre },
          {
            content: this.formatNumber(dato.CantidadRegularUC),
          },
          { content: dato.UnidadCompra },
          { content: dato.Rel },
          {
            content: this.formatNumber(dato.CostoConIva),
          },
          { content: dato.Tasa },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 49,
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
            'Articulo',
            'PZAS',
            'Nombre',
            'CANT',
            'UNIDAD',
            'RELACION',
            'IMPORTE + IVA',
            'TASA',
          ],
        ],
        body,
      })

      const finalY = doc.lastAutoTable.finalY
      doc.setFont('helvetica', 'bold')
      doc.setDrawColor(0, 0, 0)
      if (finalY > 230) {
        doc.addPage()
        headerPage()

        doc.line(10, 70, 200, 70)
        doc.text('Subtotal:', 165, 75, 'right')
        doc.text('Iva:', 165, 80, 'right')
        doc.text('Total:', 165, 85, 'right')

        doc.setFont('helvetica', 'normal')
        doc.text('(' + utils.numeroALetras(this.total, {}, false) + ')', 12, 75)
        doc.text(this.formatNumber(this.subTotal), 195, 75, 'right')
        doc.text(this.formatNumber(this.iva), 195, 80, 'right')
        doc.text(this.formatNumber(this.total), 195, 85, 'right')

        doc.text('Entrego:', 15, 117)
        doc.line(30, 117, 75, 117)
        doc.text('Nombre y Firma', 52, 121, 'center')
        doc.text('Recibio:', 85, 117)
        doc.line(100, 117, 145, 117)
        doc.text('Nombre y Firma', 122, 121, 'center')

        doc.text('FOLIO INTERNO', 75, 127, 'center')
        doc.line(150, 125, 195, 125)
        doc.text('Vo.Bo.', 172, 128, 'center')
      } else {
        doc.line(10, 230, 200, 230)
        doc.text('Subtotal:', 165, 235, 'right')
        doc.text('Iva:', 165, 240, 'right')
        doc.text('Total:', 165, 245, 'right')

        doc.setFont('helvetica', 'normal')
        doc.text(
          '(' + utils.numeroALetras(this.total, {}, false) + ')',
          12,
          235
        )
        doc.text(this.formatNumber(this.subTotal), 195, 235, 'right')
        doc.text(this.formatNumber(this.iva), 195, 240, 'right')
        doc.text(this.formatNumber(this.total), 195, 245, 'right')
        doc.text('Entrego:', 15, 257)
        doc.line(30, 257, 75, 257)
        doc.text('Nombre y Firma', 52, 261, 'center')
        doc.text('Recibio:', 85, 257)
        doc.line(100, 257, 145, 257)
        doc.text('Nombre y Firma', 122, 261, 'center')

        doc.text('FOLIO INTERNO', 75, 267, 'center')
        doc.line(150, 265, 195, 265)
        doc.text('Vo.Bo.', 172, 268, 'center')
      }

      const countPages = doc.getNumberOfPages()
      let pageCurrent = 0
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      for (let page = 0; page < countPages; page++) {
        doc.setPage(page)
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(`Pagina ${pageCurrent} de ${countPages}`, 207, 275, 'right')
        doc.text('Tranferencia: ' + dataConsolidacion.Transferencia, 8, 275)
        if (pageCurrent === 1) doc.line(10, 56, 200, 56)
      }

      if (preview) doc.output('dataurlnewwindow')
      else
        doc.save(
          `${sucursal} - Transferencia ${dataConsolidacion.Transferencia}.pdf`
        )
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
  background: rgb(203, 0, 0);
  color: rgb(255, 255, 255);
}
</style>
