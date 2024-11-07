<template>
  <div>
    <h1 class="text-center mt-2">Pedido Sugerido A Proveedor</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        :disabled="!(isManager || isAllowedUser)"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-button variant="info" @click="getPedidoSujerido">Consultar</b-button>
      </b-input-group-append>
    </b-input-group>

    <div v-if="!isCleanData" class="pt-2">
      <b-button
        :variant="variantClean"
        :block="width < 428"
        class="mt-2"
        @click="cleanData"
      >
        <b-icon icon="file-earmark-ruled-fill" />
        Limpiar tabla
      </b-button>
      <b-button
        :variant="variantSuccess"
        :block="width < 428"
        class="mt-2"
        @click="createPDF(false)"
      >
        <b-icon icon="download" />
        PDF
      </b-button>
      <b-button
        :variant="variantSuccess"
        :block="width < 428"
        class="mt-2"
        @click="createExcel"
      >
        <b-icon icon="download" />
        EXCEL
      </b-button>

      <div class="h3 mb-1 mt-4">
        Articulos sugeridos de "{{ getNameBySuc(sucConsult) }} para Proveedor"
      </div>
      <b-form-checkbox
        v-model="onliValid"
        name="only_valid"
        switch
        class="mt-2 mb-3 cursor-pointer font-weight-bold"
      >
        <div class="cursor-pointer">Mostrar solo "Sugeridos Mayores que 0"</div>
      </b-form-checkbox>
      <b-badge pill variant="info" class="chip"
        >Total: {{ dataRefactor.length }}</b-badge
      >
      <div class="mt-3 mb-3">
        <Colors
          :show-warning="true"
          title-warning="No manejado"
          content-message-warning="Las filas amarillas enfocan los articulo que aun no maneja la sucursal o que tiene tiempo que se dejo de manejar"
        />
      </div>
    </div>

    <b-container v-if="dataRefactor.length > 20" fluid="xl">
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
      v-if="width > 767"
      id="tablePedidoSujerido"
      responsive
      striped
      hover
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="my-3"
      :class="variantThemeTableBody"
    >
      <template #cell(TipoRotacion)="row">
        {{ row.item.estatusRotacion.split(' ')[1] }}
      </template>
      <template #cell(ExistLoc)="row">
        {{ dataFormated(row.item.ExitLoc) }}
      </template>
      <template #cell(ExistBo)="row">
        {{ dataFormated(row.item.ExistExt) }}
      </template>
      <template #cell(StockMin)="row">
        {{ dataFormated(row.item.StockMinimo) }}
      </template>
      <template #cell(Sugerido)="row">
        {{
          refactorCalculo(
            row.item.SugeridoAProveedor,
            row.item.FactorVenta,
            row.item.UnidadCompra,
            row.item.UnidadVenta
          )
        }}
      </template>
      <template #cell(Acciones)="row">
        <b-button
          v-b-tooltip.hover.lefttop="titleTooltip(row.item.Articulo)"
          variant="info"
          size="sm"
          @click="utils.copyToClipBoard(row.item.Articulo, $bvToast)"
        >
          <b-icon icon="files" />
        </b-button>
      </template>
    </b-table>
    <div v-else class="my-3">
      <PedidoSujeridoCard
        v-for="(article, indexArticle) in dataRefactor"
        :key="indexArticle"
        :data-formated="dataFormated"
        :article="article"
        class="mb-2"
      />
    </div>

    <div v-if="!isCleanData" class="float-right h5 mb-5">
      <span class="font-weight-bold">Fecha de consulta:</span>
      {{ horaConsult }}
    </div>

    <div class="imageLogo">
      <canvas
        id="canvas"
        class="canvasLogo"
        width="100px"
        height="100px"
      ></canvas>
      <img id="imgLogoSpa" class="imgLogo" src="../assets/cesta.png" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { jsPDF } from 'jspdf'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import PedidoSujeridoCard from '../components/PedidoSujeridoCard'
import utils from '../modules/utils'
import Colors from '../components/Colors'

