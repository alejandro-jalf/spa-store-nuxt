<template>
  <div>
    <h3 class="text-center py-3">Existencias Por Proveedor</h3>
    <b-input-group prepend="Sucursal" class="mb-3 w-100">
      <b-form-select
        :value="sucursalSelected"
        :options="options"
        class="w-150"
        @change="selectSucursal"
      ></b-form-select>
    </b-input-group>
    <b-input-group
      :prepend="width < 500 ? 'Prov' : 'Proveedor'"
      class="mb-0 w-100"
    >
      <b-form-input
        v-model="proveedor"
        autocomplete="off"
        placeholder="Proveedor"
        type="search"
        @focus="visibleCard = true"
      ></b-form-input>
      <b-button
        v-b-tooltip.hover
        variant="light"
        size="sm"
        title="Este boton refresca la lista de proveedores"
        @click="updateProviders"
      >
        <b-icon icon="arrow-clockwise" :animation="animationTable"></b-icon>
        {{ textBtn }}
      </b-button>
    </b-input-group>
    <div class="container-card">
      <b-card v-if="visibleCard" class="card-providers" no-body>
        <div v-if="findProviders.length === 0" class="not-found">
          No se encontraron resultados
        </div>
        <div v-else>
          <div
            v-for="(prov, index) in findProviders"
            :key="index"
            class="item-option"
            @click="selectProvider(prov)"
          >
            {{ prov.Nombre }}
          </div>
        </div>
      </b-card>
    </div>

    <b-button
      variant="info"
      class="mt-2 mb-1"
      :block="width < 528"
      @click="loadData"
    >
      <b-icon icon="search" />
      Buscar Existencias
    </b-button>
    <span v-if="countExistencias > 0">
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
      <b-button-group class="mb-1 mt-2">
        <b-button
          :pressed="activeAll"
          variant="outline-primary"
          @click="setViewers('ALL')"
        >
          Todas
        </b-button>
        <b-button
          :pressed="activeWithExistence"
          variant="outline-primary"
          @click="setViewers('NOTEMPTY')"
        >
          Con Existencia
        </b-button>
        <b-button
          :pressed="activeWithOutExistence"
          variant="outline-primary"
          @click="setViewers('EMPTY')"
        >
          Sin Existencia
        </b-button>
      </b-button-group>
    </span>

    <h5 class="mt-4 mb-1">
      <div class="text-center">
        Existencias Encontradas Del Proveedor "{{ providerComplete }}" En la
        Sucursal "{{ sucExistences }}"
      </div>
      <b-badge variant="info" pill>
        {{ dataExistencias.length }} Registros
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
      perPage: 20,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      fields: [
        { key: 'Suc', label: 'Sucursal', sortable: false },
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Relacion', label: 'Relacion', sortable: true },
        { key: 'ExistenciaActualRegular', label: 'Exist. UV', sortable: true },
        { key: 'ExistenciaActualUC', label: 'Exist. UC', sortable: true },
      ],
      sucursalSelected: this.$store.state.existenciasproveedor.sucursal,
      options: [
        { value: '', text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
        { value: 'ALL', text: 'Todas' },
      ],
      proveedor: '',
      visibleCard: false,
      loadingTable: false,
      viewersArticles: 'ALL', // EMPTY || NOTEMPTY
    }
  },
  computed: {
    findProviders() {
      const text = this.proveedor
      const expr = new RegExp(text.toUpperCase().replace(' ', '.*'))
      return this.$store.state.existenciasproveedor.providers.data.filter(
        (proveedor) => expr.test(proveedor.Nombre.toUpperCase())
      )
    },
    providerComplete() {
      return (
        this.$store.state.existenciasproveedor.providerConsult.Proveedor +
        ' - ' +
        this.$store.state.existenciasproveedor.providerConsult.Nombre
      )
    },
    sucExistences() {
      const sucursal = this.$store.state.existenciasproveedor.sucursalConsult
      if (sucursal === 'ALL') return 'TODAS'
      else return sucursal
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    textBtn() {
      return this.$store.state.general.widthWindow < 500 ? 'Ref' : 'Refrescar'
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    proveedores() {
      return this.$store.state.existenciasproveedor.providers.data
    },
    animationTable() {
      return this.loadingTable ? 'spin-pulse' : ''
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    rows() {
      return this.dataExistencias.length
    },
    activeWithExistence() {
      return this.viewersArticles === 'NOTEMPTY'
    },
    activeWithOutExistence() {
      return this.viewersArticles === 'EMPTY'
    },
    activeAll() {
      return this.viewersArticles === 'ALL'
    },
    countExistencias() {
      const resumen = this.$store.state.existenciasproveedor.data.resumen
      if (resumen && resumen.length !== 0) return resumen.length
      else return this.$store.state.existenciasproveedor.data.data.length
    },
    dataExistencias() {
      const viewers = this.viewersArticles
      const resumen = this.$store.state.existenciasproveedor.data.resumen
      const datos = []
      if (resumen && resumen.length !== 0) {
        resumen.forEach((existencia) => {
          const data = { ...existencia }

          if (data.ExistenciaActualRegular === 0) data._rowVariant = 'warning'
          if (data.Nombre === 'Offline') data._rowVariant = 'danger'
          else data.Suc = 'TODAS'
          datos.push(data)
        })
      } else {
        this.$store.state.existenciasproveedor.data.data.forEach(
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
      }
      return datos.filter((existencia) => {
        if (viewers === 'ALL' || existencia.Nombre === 'Offline') return true
        else if (viewers === 'EMPTY')
          return (
            existencia.ExistenciaActualRegular === 0 ||
            existencia.ExistenciaActualRegular === null
          )
        else
          return (
            existencia.ExistenciaActualRegular !== 0 &&
            existencia.ExistenciaActualRegular !== null
          )
      })
    },
  },
  mounted() {
    this.proveedor = this.$store.state.existenciasproveedor.provider.Nombre
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'existenciasproveedor/setSucursal',
      setProvider: 'existenciasproveedor/setProvider',
    }),
    ...mapActions({
      changeData: 'existenciasproveedor/changeData',
      loadProveedores: 'existenciasproveedor/loadProveedores',
    }),
    setViewers(viewers) {
      this.viewersArticles = viewers
    },
    formatNumber(value) {
      if (value === 'Offline') return value
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    selectSucursal(suc) {
      this.setSucursal(suc)
    },
    selectProvider(prov) {
      this.visibleCard = false
      this.setProvider(prov)
      this.proveedor = prov.Nombre
    },
    async updateProviders() {
      const sucursal = this.$store.state.existenciasproveedor.sucursal
      this.loadingTable = true
      const response = await this.loadProveedores(sucursal)
      this.loadingTable = false
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    async loadData() {
      const sucursal = this.$store.state.existenciasproveedor.sucursal
      const proveedor = this.$store.state.existenciasproveedor.provider
      this.setLoading(true)
      const response = await this.changeData([sucursal, proveedor])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        const sucursal = this.$store.state.existenciasproveedor.sucursalConsult
        if (sucursal === 'ALL') {
          this.fields = [
            { key: 'Suc', label: 'Sucursal', sortable: false },
            { key: 'Articulo', label: 'Articulo', sortable: true },
            { key: 'Nombre', label: 'Nombre', sortable: true },
            { key: 'Relacion', label: 'Relacion', sortable: true },
            {
              key: 'ExistenciaActualRegular',
              label: 'Exist. UV',
              sortable: true,
            },
            { key: 'ExistenciaActualUC', label: 'Exist. UC', sortable: true },
            { key: 'ZR', label: 'ZR', sortable: false },
            { key: 'VC', label: 'VC', sortable: false },
            { key: 'ER', label: 'ER', sortable: false },
            { key: 'OU', label: 'OU', sortable: false },
            { key: 'SY', label: 'SY', sortable: false },
            { key: 'JL', label: 'JL', sortable: false },
            { key: 'BO', label: 'BO', sortable: false },
          ]
        } else {
          this.fields = [
            { key: 'Suc', label: 'Sucursal', sortable: false },
            { key: 'Articulo', label: 'Articulo', sortable: true },
            { key: 'Nombre', label: 'Nombre', sortable: true },
            { key: 'Relacion', label: 'Relacion', sortable: true },
            {
              key: 'ExistenciaActualRegular',
              label: 'Exist. UV',
              sortable: true,
            },
            { key: 'ExistenciaActualUC', label: 'Exist. UC', sortable: true },
          ]
        }
      }
    },
    createPdf(preview) {
      this.createPdfTransferencias(
        this.sucExistences,
        this.dataExistencias,
        this.providerComplete,
        preview
      )
    },
    createPdfTransferencias(sucursal, data, proveedor, preview = false) {
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

<style scoped>
.container-card {
  position: relative;
}

.card-providers {
  position: absolute;
  z-index: 8;
  left: 98px;
  max-height: 350px;
  width: calc(100% - 98px);
  overflow-y: auto;
}

.not-found {
  font-style: italic;
  color: #757575;
  padding-left: 28px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.item-option {
  padding: 5px;
  padding-left: 20px;
  font-size: 15px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
}

.item-option:hover {
  background: #e4e4e4;
}
</style>
