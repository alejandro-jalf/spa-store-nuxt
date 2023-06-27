<template>
  <div>
    <h4 class="my-3 text-center">Antiguedad de Existencias</h4>
    <b-input-group prepend="Sucursal" class="mb-3">
      <b-form-select
        v-model="selected"
        :options="options"
        :disabled="!accessChangeSucursal"
        @change="setSucursalMore"
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
      <Colors
        class="d-block my-3"
        :show-warning="true"
        :show-danger="true"
        title-warning="Sin Existencia"
        title-danger="Sin Conexion"
        content-message-warning="Las filas amarillas es para enfocar los articulos que tienen existencia 0"
        content-message-danger="Esto sucede cuando no hay conexion con la sucursal, ya bien sea por falta de internet o por conexion inactiva (caida). <br/> Se recomienda que se reporte con el departamento de sistemas"
      />
    </span>

    <b-container v-if="dataExistencias.length > 20" fluid="xl">
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
    </b-table>
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
        { key: 'FechaCompra', label: 'FechaCompra', sortable: true },
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
      const datos = []
      this.$store.state.existenciasantiguedad.data.data.forEach((articulo) => {
        const data = { ...articulo }
        if (data.StockMinimo === null || data.ExitLoc === null)
          data._rowVariant = 'warning'
        if (data.CalculoRotacion === null)
          data.CalculoRotacion = data.FactorVenta
        datos.push(data)
      })
      return datos
    },
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
    getSucursalBySiglas(sucursal) {
      return this.options.reduce((suc, option) => {
        if (option.value === sucursal) suc = option.text
        return suc
      }, 'Zaragoza')
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    setSucursalMore() {},
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
      this.createPdfTransferencias(
        this.sucExistences,
        this.dataExistencias,
        this.providerComplete,
        preview
      )
    },
    createPdfExistencias(sucursal, data, proveedor, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'letter')

      const provider = `Existencias, Proveedor: "${proveedor}"`
      const headerPage = () => {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('SUPER PROMOCIONES DE ACAYUCAN', 105, 15, 'center')

        doc.setFontSize(11)
        doc.text(provider, 10, 23, 'left')

        doc.text(data.length + ' Registros', 10, 31)
        doc.text('Sucursal: ' + sucursal, 200, 31, 'right')
      }

      headerPage()

      const body = data.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Suc },
          { content: dato.Articulo },
          { content: dato.Nombre },
          { content: dato.Relacion },
          {
            content: this.formatNumber(dato.ExistenciaActualRegular),
          },
          {
            content: this.formatNumber(dato.ExistenciaActualUC),
          },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 36,
        tableWidth: 190,
        margin: {
          left: 10,
        },
        styles: { fontSize: 10 },
        headStyles: {
          fontStyle: 'bold',
          halign: 'left',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        bodyStyles: { textColor: [0, 0, 0] },
        head: [
          ['Suc.', 'Articulo', 'Nombre', 'Relacion', 'Exist. UV', 'Exist. UC'],
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
        if (pageCurrent === 1) doc.line(10, 44, 200, 44)
      }

      if (preview) doc.output('dataurlnewwindow')
      else doc.save(`${sucursal} - ${provider} - ${sucursal}.pdf`)
    },
  },
}
</script>
