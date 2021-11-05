<template>
  <div class="mt-3">
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
    <b-form-checkbox
      v-model="onliValid"
      name="only_valid"
      switch
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
    ></b-table>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      fields: [
        'Suc',
        'Articulo',
        'CodigoBarras',
        'Nombre',
        'UtilidadOferta',
        'OfertaValida',
        'Descuento',
        'UltimoCostoNeto',
        'Precio1IVAUV',
        'UtilidadVenta',
        'Precio1Valido',
        'PrecioOferta',
        'FechaInicial',
        'FechaFinal',
        'OfertaCaduca',
      ],
      utils,
      onliValid: true,
      selected: 'ZR',
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
    }
  },
  computed: {
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
        if (onlyValid) {
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
    selectSucursal(sucursal) {
      this.selected = sucursal
      this.setSucursal(sucursal)
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