export default {
  components: {
    PedidoSujeridoCard,
    Colors,
  },
  data() {
    return {
      utils,
      onliValid: false,
      perPage: 50,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'SC', text: 'SPASOCONUSCO' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      fields: [
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'StockMinimo', label: 'StockMin', sortable: true },
        { key: 'TipoRotacion', label: 'TipoRotacion', sortable: true },
        { key: 'ExistLoc', label: 'ExistLoc', sortable: true },
        { key: 'ExistBo', label: 'ExistBo', sortable: true },
        'Relacion',
        { key: 'Sugerido', label: 'Sugerido/Mes', sortable: true },
        'Acciones',
      ],
      allowedUsers: ['Justo Cruz Basurto'],
    }
  },
  computed: {
    isCleanData() {
      const sucC =
        this.$store.state.pedidosujeridoproveedor.sucursalConsult.trim() === ''
      return sucC
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    horaConsult() {
      return this.$store.state.pedidosujeridoproveedor.horaConsult
    },
    suc() {
      return this.$store.state.pedidosujeridoproveedor.sucursal
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    sucConsult() {
      return this.$store.state.pedidosujeridoproveedor.sucursalConsult
    },
    isManager() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      const datos = []
      this.$store.state.pedidosujeridoproveedor.data.data.forEach(
        (articulo) => {
          const data = { ...articulo }
          if (data.StockMinimo === null || data.ExitLoc === null)
            data._rowVariant = 'warning'
          if (data.CalculoRotacion === null)
            data.CalculoRotacion = data.FactorVenta
          datos.push(data)
        }
      )
      return datos.filter((articulo) => {
        if (!this.onliValid) return articulo
        else
          return (
            articulo.SugeridoAProveedor !== null &&
            articulo.SugeridoAProveedor > 0
          )
      })
    },
    isAllowedUser() {
      const nombreUser = this.$store.state.user.user.nombre_user
      const apellidoPUser = this.$store.state.user.user.apellido_p_user
      const apellidoMUser = this.$store.state.user.user.apellido_m_user
      const nombreCompleto =
        nombreUser + ' ' + apellidoPUser + ' ' + apellidoMUser
      return !!this.allowedUsers.find((user) => user === nombreCompleto)
    },
    rows() {
      return this.dataRefactor.length
    },
  },
  mounted() {
    const tablePedidoSujerido = document.getElementById('tablePedidoSujerido')

    this.loadDataImage()
    this.setSucursalForUser()
    if (tablePedidoSujerido) {
      tablePedidoSujerido.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tablePedidoSujerido.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setSucursal: 'pedidosujeridoproveedor/setSucursal',
      setData: 'pedidosujeridoproveedor/setData',
      setHoraConsult: 'pedidosujeridoproveedor/setHoraConsult',
      setSucursalConsult: 'pedidosujeridoproveedor/setSucursalConsult',
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'pedidosujeridoproveedor/changeData',
    }),
    refactorCalculo(
      SugeridoAProveedor = 0,
      FactorVenta,
      UnidadCompra = '',
      UnidadVenta = '',
      returnArray = false
    ) {
      const sugerido = Math.round(SugeridoAProveedor)
      if (sugerido < FactorVenta && FactorVenta - sugerido < 100) {
        if (returnArray) return ['1.00', UnidadCompra]
        return '1.00 ' + UnidadCompra
      }
      if (FactorVenta - sugerido > 100) {
        if (returnArray) return [this.dataFormated(sugerido), UnidadVenta]
        return this.dataFormated(sugerido) + ' ' + UnidadVenta
      }

      const enteros = parseInt(sugerido / FactorVenta)
      const modulo = sugerido % FactorVenta

      const incremento = Math.round(modulo / FactorVenta)

      if (returnArray)
        return [this.dataFormated(enteros + incremento), UnidadCompra]

      return this.dataFormated(enteros + incremento) + ' ' + UnidadCompra
    },
    titleTooltip(article = '') {
      return `Copiar codigo de articulo "${article}"`
    },
    loadDataImage() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const imageObject = document.getElementById('imgLogoSpa')
      const object2 = new Image()
      object2.src = imageObject.src
      context.drawImage(object2, 0, 0, 100, 100)
    },
    createPDF(preview = false) {
      const logo = document.getElementById('canvas')
      this.createPdfSugerido(this.suc, this.dataRefactor, logo)
    },
    setSucursalForUser() {
      if (!this.isManager) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
    validateData() {
      if (
        this.$store.state.pedidosujeridoproveedor.sucursal === null ||
        this.$store.state.pedidosujeridoproveedor.sucursal === 'null'
      ) {
        this.showAlertDialog(['Necesita seleccionar una sucursal'])
        return false
      }
      return true
    },
    async getPedidoSujerido() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.changeData([
        this.$store.state.pedidosujeridoproveedor.sucursal,
        '20240101',
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else
        this.setHoraConsult(utils.getDateNow().format('DD/MM/YYYY hh:mm:ss a'))
    },
    selectSucursal(sucursal) {
      this.setSucursal(sucursal)
    },
    actionNotAviable() {
      this.showAlertDialog([
        'Por el momento esta funcion no esta habilitada',
        'No habilitado',
        'info',
      ])
    },
    getNameBySuc(sucRecived) {
      const sucFind = this.options.find((suc) => suc.value === sucRecived)
      return sucFind ? sucFind.text : ''
    },
    dataFormated(value) {
      if (value === null) return '-'
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    cleanData() {
      this.setData({ data: [] })
      this.setSucursalConsult('')
      this.setHoraConsult('')
    },
    createPdfSugerido(sucursal, data, logo, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('l', 'mm', 'letter')

      const headerPage = () => {
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 125, 208)
        if (logo) {
          doc.text('Pedido Sugerido a Proveedor', 265, 20, 'right')
          doc.addImage(logo, 'PNG', 10, 15, 23, 23)
        } else doc.text('Pedido Sugerido a Proveedor', 105, 20, 'center')

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(15)
        doc.text('SUPER PROMOCIONES DE ACAYUCAN', 265, 29, 'right')
        doc.setFontSize(13)
        doc.setFont('helvetica', 'normal')
      }

      headerPage()

      const body = data.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.Articulo },
          { content: dato.Nombre },
          { content: this.dataFormated(dato.StockMinimo) },
          { content: dato.estatusRotacion.split(' ')[1] },
          { content: this.dataFormated(dato.ExitLoc) },
          { content: this.dataFormated(dato.ExistExt) },
          { content: dato.Relacion },
          {
            content: this.refactorCalculo(
              dato.SugeridoAProveedor,
              dato.FactorVenta,
              dato.UnidadCompra,
              dato.UnidadVenta
            ),
          },
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
            'Articulo',
            'Nombre',
            'Stock Min',
            'Tipo Rotacion',
            'Exist Loc',
            'Exist Bo',
            'Relacion',
            'Sugerido/Mes',
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
      else doc.save(`Sugerido A Proveedor ${sucursal}.pdf`)
    },

    createExcel() {
      const sucurlsal = this.sucConsult
      const wb = XLSX.utils.book_new()
      wb.Props = {
        Title: 'Sugerido A Proveedor - ' + sucurlsal,
        Subject: 'Por Sucursal',
        Author: this.$store.state.user.name,
      }
      wb.SheetNames.push('Hoja')

      const header = [
        'Articulo',
        'Nombre',
        'StockMin',
        'TipoRotacion',
        'ExistLoc',
        'ExistBo',
        'Relacion',
        'SugeridoMesP',
        'SugeridoMesR',
        'SugeridoMesU',
      ]

      const sugeridoExcel = [...this.dataRefactor]
      const listRefactor = []

      listRefactor.push(
        { Articulo: 'SUPER PROMOCIONES DE ACAYUCAN SA DE CV' },
        { StockMin: 'ZARAGOZA #109. CP 96000' },
        { Articulo: 'SUC: ' + sucurlsal },
        { StockMin: 'ACAYUCAN, VERACRUZ.' },
        { Articulo: 'Sugerido A Proveedor ' },
        {},
        {},
        {
          Articulo: 'Articulo',
          Nombre: 'Nombre',
          StockMin: 'Stock/Mes',
          TipoRotacion: 'Tipo Rotacion',
          ExistLoc: 'Exist Local',
          ExistBo: 'Exist Bodega',
          Relacion: 'Relacion',
          SugeridoMesP: 'Sugerido/Mes Pzas',
          SugeridoMesR: 'Sugerido Redondeado',
          SugeridoMesU: 'Unidad',
        }
      )

      sugeridoExcel.forEach((article) => {
        const [sugerido, unidad] = this.refactorCalculo(
          article.SugeridoAProveedor,
          article.FactorVenta,
          article.UnidadCompra,
          article.UnidadVenta,
          true
        )
        listRefactor.push({
          Articulo: article.Articulo,
          Nombre: article.Nombre,
          StockMin: article.StockMinimo,
          TipoRotacion: article.estatusRotacion,
          ExistLoc: article.ExitLoc,
          ExistBo: article.ExistExt,
          Relacion: article.Relacion,
          SugeridoMesP: article.SugeridoAProveedor,
          SugeridoMesR: sugerido,
          SugeridoMesU: unidad,
        })
      })

      const data = XLSX.utils.json_to_sheet(listRefactor, {
        header,
        skipHeader: true,
        origin: 'A2',
      })

      wb.Sheets.Hoja = data
      wb.Sheets.Hoja['!cols'] = [
        { wpx: 70 },
        { wpx: 250 },
        { wpx: 90 },
        { wpx: 110 },
        { wpx: 80 },
        { wpx: 90 },
        { wpx: 70 },
        { wpx: 120 },
        { wpx: 110 },
        { wpx: 50 },
      ]

      const num = 3
      if (num !== 2) {
        const fechaA = utils.getDateNow().format('YYYY MMDD')
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

        FileSaver.saveAs(
          new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
          fechaA + ' - Sugerido Proveedor - ' + sucurlsal + '.xlsx'
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
.canvasLogo,
.imgLogo {
  width: 100px;
  height: 100px;
  visibility: hidden;
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.chip {
  padding: 5px 15px;
  font-size: 15px;
}
</style>
