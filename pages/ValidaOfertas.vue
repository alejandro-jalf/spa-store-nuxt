<template>
  <div class="mt-3">
    <h1 class="text-center mb-3">Validacion de ofertas</h1>
    <b-input-group prepend="Sucursal">
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <template #append>
        <b-button variant="success" @click="getValidation"> Validar </b-button>
      </template>
    </b-input-group>

    <b-button-group class="mt-3">
      <b-button
        :pressed="activatedLimit"
        variant="outline-primary"
        @click="setActivateLimit('withLimit')"
      >
        Con limite de fecha
      </b-button>
      <b-button
        :pressed="!activatedLimit && !activatedAll"
        variant="outline-primary"
        @click="setActivateLimit('withoutLimit')"
      >
        Sin limite de fecha
      </b-button>
      <b-button
        :pressed="activatedAll"
        variant="outline-primary"
        @click="setActivateLimit('all')"
      >
        Todas
      </b-button>
    </b-button-group>

    <b-form-checkbox
      v-model="onliValid"
      name="only_valid"
      switch
      class="mt-2 mb-3"
      @change="changeValid"
    >
      Mostrar solo no validos
    </b-form-checkbox>

    <b-table
      id="tableValidaOfertas"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="mt-3"
      :class="variantThemeTableBody"
    >
      <template #cell(Precio1)="row">
        {{ row.item.Precio1IVAUV }}
      </template>
      <template #cell(PrecioValido)="row">
        {{ row.item.Precio1Valido }}
      </template>
      <template #cell(Acciones)="row">
        <b-button variant="info" @click="showDetails(row.item)">
          Detalles
        </b-button>
      </template>
    </b-table>
    <ValidaOfertasDetails
      v-if="viewDetails"
      :article-actual="articleActual"
      :close-details="closeDetails"
    />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ValidaOfertasDetails from '../components/ValidaOfertasDetails'
import utils from '../modules/utils'

export default {
  components: {
    ValidaOfertasDetails,
  },
  data() {
    return {
      fields: [
        'Suc',
        'Articulo',
        'Nombre',
        'PrecioOferta',
        'UtilidadOferta',
        'OfertaValida',
        'Descuento',
        'UltimoCostoNeto',
        'Precio1',
        'UtilidadVenta',
        'PrecioValido',
        'Acciones',
      ],
      utils,
      onliValid: true,
      statusLimit: 'all',
      selected: 'ZR',
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      articleActual: {
        Suc: 'ZR',
        UtilidadVenta: '15%',
      },
      viewDetails: false,
    }
  },
  computed: {
    activatedLimit() {
      return this.statusLimit === 'withLimit'
    },
    activatedAll() {
      return this.statusLimit === 'all'
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    suc() {
      return this.$store.state.validaofertas.sucursal
    },
    dataRefactor() {
      const datos = []
      this.$store.state.validaofertas.data.data.forEach((oferta) => {
        const onlyValid = this.$store.state.validaofertas.onlyValid
        const statusLimit = this.statusLimit
        const data = { ...oferta }
        data.UtilidadOferta =
          utils.parseToPorcent(utils.roundTo(data.UtilidadOferta, 4, true)) +
          ' %'
        data.Descuento = utils.roundTo(data.Descuento)
        data.UltimoCostoNeto = utils.roundTo(data.UltimoCostoNeto)
        data.Precio1IVAUV = utils.roundTo(data.Precio1IVAUV)
        data.UtilidadVenta =
          utils.parseToPorcent(utils.roundTo(data.UtilidadVenta, 4, true)) +
          ' %'
        data.PrecioOferta = utils.roundTo(data.PrecioOferta)
        data.FechaInicial = utils.toDate(data.FechaInicial)
        data.FechaFinal = utils.toDate(data.FechaFinal)
        if (data.OfertaValida === 'NO') data._rowVariant = 'danger'
        if (statusLimit === 'withLimit') {
          if (onlyValid) {
            if (data.OfertaCaduca === 'SI' && data.OfertaValida === 'NO')
              datos.push(data)
          } else if (data.OfertaCaduca === 'SI') datos.push(data)
        } else if (statusLimit === 'withoutLimit') {
          if (onlyValid) {
            if (data.OfertaCaduca === 'NO' && data.OfertaValida === 'NO')
              datos.push(data)
          } else if (data.OfertaCaduca === 'NO') datos.push(data)
        } else if (onlyValid) {
          if (data.OfertaValida === 'NO') datos.push(data)
        } else datos.push(data)
      })
      return datos
    },
  },
  mounted() {
    const tableValidaOfertas = document.getElementById('tableValidaOfertas')

    this.loadOnlyValid()

    if (tableValidaOfertas) {
      tableValidaOfertas.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableValidaOfertas.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'validaofertas/setSucursal',
      setOnlyValid: 'validaofertas/setOnlyValid',
    }),
    ...mapActions({
      changeData: 'validaofertas/changeData',
    }),
    setActivateLimit(statusNew) {
      this.statusLimit = statusNew
    },
    selectSucursal(sucursal) {
      this.selected = sucursal
      this.setSucursal(sucursal)
    },
    showDetails(article) {
      this.viewDetails = true
      this.articleActual = article
    },
    closeDetails() {
      this.articleActual = {}
      this.viewDetails = false
    },
    loadOnlyValid() {
      const valid = this.$store.state.validaofertas.onlyValid
      this.onliValid = valid
    },
    changeValid(valid) {
      // eslint-disable-next-line no-console
      console.log(valid)
      this.setOnlyValid(valid)
    },
    async getValidation() {
      this.setLoading(true)
      const response = await this.changeData([
        this.$store.state.validaofertas.sucursal,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.footerConexiones {
  background: rgba(196, 167, 167, 0.411);
  width: 100%;
  padding: 10px;
  padding-right: 10px;
  margin-bottom: 30px;
}
</style>
