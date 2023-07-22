<template>
  <div>
    <h5 class="text-center my-3">Claves de Asistencias</h5>
    <div v-if="viewRegister">
      <div v-if="accessChangeSucursal" class="mb-3">
        <b-button :variant="variantSuccess" @click="setView('AGREGAR')">
          <b-icon icon="plus-square-dotted" />
          Agregar Clave
        </b-button>
        <b-button :variant="variantClean" @click="setView('EDITARCLAVE')">
          <b-icon icon="shield-lock-fill" />
          Editar Contraseña
        </b-button>
        <b-button :variant="variantInfo" @click="setView('EDITARTRABAJADOR')">
          <b-icon icon="person-badge-fill" />
          Reasignar Trabajador
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
            :disabled="!accessChangeSucursal"
            @change="selectSucursal"
          ></b-form-select>
        </b-input-group>
        <b-form-group id="gpCaj" label="Cajero:" label-for="ipCajero">
          <b-form-input
            id="ipCajero"
            ref="ipCajero"
            v-model="register.Cajero"
            type="text"
            name="NumeroDeCajero"
            autocomplete="off"
            autofocus
            placeholder="Numero de cajero"
            required
            :class="backgroundInputTheme"
            @keyup.enter="$refs.inputClave.focus()"
            @keyup.esc="cleanForm"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="gpCla" label="Contraseña:" label-for="ipClave">
          <b-form-input
            id="ipClave"
            ref="inputClave"
            v-model="register.Clave"
            type="password"
            placeholder="Contraseña"
            autocomplete="off"
            name="ClaveParaCajero"
            required
            :class="backgroundInputTheme"
            @keyup.enter="enterClave"
            @keyup.esc="cleanForm"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Seleccione Tipo">
          <b-form-radio
            v-for="(opt, indexOpt) in optionsRadious"
            :id="opt.ref"
            :key="indexOpt"
            :ref="opt.ref"
            v-model="register.estatus"
            name="some-radios"
            :value="opt.value"
            @keyup.enter="registerAsistencia"
            >{{ opt.text }}</b-form-radio
          >
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
        { text: 'ENTRADA DIA', value: 'ENTRADA DIA', ref: 'EstatusED' },
        { text: 'SALIDA COMIDA', value: 'SALIDA COMIDA', ref: 'EstatusSC' },
        { text: 'ENTRADA COMIDA', value: 'ENTRADA COMIDA', ref: 'EstatusEC' },
        { text: 'SALIDA DIA', value: 'SALIDA DIA', ref: 'EstatusSD' },
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
      this.sucursal = suc
      this.setSucursal(suc)
    },
    enterClave() {
      document.getElementById('EstatusED').focus()
      this.register.estatus = 'ENTRADA DIA'
    },
    cleanForm() {
      this.register.Cajero = ''
      this.register.Clave = ''
      this.register.estatus = 'ENTRADA DIA'
      this.$refs.ipCajero.focus()
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
        if (!response.success) {
          this.showAlertDialog([response.message])
          this.$refs.ipCajero.focus()
        } else {
          this.showAlertDialog([response.message, 'Exito', 'success'])
          this.register.Cajero = ''
          this.register.Clave = ''
          this.register.estatus = 'ENTRADA DIA'
          this.$refs.ipCajero.focus()
        }
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
