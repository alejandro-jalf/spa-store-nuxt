<template>
  <div>
    <h5 class="text-center py-3">Cotizacion de Mayoristas</h5>
    <!-- <b-input-group prepend="Sucursal" class="mb-3 w-100">
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
    </div> -->
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
    <!-- <div class="containerP">
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
    </div> -->
    <!-- <b-button
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
    </b-button> -->
    <b-button
      :variant="variantClean"
      :disabled="!ExcelLoaded"
      @click="cleanExcel"
    >
      <b-icon :icon="iconCleanExcel" />
      Limpiar excel
    </b-button>
    <b-button :variant="variantSuccess" @click="compara"> Comparar </b-button>
    <b-button :variant="variantInfo" @click="generateExcel">
      Descargar
    </b-button>
    <!-- <b-button
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
    </b-button> -->

    <h4>{{ title }}</h4>

    <b-badge variant="info" pill class="mb-2 p-2">
      {{ dataComparativa.length }} Registros
    </b-badge>

    <!-- <b-badge variant="danger" pill class="mb-2 p-2">
      {{ countUpdates }} Registros Para Actualizar
    </b-badge> -->

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
      select-mode="single"
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
      <!-- <template #cell(Acciones)="row">
        <b-button
          v-if="!row.item.ArticuloGlobal"
          variant="success"
          @click="asignar(row.item)"
        >
          Asignar
        </b-button>
      </template> -->
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
import FileSaver from 'file-saver'
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
        'CodigoBarras',
        'ArticuloGLobal',
        'Nombre',
        'ExistBodegaUC',
        'UltimoCostoNetoUC',
        'Factor',
        'PEDIDOG',
        'Unidad',
        'Proveedor',
        'ExistGlobalUC',
        'StockMinimoUC',
        'PedidoSugerido',
        'PideZR',
        'CantidadZR',
        'PideVC',
        'CantidadVC',
        'PideOU',
        'CantidadOU',
        'PideJL',
        'CantidadJL',
        'PideER',
        'CantidadER',
        'PideSY',
        'CantidadSY',
        '*V',
        'Viveres',
        'Obsr',
        '*M',
        'Mty',
        'Obsr2',
        '*A',
        'Alvisar',
        'Obsr3',
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
      return this.$store.state.cotizacionmayoristas.documento.data.length === 0
    },
    isOrdenDeCompra() {
      const expConsecutivo = new RegExp('C.*')
      return !expConsecutivo.test(
        this.$store.state.cotizacionmayoristas.comparativa.documento.toUpperCase()
      )
    },
    // countUpdates() {
    //   const comparativa = {
    //     ...this.$store.state.cotizacionmayoristas.comparativa,
    //   }
    //   let dataUpdates = 0
    //   comparativa.data.forEach((compara) => {
    //     if (
    //       !!compara.ArticuloExcel.ArticuloGlobal &&
    //       parseFloat(utils.roundTo(compara.ArticleDocument.Diferencia)) > 0.5
    //     )
    //       dataUpdates++
    //   })
    //   return dataUpdates
    // },
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
        this.$store.state.cotizacionmayoristas.comparativa.documento.toUpperCase()
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
      // const items = []
      // this.$store.state.cotizacionmayoristas.comparativa.data.forEach(
      //   (compara) => {
      //     const articleReviewed = {
      //       ...compara.ArticuloExcel,
      //       NombreG: compara.ArticuloExcel.Nombre,
      //       ...compara.ArticleDocument,
      //     }
      //     if (!compara.ArticuloExcel.ArticuloGlobal)
      //       articleReviewed._rowVariant = 'danger'
      //     articleReviewed._cellVariants = {}
      //     if (articleReviewed.Diferencia < 0)
      //       articleReviewed._cellVariants.Diferencia = 'danger'
      //     else if (parseFloat(utils.roundTo(articleReviewed.Diferencia)) > 0.5)
      //       articleReviewed._cellVariants.TotalPactado = 'success'

      //     if (
      //       compara.ArticuloExcel.PEDIDO !==
      //       compara.ArticleDocument.CantidadRegularUC
      //     ) {
      //       articleReviewed._cellVariants.Cjas = 'warning'
      //       articleReviewed._cellVariants.PEDIDOG = 'warning'
      //     }
      //     items.push(articleReviewed)
      //   }
      // )
      return this.$store.state.cotizacionmayoristas.comparativa.data
    },
    rows() {
      return this.$store.state.cotizacionmayoristas.comparativa.data.length
    },
    title() {
      return this.$store.state.cotizacionmayoristas.title
    },
  },
  mounted() {
    const comparativa = {
      ...this.$store.state.cotizacionmayoristas.comparativa,
    }
    this.ComparativaSuccess = comparativa.data.length > 0

    const documentSaved = {
      ...this.$store.state.cotizacionmayoristas.documento,
    }
    this.document = documentSaved.consecutivo
    if (documentSaved.data.length > 0) this.compraLoaded = true
    const excelSaved = { ...this.$store.state.cotizacionmayoristas.excel }
    if (excelSaved.data.length === 0) this.excel = null
    else this.ExcelLoaded = true
    const suc = this.$store.state.cotizacionmayoristas.sucursal
    this.sucursalSelected = suc
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setTitle: 'cotizacionmayoristas/setTitle',
      setSucursal: 'cotizacionmayoristas/setSucursal',
      setExcel: 'cotizacionmayoristas/setExcel',
      setDocumento: 'cotizacionmayoristas/setDocumento',
      setComparativa: 'cotizacionmayoristas/setComparativa',
    }),
    ...mapActions({
      changeDataDocument: 'cotizacionmayoristas/changeDataDocument',
      updateCosto: 'cotizacionmayoristas/updateCosto',
      updateCostoMasivo: 'cotizacionmayoristas/updateCostoMasivo',
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
      const comparativa = {
        ...this.$store.state.cotizacionmayoristas.comparativa,
      }
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
      const comparativa = {
        ...this.$store.state.cotizacionmayoristas.comparativa,
      }
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
      const document =
        this.$store.state.cotizacionmayoristas.comparativa.documento
      const sucursal = this.$store.state.cotizacionmayoristas.sucursal
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
      const comparativa = {
        ...this.$store.state.cotizacionmayoristas.comparativa,
      }
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
          const sucursal = this.$store.state.cotizacionmayoristas.sucursal
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
        const sucursal = this.$store.state.cotizacionmayoristas.sucursal
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
      // if (this.excel === null && !this.ExcelLoaded)
      //   this.showAlertDialog(['Falta seleccionar el excel'])
      // else {
      //   }
      // const nameSplited =
      //   this.excel !== null''
      //     ? this.excel.name.split('.')
      //     : this.$store.state.cotizacionmayoristas.excel.name.split('.')
      // if (nameSplited[nameSplited.length - 1] !== 'xlsx')
      //   this.showAlertDialog(['Debe seleccionar un archivo excel'])
      // else {
      // const documentSaved = {
      //   ...this.$store.state.cotizacionmayoristas.documento,
      // }

      const getMinValor = (val1 = {}, val2 = {}, val3 = {}) => {
        const array = [val1, val2, val3]
        const min = array.reduce(
          (old, recibido) => {
            const minNew = Math.min(old.value, recibido.value)
            if (minNew === recibido.value) old = recibido
            return old
          },
          { title: 'old', value: 99999992 }
        )
        return min
      }

      const excelSaved = { ...this.$store.state.cotizacionmayoristas.excel }
      console.log(excelSaved)

      const comparativa = excelSaved.data.reduce((data, row) => {
        const newRow = { ...row }
        const minValor = getMinValor(
          { title: '*V', value: newRow.Viveres || 99999993 },
          { title: '*A', value: newRow.Alvisar || 99999994 },
          { title: '*M', value: newRow.Mty || 99999995 }
        )
        if (minValor.title !== 'old') {
          // console.log('NOT_OLD: ', minValor.title, minValor.value)
          newRow[`${minValor.title}`] = '*'
        } else {
          console.log(minValor.title, minValor.value)
        }
        data.push(newRow)
        return data
      }, [])

      // const comparativa = documentSaved.data.reduce((compara, articleDoc) => {
      //   const articleXlsx = excelSaved.data.find(
      //     (articleExcel) => articleExcel.ArticuloGlobal === articleDoc.Articulo
      //   )
      //   const articleReviewed = { ArticuloExcel: {}, ArticleDocument: {} }
      //   if (articleXlsx) {
      //     const pactado =
      //       articleXlsx.Proveedor / articleDoc.IEPS / articleDoc.IVA
      //     const totalPactado = pactado * articleDoc.CantidadRegularUC
      //     const diferencia = articleDoc.CostoValor - totalPactado

      //     articleReviewed.ArticuloExcel = articleXlsx
      //     articleReviewed.ArticleDocument = articleDoc
      //     articleReviewed.ArticleDocument.Pactado = pactado
      //     articleReviewed.ArticleDocument.TotalPactado = totalPactado
      //     articleReviewed.ArticleDocument.Diferencia = diferencia
      //   } else {
      //     articleReviewed.ArticleDocument = articleDoc
      //     articleReviewed.ArticleDocument.Pactado = 0
      //     articleReviewed.ArticleDocument.TotalPactado = 0
      //     articleReviewed.ArticleDocument.Diferencia = articleDoc.CostoValor
      //   }
      //   compara.push(articleReviewed)
      //   return compara
      // }, [])

      // const title =
      //   'Comparando ' + documentSaved.consecutivo + ' VS ' + excelSaved.name

      this.setComparativa({
        documento: 'Mayoristas',
        excel: 'Mayorista.excel',
        data: comparativa,
      })
      // this.setTitle(title)
      // this.ComparativaSuccess = true
      // }
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
              // const titles = Object.keys(xlRowObject[0])
              // if (this.isValidFormat(titles)) {
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
              // } else this.excel = null
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
    generateExcel() {
      this.createExcel(this.dataComparativa)
    },
    createExcel(dataCotizacion) {
      const wb = xlsx.utils.book_new()
      wb.Props = {
        Title: 'cotizacion',
        Subject: 'cotizacion',
        Author: this.$store.state.user.name,
      }
      wb.SheetNames.push('Hoja')

      const header = [
        'CodigoBarras',
        'ArticuloGLobal',
        'Nombre',
        'ExistBodegaUC',
        'UltimoCostoNetoUC',
        'Factor',
        'PEDIDOG',
        'Unidad',
        'Proveedor',
        'ExistGlobalUC',
        'StockMinimoUC',
        'PedidoSugerido',
        'PideZR',
        'CantidadZR',
        'PideVC',
        'CantidadVC',
        'PideOU',
        'CantidadOU',
        'PideJL',
        'CantidadJL',
        'PideER',
        'CantidadER',
        'PideSY',
        'CantidadSY',
        '*V',
        'Viveres',
        'Obsr',
        '*M',
        'Mty',
        'Obsr2',
        '*A',
        'Alvisar',
        'Obsr3',
      ]

      const listRefactor = []

      listRefactor.push({
        CodigoBarras: 'CodigoBarras',
        ArticuloGLobal: 'ArticuloGLobal',
        Nombre: 'Nombre',
        ExistBodegaUC: 'ExistBodegaUC',
        UltimoCostoNetoUC: 'UltimoCostoNetoUC',
        Factor: 'Factor',
        PEDIDOG: 'PEDIDOG',
        Unidad: 'Unidad',
        Proveedor: 'Proveedor',
        ExistGlobalUC: 'ExistGlobalUC',
        StockMinimoUC: 'StockMinimoUC',
        PedidoSugerido: 'PedidoSugerido',
        PideZR: 'PideZR',
        CantidadZR: 'CantidadZR',
        PideVC: 'PideVC',
        CantidadVC: 'CantidadVC',
        PideOU: 'PideOU',
        CantidadOU: 'CantidadOU',
        PideJL: 'PideJL',
        CantidadJL: 'CantidadJL',
        PideER: 'PideER',
        CantidadER: 'CantidadER',
        PideSY: 'PideSY',
        CantidadSY: 'CantidadSY',
        '*V': '*V',
        Viveres: 'Viveres',
        Obsr: 'Obsr',
        '*M': '*M',
        Mty: 'Mty',
        Obsr2: 'Obsr2',
        '*A': '*A',
        Alvisar: 'Alvisar',
        Obsr3: 'Obsr3',
      })

      dataCotizacion.forEach((article) => {
        listRefactor.push({
          CodigoBarras: article.CodigoBarras,
          ArticuloGLobal: article.ArticuloGLobal,
          ExistBodegaUC: article.ExistBodegaUC,
          UltimoCostoNetoUC: article.UltimoCostoNetoUC,
          Factor: article.Factor,
          PEDIDOG: article.PEDIDOG,
          Unidad: article.Unidad,
          Proveedor: article.Proveedor,
          ExistGlobalUC: article.ExistGlobalUC,
          StockMinimoUC: article.StockMinimoUC,
          PedidoSugerido: article.PedidoSugerido,
          PideZR: article.PideZR,
          CantidadZR: article.CantidadZR,
          PideVC: article.PideVC,
          CantidadVC: article.CantidadVC,
          PideOU: article.PideOU,
          CantidadOU: article.CantidadOU,
          PideJL: article.PideJL,
          CantidadJL: article.CantidadJL,
          PideER: article.PideER,
          CantidadER: article.CantidadER,
          PideSY: article.PideSY,
          CantidadSY: article.CantidadSY,
          '*V': article['*V'] || '',
          Viveres: article.Viveres || 0,
          Obsr: article.Obsr || '',
          '*M': article['*M'] || '',
          Mty: article.Mty || 0,
          Obsr2: article.Obsr2 || '',
          '*A': article['*A'] || '',
          Alvisar: article.Alvisar || 0,
          Obsr3: article.Obsr3 || '',
        })
      })

      const data = xlsx.utils.json_to_sheet(listRefactor, {
        header,
        skipHeader: true,
        origin: 'A1',
      })

      wb.Sheets.Hoja = data
      wb.Sheets.Hoja['!cols'] = [
        { wpx: 90 },
        { wpx: 40 },
        { wpx: 70 },
        { wpx: 250 },
        { wpx: 60 },
        { wpx: 60 },
        { wpx: 90 },
        { wpx: 60 },
        { wpx: 90 },
        { wpx: 20 },
        { wpx: 200 },
        { wpx: 250 },
        { wpx: 30 },
        { wpx: 30 },
        { wpx: 30 },
      ]

      const fechaImpresion = utils.getDateNow().format('YYYY MMDD')
      const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'binary' })

      FileSaver.saveAs(
        new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
        fechaImpresion + ' -  Cotizacion .xlsx'
      )
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
