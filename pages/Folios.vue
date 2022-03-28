<template>
  <div>
    <div class="h2 my-3">Folios de facturas</div>
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
      :title="folio.Serie"
    >
      <div class="mt-3">
        <span class="font-weight-bold">Tienda:</span>
        {{ folio.Tienda }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Sucursal:</span>
        {{ folio.Serie }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folio Inicial:</span>
        {{ folio.FolioInicial }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folio Final:</span>
        {{ utils.aplyFormatNumeric(folio.FolioFinal) }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folios Disponibles:</span>
        {{ utils.aplyFormatNumeric(folio.FolioDisponible) }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Incremento Sujerido:</span>
        {{ utils.aplyFormatNumeric(folio.INCREMENTODEFOLIO) }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folio Final Sujerido:</span>
        {{ utils.aplyFormatNumeric(folio.FOLIOFINC) }}
        <Divider />
      </div>
      <div class="mt-3">
        <b-card-text class="font-weight-bold mb-1 mt-5">
          Actualizacion de Folio
        </b-card-text>
        <divider class="mb-2"></divider>
        <b-form inline class="mt-2 mb-2">
          <b-form-group label="Final" class="input-form-folio">
            <b-form-input
              id="input-final"
              v-model="formFolio.final"
              placeholder="Final"
              class="w-100"
              desc
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Actual" class="input-form-folio">
            <b-form-input
              id="input-actual"
              v-model="formFolio.actual"
              placeholder="Actual"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Disponibles" class="input-form-folio">
            <b-form-input
              id="input-disponible"
              v-model="formFolio.disponible"
              placeholder="Disponibles"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Incremento" class="input-form-folio">
            <b-form-input
              id="input-incremento"
              ref="incremento"
              v-model="formFolio.incremento"
              placeholder="Incremento"
              class="w-100"
              :class="backgroundInputTheme"
              @keydown="verifyData"
              @keyup="calculaFolioFinal"
              @keyup.enter="actualizaFolio"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Final Nuevo" class="input-form-folio">
            <b-form-input
              id="input-nuevo-final"
              v-model="formFolio.nuevoFinal"
              placeholder="Final Nuevo"
              class="w-100"
              :state="statusFinalNew"
              readonly
            ></b-form-input>
          </b-form-group>
        </b-form>
        <b-button variant="primary" class="mb-2">
          <b-icon icon="arrow-up-right-circle-fill" />
          Actualizar Folios
        </b-button>
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
      utils,
      options: [],
      formFolio: {
        final: 0,
        actual: 0,
        disponible: 0,
        incremento: 0,
        nuevoFinal: 0,
      },
      statusFinalNew: false,
    }
  },
  computed: {
    dataUser() {
      return this.$store.state.user.user
    },
    folio() {
      return this.$store.state.folios.folio.data[0]
    },
    suc() {
      return this.$store.state.folios.sucursal
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
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
    verifyData(evt) {
      if (
        evt.keyCode !== 190 &&
        evt.keyCode !== 13 &&
        evt.keyCode !== 8 &&
        evt.keyCode !== 37 &&
        evt.keyCode !== 39 &&
        evt.keyCode !== 110
      ) {
        if (isNaN(parseInt(evt.key))) evt.preventDefault()
      }
    },
    calculaFolioFinal() {
      this.statusFinalNew = true
    },
    actualizaFolio() {},
  },
}
</script>

<style scoped>
.input-form-folio {
  width: calc(20% - 5px);
  margin-bottom: 5px;
  margin-right: 5px;
}

@media screen and (max-width: 767px) {
  .input-form-folio {
    width: 100%;
    margin-right: 0px;
  }
}
</style>
