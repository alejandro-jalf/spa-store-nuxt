<template>
  <div>
    <h5 class="text-center py-3">Comparativa mayoristas</h5>
    <b-input-group prepend="Sucursal" class="mb-3 w-100">
      <b-form-select
        :value="sucursalSelected"
        :options="options"
        class="w-150"
        @change="setSucursal"
      ></b-form-select>
    </b-input-group>
    <div class="middle">
      <b-input-group prepend="Documento" class="w-100">
        <b-form-select
          v-model="typeSelected"
          :options="optionsType"
          :disabled="compraLoaded"
          class="w-10"
          @change="selectedType"
        ></b-form-select>
        <b-form-input
          id="input-document"
          ref="inputDocument"
          v-model="document"
          :disabled="compraLoaded"
          :state="Boolean(document) && !isEmptyDocument"
          :placeholder="placeHolder"
          type="text"
          class="w-50"
          :class="backgroundInputTheme"
          @keyup.enter="loadData"
        ></b-form-input>
      </b-input-group>
    </div>
    <div class="middle">
      <b-form-file
        v-model="excel"
        :state="Boolean(excel) && isXlsx"
        accept=".xlsx"
        :disabled="ExcelLoaded"
        browse-text="Seleccionar"
        placeholder="Seleccione o suelte archivo de cotizacion"
        drop-placeholder="Suelte el archivo aqui"
        @change="changeFile"
      ></b-form-file>
    </div>
    <div class="containerP">
      <span class="titleP">Datos listos</span>
      <b-form-checkbox
        id="check-compra"
        v-model="compraLoaded"
        disabled
        name="check-compra"
      >
        {{ nameTyped }} Cargada
      </b-form-checkbox>
      <b-form-checkbox
        id="check-compra"
        v-model="ExcelLoaded"
        disabled
        name="check-compra"
      >
        Excel Cargado
      </b-form-checkbox>
    </div>
    <b-button
      :variant="variantInfo"
      class="mb-2"
      :disabled="compraLoaded"
      @click="loadData"
    >
      <b-icon :icon="iconLoad"></b-icon>
      Cargar {{ nameTyped }}
    </b-button>
    <b-button
      :variant="variantClean"
      class="mb-2"
      :disabled="!compraLoaded"
      @click="cleanCompra"
    >
      <b-icon :icon="iconCleanCompra" />
      Limpiar {{ nameTyped }}
    </b-button>
    <b-button
      :variant="variantClean"
      class="mb-2"
      :disabled="!ExcelLoaded"
      @click="cleanExcel"
    >
      <b-icon :icon="iconCleanExcel" />
      Limpiar excel
    </b-button>
    <b-button
      :variant="variantSuccess"
      class="mb-2"
      :disabled="!ExcelLoaded || !compraLoaded || ComparativaSuccess"
      @click="compara"
    >
      <b-iconstack v-if="ExcelLoaded && compraLoaded && !ComparativaSuccess">
        <b-icon stacked icon="file-earmark"></b-icon>
        <b-icon stacked icon="arrow-left-right" scale="0.6"></b-icon>
      </b-iconstack>
      <b-icon v-else icon="exclamation-diamond-fill" />
      Comparar
    </b-button>
    <b-button
      :variant="variantClean"
      class="mb-2"
      :disabled="!ComparativaSuccess"
      @click="cleanComparativa"
    >
      <b-icon :icon="iconCleanComparativa" />
      Limpiar Comparativa
    </b-button>
    <b-button
      :variant="variantInfo"
      class="mb-2"
      :disabled="!ComparativaSuccess || !isOrdenDeCompra"
      @click="$refs.modalUpdateAll.show()"
    >
      <b-icon :icon="iconMasivo" />
      Actualizacion Masiva
    </b-button>

    <h4>{{ title }}</h4>

    <b-badge variant="info" pill class="mb-2 p-2">
      {{ dataComparativa.length }} Registros
    </b-badge>

    <b-badge variant="danger" pill class="mb-2 p-2">
      {{ countUpdates }} Registros Para Actualizar
    </b-badge>

    <b-container v-if="dataComparativa.length > 20" fluid="xl">
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
      foot-clone
      foot-variant="dark"
      outlined
      responsive
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataComparativa"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(ArticuloG)="row">
        {{ row.item.ArticuloGlobal }}
      </template>
      <template #cell(FactorG)="row">
        {{ row.item.Factor }}
      </template>
      <template #cell(UnidadG)="row">
        {{ row.item.Unidad }}
      </template>
      <template #cell(PEDIDOG)="row">
        {{ formatNumber(row.item.PEDIDO) }}
        <b-button
          v-if="isDiferentPedido(row.item)"
          variant="info"
          @click="openModal(row.item, 'pedido')"
        >
          <b-icon icon="pencil-square" />
        </b-button>
      </template>
      <template #cell(Ieps)="row">
        {{ formatNumber(row.item.IEPS) }}
      </template>
      <template #cell(Iva)="row">
        {{ formatNumber(row.item.IVA) }}
      </template>
      <template #cell(Cjas)="row">
        {{ formatNumber(row.item.CantidadRegularUC) }}
        <b-button
          v-if="isDiferentCajas(row.item)"
          variant="info"
          @click="openModal(row.item, 'cajas')"
        >
          <b-icon icon="pencil-square" />
        </b-button>
      </template>
      <template #cell(Pzas)="row">
        {{ formatNumber(row.item.CantidadRegular) }}
      </template>
      <template #cell(EnFactura)="row">
        {{ formatNumber(row.item.CostoValor) }}
      </template>
      <template #cell(Pactado)="row">
        {{ formatNumber(row.item.Pactado) }}
      </template>
      <template #cell(TotalPactado)="row">
        {{ formatNumber(row.item.TotalPactado) }}
        <b-button
          v-if="isInexpensivePactado(row.item)"
          v-b-tooltip.hover.lefttop="
            'Copiar Cantidad: ' + row.item.TotalPactado
          "
          variant="info"
          size="sm"
          @click="utils.copyToClipBoard(row.item.TotalPactado, $bvToast)"
        >
          <b-icon icon="files" />
        </b-button>
        <b-button
          v-if="isWillUpdate(row.item)"
          v-b-tooltip.hover.lefttop="
            'Actualizar directamente en la orden de compra'
          "
          variant="info"
          size="sm"
          @click="updateDirect(row.item)"
        >
          <b-icon icon="box-arrow-in-up-right" />
        </b-button>
      </template>
      <template #cell(Diferencia)="row">
        {{
          utils.aplyFormatNumeric(
            utils.roundTo(row.item.Diferencia, 2, true),
            false
          )
        }}
      </template>
      <template #cell(Acciones)="row">
        <b-button
          v-if="!row.item.ArticuloGlobal"
          variant="success"
          @click="asignar(row.item)"
        >
          Asignar
        </b-button>
      </template>
    </b-table>

    <b-container v-if="dataComparativa.length > 20" fluid="xl" class="mb-5">
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

    <mayoristas-asignar
      v-if="articleSearching.show"
      :article-find="articleSearching.articleFind"
      :data="articleSearching.data"
      :close="close"
    />
    <div>
      <b-modal
        id="modal-change"
        :title="cantidadUC.title"
        header-bg-variant="info"
        header-text-variant="white"
      >
        <div>
          <b-form-group
            id="group-change"
            :label="cantidadUC.label"
            :description="cantidadUC.description"
            label-for="input-article"
          >
            <b-form-input
              id="input-article"
              v-model="cantidadUC.cantidadRegularUC"
              type="text"
              placeholder="0.0"
              autofocus
              onclick="this.select()"
              required
              @keyup.enter="saveCantidadUC"
            ></b-form-input>
          </b-form-group>
        </div>
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="sm"
              class="float-right ml-2"
              @click="saveCantidadUC"
            >
              Aceptar
            </b-button>
            <b-button
              variant="secondary"
              size="sm"
              class="float-right"
              @click="closeModal"
            >
              Cancelar
            </b-button>
          </div>
        </template>
      </b-modal>
    </div>
    <b-modal
      id="modal-update-all"
      ref="modalUpdateAll"
      title="Actualizando Todos los Costos"
      header-bg-variant="info"
      header-text-variant="white"
    >
      <h5 class="text-dark">
        ¿Quiere actualizar los costos de la orden de compra?
      </h5>
      <div class="text-muted font-italic">
        Nota: Recuerde que la orden de compra no debe estar abierta
      </div>
      <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="primary"
            size="sm"
            class="float-right ml-2"
            @click="updateAllCostos()"
          >
            Actualizar
          </b-button>
          <b-button
            variant="secondary"
            size="sm"
            class="float-right"
            @click="$refs.modalUpdateAll.hide()"
          >
            Cancelar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import xlsx from 'xlsx'
