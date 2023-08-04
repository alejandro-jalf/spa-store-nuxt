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
        <b-button :variant="variantClean" @click="setView('EDITARPRIVILEGIOS')">
          <b-icon icon="arrow-down-up" />
          Cambiar Privilegios
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
            :class="backgroundInputTheme"
            @keyup.enter="$refs.inputClave.focus()"
            @keyup.esc="cleanForm"
            @focus="$refs.ipCajero.select()"
            @keyup="pressKeyCajero"
            @keypress="consumeKey"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="gpCla" label="Contraseña:" label-for="ipClave">
          <b-form-input
            id="ipClave"
            ref="inputClave"
            v-model="register.Clave"
            type="password"
            placeholder="Contraseña"
            autocomplete="new-password"
            name="ClaveParaCajero"
            :class="backgroundInputTheme"
            @keyup.enter="enterClave"
            @keyup.esc="cleanForm"
            @focus="$refs.inputClave.select()"
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
            @keyup.enter="validateDataWithCache"
            >{{ opt.text }}</b-form-radio
          >
        </b-form-group>
        <div>
          <b-button
            ref="btnSend"
            variant="primary"
            class="float-right"
            @click="validateDataWithCache"
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
    <b-modal
      id="modalAuth"
      title="Clave de Encargado"
      centered
      hide-footer
      header-bg-variant="info"
      header-text-variant="light"
      @shown="focusCajero"
    >
      <b-form-group id="gpCaj" label="Cajero:" label-for="ipCajeroA">
        <b-form-input
          id="ipCajeroA"
          ref="ipCajeroA"
          v-model="encargado.Cajero"
          type="text"
          name="NumeroDeCajeroA"
          autocomplete="off"
          autofocus
          placeholder="Numero de cajero"
          :class="backgroundInputTheme"
          @keyup.enter="$refs.inputClaveA.focus()"
          @focus="$refs.ipCajeroA.select()"
          @keyup="pressKeyEncargado"
          @keypress="consumeKey"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="gpCla" label="Contraseña:" label-for="ipClaveA">
        <b-form-input
          id="ipClaveA"
          ref="inputClaveA"
          v-model="encargado.Clave"
          type="password"
          placeholder="Contraseña"
          autocomplete="new-password"
          name="ClaveParaCajeroA"
          :class="backgroundInputTheme"
          @keyup.enter="validateAutorizacion"
          @focus="$refs.inputClaveA.select()"
        ></b-form-input>
      </b-form-group>
      <p class="text-danger">{{ encargado.Error }}</p>
    </b-modal>
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
      encargado: {
        Cajero: '',
        Clave: '',
        Error: '',
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
    this.$root.$on('bv::modal::hidden', (evt) => {
      if (evt.componentId === 'modalAuth') {
        this.encargado.Cajero = ''
        this.encargado.Clave = ''
      }
    })
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
      getAllClaves: 'claveasistencias/getAllClaves',
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
    pressKeyCajero(evt) {
      if (
        evt.keyCode !== 9 &&
        evt.keyCode !== 16 &&
        evt.keyCode !== 37 &&
        evt.keyCode !== 38 &&
        evt.keyCode !== 39 &&
        evt.keyCode !== 40 &&
        this.register.Cajero.trim().length >= 2
      )
        this.$refs.inputClave.focus()
    },
    pressKeyEncargado(evt) {
      if (
        evt.keyCode !== 9 &&
        evt.keyCode !== 16 &&
        evt.keyCode !== 37 &&
        evt.keyCode !== 38 &&
        evt.keyCode !== 39 &&
        evt.keyCode !== 40 &&
        this.encargado.Cajero.trim().length >= 2
      )
        this.$refs.inputClaveA.focus()
    },
    consumeKey(evt) {
      if ((evt.keyCode < 48 || evt.keyCode > 57) && evt.keyCode !== 13)
        evt.preventDefault()
    },
    focusCajero() {
      this.$refs.ipCajeroA.focus()
    },
    validateAutorizacion() {
      if (
        !this.$store.state.claveasistencias.sucClaves ||
        this.$store.state.claveasistencias.sucClaves !== this.sucursal ||
        this.$store.state.claveasistencias.claves.data.length === 0
      )
        this.getAllClaves(this.sucursal)
      else {
        const claves = this.$store.state.claveasistencias.claves.data
        const cajeroFind = claves.find(
          (cajero) => cajero.Cajero === this.encargado.Cajero.trim()
        )
        if (!cajeroFind)
          this.encargado.Error = `No se encontro clave del encargado ${this.encargado.Cajero}`
        else if (cajeroFind.Clave !== this.encargado.Clave.trim())
          this.encargado.Error = 'Contraseña incorrecta'
        else if (cajeroFind.Privilegios !== '00')
          this.encargado.Error = 'No tiene suficiente permisos'
        else {
          this.registerAsistencia()
          this.$bvModal.hide('modalAuth')
        }
      }
    },
    validateDataWithCache() {
      if (
        !this.$store.state.claveasistencias.sucClaves ||
        this.$store.state.claveasistencias.sucClaves !== this.sucursal ||
        this.$store.state.claveasistencias.claves.data.length === 0
      )
        this.registerAsistencia()
      else {
        const claves = this.$store.state.claveasistencias.claves.data
        const cajeroFind = claves.find(
          (cajero) => cajero.Cajero === this.register.Cajero.trim()
        )
        if (!cajeroFind) {
          this.showAlertDialog([
            `No se encontro clave para el cajero ${this.register.Cajero}`,
            'Cajero no encontrado',
          ])
          this.getAllClaves(this.sucursal)
        } else if (cajeroFind.Clave !== this.register.Clave.trim()) {
          this.showAlertDialog([`Contraseña incorrecta`, 'No autorizado'])
          this.getAllClaves(this.sucursal)
        } else if (cajeroFind.Privilegios !== '00') {
          this.$bvModal.show('modalAuth')
          this.encargado.Error = ''
          this.getAllClaves(this.sucursal)
        } else this.registerAsistencia()
      }
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
      this.getAllClaves(this.sucursal)
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
