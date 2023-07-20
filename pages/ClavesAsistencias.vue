<template>
  <div>
    <h5 class="text-center my-3">Claves de Asistencias</h5>
    <div v-if="viewRegister">
      <div class="mb-3">
        <b-button :variant="variantSuccess" @click="setView('AGREGAR')">
          <b-icon icon="plus-square-dotted" />
          Agregar Clave
        </b-button>
        <b-button :variant="variantClean">
          <b-icon icon="pencil" />
          Editar Clave
        </b-button>
      </div>
      <b-card
        class="w-75"
        :class="variantTheme"
        style="margin: auto"
        title="Asistencia"
      >
        <b-input-group prepend="Sucursal" class="mb-2">
          <b-form-select
            :value="sucursal"
            :options="options"
            :disabled="accessChangeSucursal"
            @change="selectSucursal"
          ></b-form-select>
        </b-input-group>
        <b-form-group id="gpCaj" label="Cajero:" label-for="ipCajero">
          <b-form-input
            id="ipCajero"
            ref="ipCajero"
            v-model="register.Cajero"
            type="text"
            autocomplete="false"
            placeholder="Numero de cajero"
            required
            :class="backgroundInputTheme"
            @keyup.enter="$refs.inputClave.focus()"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="gpCla" label="Contraseña:" label-for="ipClave">
          <b-form-input
            id="ipClave"
            ref="inputClave"
            v-model="register.Clave"
            type="password"
            placeholder="Contraseña"
            autocomplete="false"
            required
            :class="backgroundInputTheme"
            @keyup.enter="setFocusRadios"
          ></b-form-input>
        </b-form-group>
        <b-form-group v-slot="{ ariaDescribedby }" label="Seleccione Tipo">
          <b-form-radio-group
            id="radiosEstatus"
            v-model="register.estatus"
            :options="optionsRadious"
            :aria-describedby="ariaDescribedby"
            name="radios-stacked"
            stacked
          ></b-form-radio-group>
        </b-form-group>
        <div>
          <b-button
            ref="btnSend"
            variant="primary"
            class="float-right"
            @click="registerAsistencia"
          >
            Aceptar
          </b-button>
        </div>
      </b-card>
    </div>
    <div v-else>
      <b-button :variant="variantInfo" @click="setView('REGISTRO')">
        <b-icon icon="arrow-return-left" />
        Regresar
      </b-button>
      <ClaveAsistenciasAddVue />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import ClaveAsistenciasAddVue from '../components/ClaveAsistenciasAdd'

export default {
  components: {
    ClaveAsistenciasAddVue,
  },
  data() {
    return {
      sucursal: 'ZR',
      register: {
        Cajero: '',
        Clave: '',
        estatus: 'ENTRADA DIA',
      },
      optionsRadious: [
        { text: 'ENTRADA DIA', value: 'ENTRADA DIA' },
        { text: 'SALIDA COMIDA', value: 'SALIDA COMIDA' },
        { text: 'ENTRADA COMIDA', value: 'ENTRADA COMIDA' },
        { text: 'SALIDA DIA', value: 'SALIDA DIA' },
      ],
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
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
    viewRegister() {
      return this.$store.state.claveasistencias.view === 'REGISTRO'
    },
  },
  mounted() {
    this.setSucursalForUser()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'claveasistencias/setSucursal',
      setView: 'claveasistencias/setView',
    }),
    ...mapActions({
      registerA: 'claveasistencias/registerA',
    }),
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        this.sucursal = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(this.sucursal)
      } else {
        const sucSelected = this.$store.state.claveasistencias.sucursal
        this.sucursal = sucSelected
      }
    },
    selectSucursal(suc) {
      console.log(suc)
      this.sucursal = suc
      this.setSucursal(suc)
    },
    async registerAsistencia() {
      if (this.validateForm()) {
        this.setLoading(true)
        const response = await this.registerA([
          this.sucursal,
          this.register.Cajero.trim(),
          this.register.Clave.trim(),
          this.register.estatus,
        ])
        if (!response.success) this.showAlertDialog([response.message])
        else this.showAlertDialog([response.message, 'Exito', 'success'])
        this.register.Cajero = ''
        this.register.Clave = ''
        this.register.estatus = 'ENTRADA DIA'
        this.$refs.ipCajero.focus()
        this.setLoading(false)
      }
    },
    validateForm() {
      if (this.register.Cajero.trim() === '') {
        this.showAlertDialog(['Falta llenar cajero'])
        return false
      }
      if (this.register.Clave.trim() === '') {
        this.showAlertDialog(['Falta llenar contraseña'])
        return false
      }
      return true
    },
  },
}
</script>

<style scoped></style>
