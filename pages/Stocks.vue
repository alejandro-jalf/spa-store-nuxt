<template>
  <div>
    <h1 class="text-center mb-3 mt-3">Actualizacion de stocks</h1>

    <b-input-group prepend="Sucursal" class="mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <template #append>
        <b-button variant="success" @click="calculateStocks">
          Calcular
        </b-button>
      </template>
    </b-input-group>

    <b-alert v-if="rows <= 0" :variant="variantAlert" show>
      No hay datos para mostrar
    </b-alert>

    <div v-else>
      <b-button
        :variant="variantSuccess"
        class="mb-3"
        @click="prepareUpdateStocks"
      >
        <b-icon icon="arrow-counterclockwise" />
        Actualizar Stocks
        <b-badge variant="light">{{ countArticles }}</b-badge>
      </b-button>
      <b-button :variant="variantWarning" class="mb-3" @click="cleanData">
        <b-icon icon="file-earmark" />
        Limpiar datos
      </b-button>

      <b-container fluid="xl">
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
        id="tableActualizaStocks"
        responsive
        outlined
        hover
        head-variant="dark"
        :per-page="perPage"
        :current-page="currentPage"
        :items="listArticulos"
        :fields="fields"
        :class="variantThemeTableBody"
        foot-clone
      >
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      options: [],
      perPage: 15,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      company: 'SPA',
      selected: null,
      fields: [
        'Sucursal',
        'Articulo',
        'CodigoBarras',
        'Nombre',
        'MesAnt3',
        'MesAnt2',
        'MesAnt1',
        'Promedio',
        'StockMin',
        'StockMax',
      ],
    }
  },
  computed: {
    suc() {
      return this.$store.state.stocks.sucursal
    },
    rows() {
      return this.$store.state.stocks.data.data.length
    },
    variantAlert() {
      return this.$store.state.general.themesComponents.themeVariantAlert
    },
    dataUser() {
      return this.$store.state.user.user
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantWarning() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantThemeTableBody() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeTableBody'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeTableBody'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeItemList'
      else return ''
    },
    countArticles() {
      return this.$store.state.stocks.data.data.length
    },
    listArticulos() {
      const data = []
      this.$store.state.stocks.data.data.forEach((article, indexA) => {
        const dataArticle = { ...article }

        dataArticle.CodigoBarras = dataArticle.CodigoBarrAS
        dataArticle.MesAnt1 = utils.aplyFormatNumeric(
          utils.roundTo(dataArticle.MesAnt1)
        )
        dataArticle.MesAnt2 = utils.aplyFormatNumeric(
          utils.roundTo(dataArticle.MesAnt2)
        )
        dataArticle.MesAnt3 = utils.aplyFormatNumeric(
          utils.roundTo(dataArticle.MesAnt3)
        )
        dataArticle.Promedio = utils.aplyFormatNumeric(
          utils.roundTo(dataArticle.Promedio)
        )

        data.push(dataArticle)
      })
      return data
    },
    sucursalData() {
      return this.$store.state.stocks.data.data[0].Sucursal
    },
    updates() {
      let updates = ''
      this.$store.state.stocks.data.data.forEach((article) => {
        updates += article.SQL_QUERY + '; '
      })
      return updates
    },
  },
  mounted() {
    const tableActualizaStocks = document.getElementById('tableActualizaStocks')
    const sucSel = this.$store.state.stocks.sucursal
    this.selected = sucSel
    this.setDataForCompany()

    if (tableActualizaStocks) {
      tableActualizaStocks.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableActualizaStocks.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'stocks/setSucursal',
      setData: 'stocks/setData',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      changeData: 'stocks/changeData',
    }),
    cleanData() {
      this.setData({ data: [] })
    },
    selectSucursal(sucursal) {
      this.selected = sucursal
      this.setSucursal(sucursal)
    },
    setDataForCompany() {
      const sucSplited = this.dataUser.sucursal_user.split(' ')
      this.company =
        sucSplited[0].trim().toUpperCase() === 'CAASA' ? 'CAASA' : 'SPA'
      if (this.company === 'SPA') {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'ZR', text: 'Zaragoza' },
          { value: 'VC', text: 'Victoria' },
          { value: 'ER', text: 'Enriquez' },
          { value: 'OU', text: 'Oluta' },
          { value: 'OU', text: 'Oluta' },
          { value: 'SY', text: 'Sayula' },
          { value: 'BO', text: 'Bodega' },
        ]
      } else {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'SU', text: 'Super' },
          { value: 'MA', text: 'Mayoreo' },
          { value: 'RE', text: 'Reparto' },
          { value: 'SB', text: 'Sayula Bodega' },
        ]
      }
      const sucFinded = this.options.find((suc) => suc.value === this.selected)
      if (!sucFinded) this.selected = null
    },
    async calculateStocks() {
      const sucursal = this.$store.state.stocks.sucursal
      if (sucursal === null)
        this.showAlertDialog(['Falta seleccionar sucursal'])
      else {
        this.setLoading(true)
        const response = await this.changeData([sucursal, this.company])
        this.setLoading(false)
        if (!response.success)
          this.showAlertDialog([response.message, 'Error inesperado'])
      }
    },
    prepareUpdateStocks() {
      this.showAlertDialogOption([
        `¿Quiere actualizar los stocks de los ${this.countArticles} articulos encontrados?`,
        'Actualizando stocks',
        () => {
          this.hideAlertDialogOption()
          this.updateStocks()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async updateStocks() {
      try {
        this.setLoading(true)
        const url =
          process.env.spastore_url_backend +
          'api/v1/articulos/stocks?sucursal=' +
          this.sucursalData +
          '&company=' +
          this.company
        const response = await this.$axios({
          url,
          method: 'put',
          data: { updates: this.updates },
        })
        this.setLoading(false)

        if (response.data.success) {
          const message =
            'Se ha actualizado el stock de un total de ' +
            response.data.data[1] +
            ' articulos'
          this.showAlertDialog([message, 'Exito', 'success'])
        } else this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(true)
        if (error.response) this.showAlertDialog([error.response.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
  },
}
</script>
