<template>
  <div>
    <h2 class="my-3">Codificador de articulos</h2>
    <b-input-group
      v-if="dataUser.tipo_user === 'manager'"
      prepend="Sucursal"
      class="mb-3"
    >
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
    </b-input-group>

    <b-card
      class="containerCard p-1 pb-4 mt-5"
      :class="variantTheme"
      :title="article.Articulo"
      :sub-title="article.Nombre"
    >
      <div class="mt-3">
        <span class="font-weight-bold">Codigo de barras:</span>
        {{ article.CodigoBarras }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Descripcion:</span>
        {{ article.Descripcion }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Relacion:</span>
        {{ article.Relacion }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Existencia:</span>
        {{ article.ExistenciaActualRegular }}
        <Divider />
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import utils from '../modules/utils'
import Divider from '../components/Divider'

export default {
  components: {
    Divider,
  },
  data() {
    return {
      options: [],
      selected: null,
      utils,
    }
  },
  computed: {
    suc() {
      return this.$store.state.codificadorarticulos.sucursal
    },
    dataUser() {
      return this.$store.state.user.user
    },
    article() {
      return this.$store.state.codificadorarticulos.article.data[0]
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
  },
  mounted() {
    if (this.dataUser.tipo_user !== 'manager') {
      const sucursal = this.utils.getSucursalByName(this.dataUser.sucursal_user)
      this.setSucursal(sucursal)
    }
    this.setDataForCompany()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'codificadorarticulos/setSucursal',
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
  },
}
</script>
