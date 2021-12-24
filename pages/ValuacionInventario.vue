<template>
  <div>
    <h1 class="text-center">Validacion de inventario</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-button variant="info" @click="validaInventario">Buscar</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-table
      responsive
      outlined
      hover
      :items="inventarioList"
      :fields="fields"
      :class="variantThemeTableBody"
    ></b-table>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      fields: [
        'Articulo',
        'Nombre',
        'Existencia',
        'UCosto',
        'Valuacion',
        'Ieps',
        'Iva',
        'ValuacionNeta',
        'Acciones',
      ],
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
        { value: 'BO%TRANSITO', text: 'SPABODEGA - TRANSITO' },
        { value: 'BO%ESPERANZA', text: 'SPABODEGA - LA ESPERANZA' },
      ],
    }
  },
  computed: {
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
    inventarioList() {
      const datos = []
      // eslint-disable-next-line no-console
      console.log(this.$store.state.valuacioninventario.data.data)
      this.$store.state.valuacioninventario.data.data.forEach((validacion) => {
        const data = { ...validacion }
        data.UltimoCosto = data.UCosto
        data.IepsValuacion = data.Ieps
        data.IvaValuacion = data.Iva
        datos.push(data)
      })
      return datos
    },
    suc() {
      return this.$store.state.valuacioninventario.sucursal
    },
  },
  mounted() {
    this.selected = this.$store.state.valuacioninventario.sucursal
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'valuacioninventario/setSucursal',
      setAlmacen: 'valuacioninventario/setAlmacen',
      setTienda: 'valuacioninventario/setTienda',
    }),
    ...mapActions({
      changeData: 'valuacioninventario/changeData',
    }),
    selectSucursal(sucursal) {
      if (sucursal === null) return false
      const sucArray = sucursal.split('%')
      this.setSucursal(sucArray[0])
      if (sucArray.length > 1) {
        this.selected = sucArray[0]
        if (sucArray[1] === 'TRANSITO') {
          this.setTienda(6)
          this.setAlmacen(15)
        } else {
          this.setTienda(6)
          this.setAlmacen(1)
        }
      } else if (sucursal === 'BO') {
        this.selected = sucursal
        this.setTienda(6)
        this.setAlmacen(21)
      } else if (sucursal === 'ZR') {
        this.selected = sucursal
        this.setTienda(1)
        this.setAlmacen(2)
      } else if (sucursal === 'VC') {
        this.selected = sucursal
        this.setTienda(2)
        this.setAlmacen(3)
      } else if (sucursal === 'OU') {
        this.selected = sucursal
        this.setTienda(5)
        this.setAlmacen(19)
      } else if (sucursal === 'JL') {
        this.selected = sucursal
        this.setTienda(4)
        this.setAlmacen(7)
      }
    },
    async validaInventario() {
      // eslint-disable-next-line no-console
      console.log(
        'Validacion de inventario',
        this.$store.state.valuacioninventario.sucursal,
        this.$store.state.valuacioninventario.tienda,
        this.$store.state.valuacioninventario.almacen
      )
      if (this.selected === null)
        this.showAlertDialog(['Falta seleccionar sucursal'])
      else {
        this.setLoading(true)
        const response = await this.changeData([
          this.$store.state.valuacioninventario.sucursal,
          this.$store.state.valuacioninventario.tienda,
          this.$store.state.valuacioninventario.almacen,
        ])
        this.setLoading(false)
        // eslint-disable-next-line no-console
        console.log(response)
        if (!response.success)
          this.showAlertDialog([response.message, 'Error inesperado'])
      }
    },
  },
}
</script>
