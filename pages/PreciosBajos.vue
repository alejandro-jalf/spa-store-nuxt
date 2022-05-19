<template>
  <div>
    <h1 class="text-center mt-2">Articulos con precios Bajos</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-form-input
          id="input-porcentaje"
          v-model="porcentaje"
          v-b-tooltip.hover
          title="% Minimo"
          value="10"
          placeholder="% Min."
          type="number"
          size="sm"
          class="h-100 w-25"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-button variant="info">Verificar</b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      porcentaje: 10,
    }
  },
  computed: {
    suc() {
      return this.$store.state.preciosbajos.sucursal
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
  },
  methods: {
    ...mapMutations({
      setSucursal: 'preciosbajos/setSucursal',
    }),
    selectSucursal(sucursal) {
      console.log(sucursal)
      this.setSucursal(sucursal)
    },
  },
}
</script>
