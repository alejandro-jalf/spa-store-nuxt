<template>
  <div>
    <b-card
      class="w-75"
      :class="variantTheme"
      style="margin: auto"
      title="Registor de Clave"
    >
      <b-input-group prepend="Sucursal" class="mb-2">
        <b-form-select
          :value="sucursal"
          :options="options"
          :class="backgroundInputTheme"
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
          @keyup.enter="$refs.inputClaveR.focus()"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="gpCla" label="Repetir Contraseña:" label-for="ipClave">
        <b-form-input
          id="ipClaveR"
          ref="inputClaveR"
          v-model="register.RepetirClave"
          type="password"
          placeholder="Repetir Contraseña"
          autocomplete="false"
          required
          :class="backgroundInputTheme"
          @keyup.enter="$refs.btnSelect.focus()"
        ></b-form-input>
      </b-form-group>
      <div class="my-2">
        Trabajador:
        <b-button ref="btnSelect" v-b-modal.modal-xl variant="info">
          <b-icon icon="search" />
          Seleccionar
        </b-button>
      </div>
      <b-form inline>
        <b-form-input
          id="inputName"
          v-model="trabajador.IdTrabajador"
          placeholder="IdTrabajador"
          class="name-complete"
          disabled
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-form-input
          id="inputAp"
          ref="inputAp"
          v-model="trabajador.Categoria"
          placeholder="Sucursal"
          disabled
          class="name-complete"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-form-input
          id="inputAm"
          ref="inputAm"
          v-model="trabajador.Nombre"
          placeholder="Nombre Completo"
          class="name-complete"
          disabled
          :class="backgroundInputTheme"
        ></b-form-input>
      </b-form>
      <b-button ref="btnRegister" variant="primary" class="mt-3">
        Registrar
      </b-button>
    </b-card>
    <b-modal id="modal-xl" size="xl" title="Extra Large Modal"></b-modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      sucursal: 'ZR',
      register: {
        Cajero: '',
        Clave: '',
        RepetirClave: '',
        estatus: 'ENTRADA DIA',
      },
      trabajador: {
        IdTrabajador: '',
        Categoria: '',
        Nombre: '',
      },
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
  },
  mounted() {
    this.setSucursalForUser()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'claveasistencias/setSucursal',
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
  },
}
</script>

<style scoped>
.name-complete {
  width: 32%;
  margin-left: 1%;
}

@media screen and (max-width: 575px) {
  .name-complete {
    width: 100%;
    margin-left: 0px;
    margin-bottom: 10px;
  }
}
</style>
