<template>
  <div>
    <b-alert variant="info" :show="isEmptyDetails">
      No hay detalles que mostrar
    </b-alert>
    <div v-if="!isEmptyDetails" class="mb-5">
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
      <div class="text-center mb-2">
        Envia:
        <span class="font-weight-bold">
          {{ sucursal }}
        </span>
      </div>
      <div class="mb-2">
        <span>
          Origen:
          <span class="font-weight-bold">
            {{ consolidacionActual.AlmacenOrigen }}
          </span>
        </span>
        <span class="float-right">
          Fecha:
          <span class="font-weight-bold">
            {{ utils.toDate(consolidacionActual.Fecha) }}
          </span>
        </span>
      </div>
      <div class="mb-2">
        <span>
          Documento:
          <span class="font-weight-bold">
            {{ consolidacionActual.Transferencia }}
          </span>
        </span>
        <span class="float-right">
          Referencia:
          <span class="font-weight-bold">
            {{ consolidacionActual.Referencia.toUpperCase() }}
          </span>
        </span>
      </div>
      <div class="mb-2">
        <span>
          Destino:
          <span class="font-weight-bold">
            {{ consolidacionActual.AlmacenDestino }}
          </span>
        </span>
        <span class="float-right">
          Transfirio:
          <span class="font-weight-bold">
            {{ consolidacionActual.NombreCajero.toUpperCase() }}
          </span>
        </span>
      </div>
      <div class="text-center mb-3">
        Observaciones:
        <span class="font-weight-bold">
          {{ consolidacionActual.Observaciones.toUpperCase() }}
        </span>
      </div>
      <b-table
        ref="tableSelectProduct"
        head-variant="dark"
        hover
        striped
        :fields="fields"
        :items="articles"
        responsive="sm"
        :class="variantThemeTableBody"
      >
        <template #cell(CantUV)="row">
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
        </template>
        <template #cell(ImporteIva)="row">
          <span class="font-weight-bold">
            {{ formatNumber(row.item.CostoConIva) }}
          </span>
        </template>
      </b-table>
      <Divider class="my-3" />
      <div>
        (
        {{ utils.numeroALetras(total, {}, false) }}
        )
      </div>
      <div class="float-right text-right">
        <span class="font-weight-bold d-inline"> Subtotal: </span>
        <div class="rectangle">
          {{ formatNumber(subTotal) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Iva: </span>
        <div class="rectangle">
          {{ formatNumber(iva) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Total: </span>
        <div class="rectangle">
          {{ formatNumber(total) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { jsPDF } from 'jspdf'
import utils from '../modules/utils'
import 'jspdf-autotable'

export default {
  props: {
    sucursales: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        'Articulo',
        'Nombre',
        'Relacion',
        'CantUV',
        'CostoUV',
        'CostoIvaUV',
        'CantUC',
        'CostoUC',
        'CostoIvaUC',
        'ImporteIva',
        'Tasa',
      ],
      utils,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    sucursal() {
      const sucursales = this.sucursales
      return sucursales[`${this.$store.state.consolidaciones.sucursal}`]
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
    consolidacionActual() {
      return this.$store.state.consolidaciones.consolidacionActual.data
    },
    isEmptyDetails() {
      return (
        this.$store.state.consolidaciones.consolidacionActual.data.length === 0
      )
    },
    articles() {
      const listArticles = []
      this.$store.state.consolidaciones.details.data.forEach((article) => {
        listArticles.push(article)
      })

      return listArticles
    },
    total() {
      return this.$store.state.consolidaciones.details.data.reduce(
        (sum, article) => {
          sum += article.CostoConIva
          return sum
        },
        0
      )
    },
    iva() {
      return this.$store.state.consolidaciones.details.data.reduce(
        (sum, article) => {
          sum += article.Iva
          return sum
        },
        0
      )
    },
    subTotal() {
      return this.$store.state.consolidaciones.details.data.reduce(
        (sum, article) => {
          sum += article.CostoValorNeto
          return sum
        },
        0
      )
    },
  },
  methods: {
    ...mapMutations({
      setShowDetails: 'consolidaciones/setShowDetails',
      setConsolidacionActual: 'consolidaciones/setConsolidacionActual',
    }),
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    formatNumberWithFooter(value, footer) {
      if (footer) return ''
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    createPdf(preview) {
      this.createPdfTransferencias(
        this.sucursal,
        this.$store.state.consolidaciones.details.data,
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
        styles: { fontSize: 9 },
        headStyles: {
          fontStyle: 'bold',
          halign: 'left',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        bodyStyles: { textColor: [0, 0, 0] },
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
.rectangle {
  display: inline-block;
  width: 150px;
}
</style>
