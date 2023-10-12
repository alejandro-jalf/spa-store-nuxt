<template>
  <div>
    <h3 class="text-center py-3">Existencias Por Sucursal</h3>
    <b-input-group prepend="Sucursal" class="mb-3 w-100">
      <b-form-select
        :value="sucursalSelected"
        :options="options"
        class="w-150"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-button variant="info" @click="loadData">
          <b-icon icon="search" />
          Buscar
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <h5 class="mt-4 mb-1">
      <div class="text-center">
        Existencias de la sucursal "{{ sucConsult }}" obtenida el
        {{ dateConsult }}
      </div>
      <b-card border-variant="info" class="my-1 mb-2">
        <b-input-group prepend="Filtro nombre">
          <b-form-input
            id="inputFilter"
            v-model="filter"
            type="text"
            :class="backgroundInputTheme"
          />
        </b-input-group>
        <b-form-text id="search-help-block" class="text-muted">
          Puede usar los ** para mejorar la busqueda
        </b-form-text>
      </b-card>
      <span v-if="countExistencias > 0" class="d-block">
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
      </span>
      <b-badge variant="info" pill>
        {{ dataExistencias.length }} Articulos
      </b-badge>
    </h5>

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
      hover
      head-variant="dark"
      outlined
      responsive
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataExistencias"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(ExistenciaActualRegular)="row">
        {{ formatNumber(row.item.ExistenciaActualRegular) }}
      </template>
      <template #cell(ExistenciaActualUC)="row">
        {{ formatNumber(row.item.ExistenciaActualUC) }}
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
      filter: '',
      perPage: 20,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      sucursalSelected: this.$store.state.existenciasporsucursal.sucursal,
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'SC', text: 'Soconusco' },
        { value: 'BO', text: 'Bodega' },
      ],
      fields: [
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Relacion', label: 'Relacion', sortable: true },
        { key: 'ExistenciaActualRegular', label: 'Exist. Pza', sortable: true },
        { key: 'ExistenciaActualUC', label: 'Exist. Cja', sortable: true },
      ],
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    sucConsult() {
      return this.$store.state.existenciasporsucursal.sucursalConsult
    },
    dateConsult() {
      return this.$store.state.existenciasporsucursal.dateConsult
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    countExistencias() {
      const resumen = this.$store.state.existenciasporsucursal.data.resumen
      if (resumen && resumen.length !== 0) return resumen.length
      else return this.$store.state.existenciasporsucursal.data.data.length
    },
    dataExistencias() {
      const filter = this.filter.replaceAll('*', '.*')
      const datos = []
      const expresion = new RegExp(`.*${filter}.*`, 'gi')
      this.$store.state.existenciasporsucursal.data.data.forEach(
        (existencia) => {
          const data = { ...existencia }
          if (
            data.ExistenciaActualRegular === 0 ||
            existencia.ExistenciaActualRegular === null
          )
            data._rowVariant = 'warning'
          if (data.Nombre === 'Offline') data._rowVariant = 'danger'
          datos.push(data)
        }
      )
      return datos.filter((existencia) => {
        return existencia.Nombre.match(expresion) !== null
      })
    },
    rows() {
      return this.dataExistencias.length
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
  },
  mounted() {
    this.setSucursalForUser()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'existenciasporsucursal/setSucursal',
    }),
    ...mapActions({
      changeData: 'existenciasporsucursal/changeData',
    }),
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        const optionsR = this.options.filter((suc) => suc.value === sucUser)
        this.options = [...optionsR, { value: 'BO', text: 'Bodega' }]
      }
    },
    selectSucursal(suc) {
      this.setSucursal(suc)
    },
    formatNumber(value) {
      if (value === 'Offline') return value
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    async loadData() {
      const sucursal = this.$store.state.existenciasporsucursal.sucursal
      const dateActual = utils.getDateNow()
      const dateConsult =
        dateActual.format('DD-MM-YYYY') +
        ' a las ' +
        dateActual.format('HH:mm a')
      this.setLoading(true)
      const response = await this.changeData([sucursal, dateConsult])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
      }
    },
    createPdf(preview) {
      this.createPdfTransferencias(
        this.sucConsult,
        this.dataExistencias,
        this.dateConsult,
        preview
      )
    },
    createPdfTransferencias(sucursal, data, dateConsult, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'letter')

      const dateConsu = `Existencias al ${dateConsult}`
      const headerPage = () => {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('SUPER PROMOCIONES DE ACAYUCAN', 105, 15, 'center')

        doc.setFontSize(11)
        doc.text(dateConsu, 10, 23, 'left')

        doc.text(data.length + ' Articulos', 10, 31)
        doc.text('Sucursal: ' + sucursal, 200, 31, 'right')
      }

      headerPage()

      const body = data.reduce((acumData, dato) => {
        acumData.push([
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
        head: [['Articulo', 'Nombre', 'Relacion', 'Exist. UV', 'Exist. UC']],
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
      else doc.save(`Existencias de sucursal - ${sucursal}.pdf`)
    },
  },
}
</script>