import utils from '../modules/utils'
import MayoristasAsignar from '../components/MayoristasAsignar'

export default {
  components: {
    MayoristasAsignar,
  },
  data() {
    return {
      articleSearching: {
        articleFind: '',
        data: {},
        show: false,
      },
      cantidadUC: {
        isPedido: false,
        article: '',
        articleExcel: '',
        cantidadRegularUC: 0.0,
        title: 'Cajas Pedidas',
        label: 'Cantidad de Cajas Pedidas',
        description: '',
      },
      utils,
      compraLoaded: false,
      ExcelLoaded: false,
      ComparativaSuccess: false,
      perPage: 50,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      fields: [
        { key: 'CodigoBarras', label: 'CodigoBarras', sortable: true },
        { key: 'ArticuloG', label: 'ArticuloG', sortable: true },
        { key: 'NombreG', label: 'NombreG', sortable: true },
        { key: 'FactorG', label: 'FactorG', sortable: false },
        { key: 'UnidadG', label: 'UnidadG', sortable: false },
        { key: 'PEDIDOG', label: 'PEDIDOG', sortable: false },
        { key: '*', label: '*', sortable: false },
        { key: 'Proveedor', label: 'Proveedor', sortable: false },
        { key: 'Observaciones', label: 'Observaciones', sortable: true },
        { key: 'Position', label: 'Consec.', sortable: true },
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Relacion', label: 'Relacion', sortable: false },
        { key: 'Ieps', label: 'Ieps', sortable: false },
        { key: 'Iva', label: 'Iva', sortable: false },
        { key: 'Cjas', label: 'Cjas', sortable: false },
        { key: 'Pzas', label: 'Pzas', sortable: false },
        { key: 'EnFactura', label: 'EnFactura', sortable: false },
        { key: 'Pactado', label: 'Pactado', sortable: false },
        { key: 'TotalPactado', label: 'TotalPactado', sortable: false },
        { key: 'Diferencia', label: 'Diferencia', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: false },
      ],
      excel: null,
      typeSelected: 'C',
      sucursalSelected: 'ZR',
      document: '',
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
      optionsType: [
        { value: 'C', text: 'Compra' },
        { value: 'W', text: 'Orden de Compra' },
      ],
      placeHolder: 'C0000000000',
    }
  },
  computed: {
    isEmptyDocument() {
      return this.$store.state.mayoristas.documento.data.length === 0
    },
    isOrdenDeCompra() {
      const expConsecutivo = new RegExp('C.*')
      return !expConsecutivo.test(
        this.$store.state.mayoristas.comparativa.documento.toUpperCase()
      )
    },
    countUpdates() {
      const comparativa = { ...this.$store.state.mayoristas.comparativa }
      const expConsecutivo = new RegExp('C.*')
      let dataUpdates = 0
      if (!expConsecutivo.test(comparativa.documento.toUpperCase())) {
        comparativa.data.forEach((compara) => {
          if (
            !!compara.ArticuloExcel.ArticuloGlobal &&
            parseFloat(utils.roundTo(compara.ArticleDocument.Diferencia)) > 0.5
          )
            dataUpdates++
        })
      }
      return dataUpdates
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    isXlsx() {
      const nameSplited = this.excel.name.split('.')
      return nameSplited[nameSplited.length - 1] === 'xlsx'
    },
    nameTyped() {
      return this.typeSelected === 'C' ? 'Compra' : 'Orden de Compra'
    },
    iconLoad() {
      return !this.compraLoaded
        ? 'arrow-up-square-fill'
        : 'exclamation-diamond-fill'
    },
    iconCleanCompra() {
      return this.compraLoaded
        ? 'file-richtext-fill'
        : 'exclamation-diamond-fill'
    },
    iconCleanExcel() {
      return this.ExcelLoaded
        ? 'file-earmark-excel-fill'
        : 'exclamation-diamond-fill'
    },
    iconCleanComparativa() {
      return this.ComparativaSuccess
        ? 'file-earmark-fill'
        : 'exclamation-diamond-fill'
    },
    iconMasivo() {
      const expConsecutivo = new RegExp('C.*')
      const isOrdenDeCompra = !expConsecutivo.test(
        this.$store.state.mayoristas.comparativa.documento.toUpperCase()
      )
      return this.ComparativaSuccess && isOrdenDeCompra
        ? 'list-stars'
        : 'exclamation-diamond-fill'
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
    dataComparativa() {
      const items = []
      this.$store.state.mayoristas.comparativa.data.forEach((compara) => {
        const articleReviewed = {
          ...compara.ArticuloExcel,
          NombreG: compara.ArticuloExcel.Nombre,
          ...compara.ArticleDocument,
        }
        if (!compara.ArticuloExcel.ArticuloGlobal)
          articleReviewed._rowVariant = 'danger'
        articleReviewed._cellVariants = {}
        if (articleReviewed.Diferencia < 0)
          articleReviewed._cellVariants.Diferencia = 'danger'
        else if (parseFloat(utils.roundTo(articleReviewed.Diferencia)) > 0.5)
          articleReviewed._cellVariants.TotalPactado = 'success'

        if (
          compara.ArticuloExcel.PEDIDO !==
          compara.ArticleDocument.CantidadRegularUC
        ) {
          articleReviewed._cellVariants.Cjas = 'warning'
          articleReviewed._cellVariants.PEDIDOG = 'warning'
        }
        items.push(articleReviewed)
      })
      return items
    },
    rows() {
      return this.$store.state.mayoristas.comparativa.data.length
    },
    title() {
      return this.$store.state.mayoristas.title
    },
  },
  mounted() {
    const comparativa = { ...this.$store.state.mayoristas.comparativa }
    this.ComparativaSuccess = comparativa.data.length > 0

    const documentSaved = { ...this.$store.state.mayoristas.documento }
    this.document = documentSaved.consecutivo
    if (documentSaved.data.length > 0) this.compraLoaded = true
    const excelSaved = { ...this.$store.state.mayoristas.excel }
    if (excelSaved.data.length === 0) this.excel = null
    else this.ExcelLoaded = true
    const suc = this.$store.state.mayoristas.sucursal
    this.sucursalSelected = suc
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setTitle: 'mayoristas/setTitle',
      setSucursal: 'mayoristas/setSucursal',
      setExcel: 'mayoristas/setExcel',
      setDocumento: 'mayoristas/setDocumento',
      setComparativa: 'mayoristas/setComparativa',
    }),
    ...mapActions({
      changeDataDocument: 'mayoristas/changeDataDocument',
      updateCosto: 'mayoristas/updateCosto',
      updateCostoMasivo: 'mayoristas/updateCostoMasivo',
    }),
    formatNumber(value) {
      if (value === null) return value
      else if (value === undefined) return null
      return utils.aplyFormatNumeric(utils.roundTo(value, 2, true))
    },
    asignar(values) {
      this.articleSearching.show = true
      this.articleSearching.data = values
      this.articleSearching.articleFind = values.Articulo
    },
    close() {
      this.articleSearching.show = false
    },
    closeModal() {
      this.$bvModal.hide('modal-change')
    },
    saveCantidadUC() {
      const comparativa = { ...this.$store.state.mayoristas.comparativa }
      const data = []
      comparativa.data.forEach((articleC) => {
        const ArticleDocument = { ...articleC.ArticleDocument }
        const ArticuloExcel = { ...articleC.ArticuloExcel }
        if (
          ArticleDocument.Articulo === this.cantidadUC.article &&
          ArticuloExcel.ArticuloGlobal === this.cantidadUC.articleExcel
        ) {
          if (this.cantidadUC.isPedido)
            ArticuloExcel.PEDIDO = this.cantidadUC.cantidadRegularUC
          else {
            const cUC = this.cantidadUC.cantidadRegularUC
            ArticleDocument.CantidadRegularUC = cUC
          }
          const pactado =
            ArticuloExcel.Proveedor / ArticleDocument.IEPS / ArticleDocument.IVA
          const totalPactado = pactado * ArticleDocument.CantidadRegularUC
          const diferencia = ArticleDocument.CostoValor - totalPactado

          ArticleDocument.Pactado = pactado
          ArticleDocument.TotalPactado = totalPactado
          ArticleDocument.Diferencia = diferencia
        }
        data.push({
          ArticleDocument,
          ArticuloExcel,
        })
      })
      this.setComparativa({
        documento: comparativa.documento,
        excel: comparativa.excel,
        data,
      })
      this.$bvModal.hide('modal-change')
    },
    openModal(values, from) {
      if (from === 'cajas') {
        const cUC = values.CantidadRegularUC
        this.cantidadUC = {
          isPedido: false,
          article: values.Articulo,
          articleExcel: values.ArticuloGlobal,
          cantidadRegularUC: cUC,
          title: 'Cajas En Factura',
          label: 'Cantidad de Cajas En Factura',
          description: `[${values.Articulo} - ${values.Nombre}]`,
        }
      } else
        this.cantidadUC = {
          isPedido: true,
          article: values.Articulo,
          articleExcel: values.ArticuloGlobal,
          cantidadRegularUC: values.PEDIDO,
          title: 'Cajas Pedidas',
          label: 'Cantidad de Cajas Pedidas',
          description: `[${values.Articulo} - ${values.Nombre}]`,
        }
      this.$bvModal.show('modal-change')
    },
    cleanExcel() {
      this.setExcel({
        name: '',
        data: [],
      })
      this.excel = null
      this.ExcelLoaded = false
    },
    cleanCompra() {
      this.setDocumento({ consecutivo: '', data: [] })
      this.document = ''
      this.compraLoaded = false
    },
    cleanComparativa() {
      this.setComparativa({
        documento: '',
        excel: '',
        data: [],
      })
      this.setTitle('')
      this.ComparativaSuccess = false
    },
    selectedType(type) {
      if (type === 'C') this.placeHolder = 'C0000000000'
      else this.placeHolder = '0000000000'
      this.$refs.inputDocument.select()
    },
    isDiferentCajas(data) {
      return (
        data._cellVariants && data._cellVariants.Cjas && data.ArticuloGlobal
      )
    },
    isInexpensivePactado(data) {
      return (
        !!data.ArticuloGlobal &&
        parseFloat(utils.roundTo(data.Diferencia)) > 0.5
      )
    },
    isWillUpdate(data) {
      const comparativa = { ...this.$store.state.mayoristas.comparativa }
      const expConsecutivo = new RegExp('C.*')
      return (
        !!data.ArticuloGlobal &&
        !expConsecutivo.test(comparativa.documento.toUpperCase()) &&
        parseFloat(utils.roundTo(data.Diferencia)) > 0.5
      )
    },
    isDiferentPedido(data) {
      return (
        data._cellVariants && data._cellVariants.PEDIDOG && data.ArticuloGlobal
      )
    },
    async updateDirect(data) {
      this.setLoading(true)
      const document = this.$store.state.mayoristas.comparativa.documento
      const sucursal = this.$store.state.mayoristas.sucursal
      const body = {
        Articulo: data.Articulo,
        Nombre: data.Nombre,
        CantidadRegularUC: data.CantidadRegularUC,
        CantidadRegular: data.CantidadRegular,
        CostoValor: data.CostoValor,
        TotalPactado: data.TotalPactado,
        Position: data.Position,
      }
      const response = await this.updateCosto([sucursal, document, body])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else
        this.showAlertDialog([response.message, 'Costo actualizado', 'success'])
    },
    async updateAllCostos() {
      this.$refs.modalUpdateAll.hide()
      const comparativa = { ...this.$store.state.mayoristas.comparativa }
      const expConsecutivo = new RegExp('C.*')
      if (!expConsecutivo.test(comparativa.documento.toUpperCase())) {
        this.setLoading(true)
        const dataUpdates = []
        comparativa.data.forEach((compara) => {
          if (
            !!compara.ArticuloExcel.ArticuloGlobal &&
            parseFloat(utils.roundTo(compara.ArticleDocument.Diferencia)) > 0.5
          ) {
            dataUpdates.push({
              Articulo: compara.ArticleDocument.Articulo,
              Nombre: compara.ArticleDocument.Nombre,
              CantidadRegularUC: compara.ArticleDocument.CantidadRegularUC,
              CantidadRegular: compara.ArticleDocument.CantidadRegular,
              CostoValor: compara.ArticleDocument.CostoValor,
              TotalPactado: compara.ArticleDocument.TotalPactado,
              Position: compara.ArticleDocument.Position,
            })
          }
        })
        if (dataUpdates.length > 0) {
          const sucursal = this.$store.state.mayoristas.sucursal
          const response = await this.updateCostoMasivo([
            sucursal,
            comparativa.documento,
            dataUpdates,
          ])
          if (!response.success)
            this.showAlertDialog([response.message, 'Error inesperado'])
          else
            this.showAlertDialog([
              response.message,
              'Costos actualizados',
              'success',
            ])
        } else
          this.showAlertDialog([
            'No hay articulos que necesiten modificarse costos',
            'Lista vacia',
          ])
        this.setLoading(false)
      } else
        this.showAlertDialog([
          'Solo se puede modificar una orden de compra',
          'Error al actualizar costos',
        ])
    },
    async loadData() {
      if (this.document.trim() === '') {
        this.showAlertDialog([
          'Debe ingresar un documento para cargar',
          'Datos vacios',
        ])
      } else {
        const sucursal = this.$store.state.mayoristas.sucursal
        this.setLoading(true)
        const response = await this.changeDataDocument([
          sucursal,
          this.typeSelected,
          this.document,
        ])
        this.setLoading(false)
        if (!response.success)
          this.showAlertDialog([response.message, 'Error inesperado'])
        else if (response.data.length === 0)
          this.showAlertDialog([
            'El documento seleccionado esta vacio',
            'Datos vacios',
            'danger',
          ])
        else {
          this.compraLoaded = true
          this.showAlertDialog([response.message, 'Datos cargados', 'success'])
        }
      }
    },
    compara() {
      if (this.excel === null && !this.ExcelLoaded)
        this.showAlertDialog(['Falta seleccionar el excel'])
      else {
        const nameSplited =
          this.excel !== null
            ? this.excel.name.split('.')
            : this.$store.state.mayoristas.excel.name.split('.')
        if (nameSplited[nameSplited.length - 1] !== 'xlsx')
          this.showAlertDialog(['Debe seleccionar un archivo excel'])
        else {
          const documentSaved = { ...this.$store.state.mayoristas.documento }
          const excelSaved = { ...this.$store.state.mayoristas.excel }

          const comparativa = documentSaved.data.reduce(
            (compara, articleDoc) => {
              const articleXlsx = excelSaved.data.find(
                (articleExcel) =>
                  articleExcel.ArticuloGlobal === articleDoc.Articulo
              )
              const articleReviewed = { ArticuloExcel: {}, ArticleDocument: {} }
              if (articleXlsx) {
                const pactado =
                  articleXlsx.Proveedor / articleDoc.IEPS / articleDoc.IVA
                const totalPactado = pactado * articleDoc.CantidadRegularUC
                const diferencia = articleDoc.CostoValor - totalPactado

                articleReviewed.ArticuloExcel = articleXlsx
                articleReviewed.ArticleDocument = articleDoc
                articleReviewed.ArticleDocument.Pactado = pactado
                articleReviewed.ArticleDocument.TotalPactado = totalPactado
                articleReviewed.ArticleDocument.Diferencia = diferencia
              } else {
                articleReviewed.ArticleDocument = articleDoc
                articleReviewed.ArticleDocument.Pactado = 0
                articleReviewed.ArticleDocument.TotalPactado = 0
                articleReviewed.ArticleDocument.Diferencia =
                  articleDoc.CostoValor
              }
              compara.push(articleReviewed)
              return compara
            },
            []
          )

          const title =
            'Comparando ' + documentSaved.consecutivo + ' VS ' + excelSaved.name

          this.setComparativa({
            documento: documentSaved.consecutivo,
            excel: excelSaved.name,
            data: comparativa,
          })
          this.setTitle(title)
          this.ComparativaSuccess = true
        }
      }
    },
    isValidFormat(arrayTitles) {
      if (arrayTitles.length < 8) {
        this.showAlertDialog([
          'El archivo debe tener 9 columnas con los siguientes titulos: "CodigoBarras", "ArticuloGlobal", "Nombre", "Factor", "Unidad", "PEDIDO", "*", "Proveedor", "Observaciones"',
        ])
        return false
      } else if (arrayTitles[0] !== 'CodigoBarras') {
        this.showAlertDialog([
          `La columna 1 deberia llamarse "CodigoBarras" y tiene el titulo de: ${arrayTitles[0]}`,
        ])
        return false
      } else if (arrayTitles[1] !== 'ArticuloGlobal') {
        this.showAlertDialog([
          `La columna 2 deberia llamarse "ArticuloGlobal" y tiene el titulo de: ${arrayTitles[1]}`,
        ])
        return false
      } else if (arrayTitles[2] !== 'Nombre') {
        this.showAlertDialog([
          `La columna 3 deberia llamarse "Nombre" y tiene el titulo de: ${arrayTitles[2]}`,
        ])
        return false
      } else if (arrayTitles[3] !== 'Factor') {
        this.showAlertDialog([
          `La columna 4 deberia llamarse "Factor" y tiene el titulo de: ${arrayTitles[3]}`,
        ])
        return false
      } else if (arrayTitles[4] !== 'Unidad') {
        this.showAlertDialog([
          `La columna 5 deberia llamarse "Unidad" y tiene el titulo de: ${arrayTitles[4]}`,
        ])
        return false
      } else if (arrayTitles[5] !== 'PEDIDO') {
        this.showAlertDialog([
          `La columna 6 deberia llamarse "PEDIDO" y tiene el titulo de: ${arrayTitles[5]}`,
        ])
        return false
      } else if (arrayTitles[6] !== '*') {
        this.showAlertDialog([
          `La columna 7 deberia llamarse "*" y tiene el titulo de: ${arrayTitles[6]}`,
        ])
        return false
      } else if (arrayTitles[7] !== 'Proveedor') {
        this.showAlertDialog([
          `La columna 8 deberia llamarse "Proveedor" y tiene el titulo de: ${arrayTitles[7]}`,
        ])
        return false
      } else return true
    },
    changeFile(evt) {
      if (!evt) return false
      const selectedFile = evt.target.files[0]
      const nameSplited = selectedFile.name.split('.')
      if (nameSplited[nameSplited.length - 1] !== 'xlsx') {
        this.excel = null
        this.showAlertDialog([
          'Deberia elejir un archivo excel con extension .xlsx',
        ])
      } else {
        const reader = new FileReader()
        reader.onload = async (event) => {
          const data = event.target.result
          const workbook = xlsx.read(data, {
            type: 'binary',
          })
          await workbook.SheetNames.forEach((sheetName) => {
            const xlRowObject = xlsx.utils.sheet_to_row_object_array(
              workbook.Sheets[sheetName]
            )
            try {
              const titles = Object.keys(xlRowObject[0])
              if (this.isValidFormat(titles)) {
                xlRowObject.forEach((art, position) => {
                  const titlesArt = Object.keys(art)
                  if (titlesArt[8]) {
                    xlRowObject[position].Observaciones = art[`${titlesArt[8]}`]
                  }
                })
                this.setExcel({
                  name: this.excel.name,
                  data: xlRowObject,
                })
              } else this.excel = null
              this.ExcelLoaded = true
            } catch (error) {
              this.showAlertDialog([
                'El archivo no cumple con el formato: ' + error,
              ])
            }
          })
        }

        reader.onerror = (event) => {
          this.showAlertDialog([
            'Ocurrio un error al cargar el excel: ' + event,
          ])
        }

        reader.readAsBinaryString(selectedFile)
      }
    },
  },
}
</script>

<style scoped>
.middle {
  display: inline-block;
  width: calc(50% - 5px);
  margin-bottom: 10px;
}

.containerP {
  position: relative;
  min-width: max-content;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid rgb(0, 139, 164);
}

.titleP {
  color: black;
  position: absolute;
  top: -12px;
  padding-left: 3px;
  padding-right: 3px;
  left: 5px;
  border-radius: 5px;
  background: #f3f5f4;
}

@media screen and (max-width: 994px) {
  .middle {
    width: 100%;
  }
}
</style>
