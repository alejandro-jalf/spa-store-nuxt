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
        id="tableInventarioValuacion"
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
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      perPage: 15,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      company: 'SPA',
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
      return this.$store.state.validaofertas.sucursal
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
  },
  mounted() {
    this.setDataForCompany()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'stocks/setSucursal',
      setData: 'stocks/setData',
    }),
    ...mapActions({
      changeData: 'stocks/changeData',
    }),
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
          { value: 'OU', text: 'Oluta' },
          { value: 'JL', text: 'Jaltipan' },
          { value: 'BO', text: 'Bodega' },
        ]
      } else {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'SU', text: 'Super' },
          { value: 'MA', text: 'Mayoreo' },
          { value: 'RE', text: 'Reparto' },
          { value: 'EN', text: 'Enriquez' },
          { value: 'SA', text: 'Sayula' },
          { value: 'SB', text: 'Sayula Bodega' },
        ]
      }
      const sucFinded = this.options.find((suc) => suc.value === this.selected)
      if (!sucFinded) this.selected = null
    },
    async calculateStocks() {
      // eslint-disable-next-line no-console
      console.log('Ejecuta')
      if (this.selected === null)
        this.showAlertDialog(['Falta seleccionar sucursal'])
      else {
        this.setLoading(true)
        const sucursal = this.$store.state.stocks.sucursal
        const response = await this.changeData([sucursal, this.company])
        this.setLoading(false)
        if (!response.success)
          this.showAlertDialog([response.message, 'Error inesperado'])
        // else {
        //   this.setSucursalData(sucursal)
        //   this.setHoraConsulta(
        //     utils.getDateNow().format('DD/MM/YYYY hh:mm:ss a')
        //   )
        // }
      }
    },
  },
}
</script>
