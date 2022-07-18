<template>
  <div class="mt-3">
    <transition name="fade">
      <float-button
        v-if="showFloatButton"
        icon-float="arrow-up-circle"
        :click-float="upPage"
        variant-float="info"
      ></float-button>
    </transition>
    <h1 class="text-center mb-3">Validacion de ofertas</h1>
    <b-input-group prepend="Sucursal">
      <b-form-select
        :value="suc"
        :disabled="!accessChangeSucursal"
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
        variant="outline-info"
        @click="setActivateLimit('withLimit')"
      >
        Con limite de fecha
      </b-button>
      <b-button
        :pressed="!activatedLimit && !activatedAll"
        variant="outline-info"
        @click="setActivateLimit('withoutLimit')"
      >
        Sin limite de fecha
      </b-button>
      <b-button
        :pressed="activatedAll"
        variant="outline-info"
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
      v-if="width > 767"
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
    <div v-else>
      <ValidaOfertasCard
        v-for="(article, indexArticle) in dataRefactor"
        :key="indexArticle"
        :article="article"
        :show-details="showDetails"
        class="mb-2"
      />
    </div>
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
import ValidaOfertasCard from '../components/ValidaOfertasCard'
import utils from '../modules/utils'

export default {
  components: {
    ValidaOfertasDetails,
    ValidaOfertasCard,
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
        'UltimoCosto',
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
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
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
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    showFloatButton() {
      return this.$store.state.general.scrollScreenY >= 500
    },
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
    this.setSucursalForUser()

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
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
    upPage() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    },
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
