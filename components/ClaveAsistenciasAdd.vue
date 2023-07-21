<template>
  <div class="py-3">
    <b-card
      class="w-75"
      :class="variantTheme"
      style="margin: auto"
      title="Registro de Clave"
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
        <b-button ref="btnSelect" v-b-modal.modalSelect variant="info">
          <b-icon icon="search" />
          Seleccionar
        </b-button>
      </div>
      <b-form inline>
        <b-form-input
          id="inputID"
          v-model="trabajador.IdTrabajador"
          placeholder="IdTrabajador"
          class="name-complete"
          disabled
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-form-input
          id="inputCat"
          v-model="trabajador.Categoria"
          placeholder="Sucursal"
          disabled
          class="name-complete"
          :class="backgroundInputTheme"
        ></b-form-input>
      </b-form>
      <b-form-input
        id="inputAm"
        v-model="trabajador.Nombre"
        placeholder="Nombre Completo"
        disabled
        :class="backgroundInputTheme"
      ></b-form-input>
      <b-button
        ref="btnRegister"
        variant="primary"
        class="mt-3"
        @click="prepareAddClave"
      >
        <b-icon icon="clipboard-check" />
        Registrar
      </b-button>
    </b-card>
    <b-modal
      id="modalSelect"
      ref="modalSelect"
      :title="titleSelect"
      hide-footer
      size="xl"
    >
      <b-button variant="primary" @click="getTrabajadores">
        <b-icon icon="search" />
        Buscar
      </b-button>
      <divider class="my-3" />
      <b-table
        hover
        small
        head-variant="dark"
        sticky-header="500px"
        outlined
        responsive
        sort-by="Nombre"
        sort-direction="asc"
        :fields="fields"
        :items="dataTrabajadores"
        :class="variantThemeTableBody"
        class="mt-0"
      >
        <template #cell(FechaDeIngreso)="row">
          {{ utils.toDate(row.item.FechaDeIngreso) }}
        </template>
        <template #cell(Seleccionar)="row">
          <b-button
            variant="success"
            size="sm"
            @click="selectTrabajador(row.item)"
          >
            <b-icon icon="check-circle-fill" />
            Elejir
          </b-button>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      sucursal: 'ZR',
      register: {
        Cajero: '',
        Clave: '',
        RepetirClave: '',
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
      fields: [
        { key: 'Categoria', label: 'Sucursal', sortable: true },
        { key: 'FechaDeIngreso', label: 'Ingreso', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Direccion', label: 'Direccion', sortable: true },
        { key: 'Seleccionar', label: 'Seleccionar', sortable: true },
      ],
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
    titleSelect() {
      return (
        'Trabajadores de Sucursal: ' +
        this.$store.state.claveasistencias.sucConsult
      )
    },
    dataTrabajadores() {
      const datos = []
      this.$store.state.claveasistencias.data.data.forEach((trabajador) => {
        const item = { ...trabajador }
        datos.push(item)
      })
      return datos
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
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      changeData: 'claveasistencias/changeData',
      addClave: 'claveasistencias/addClave',
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
    selectTrabajador(items) {
      this.trabajador = { ...items }
      this.$refs.modalSelect.hide()
    },
    async getTrabajadores() {
      this.setLoading(true)
      const response = await this.changeData(this.sucursal)
      if (!response.success) this.showAlertDialog([response.message])
      this.setLoading(false)
    },
    prepareAddClave() {
      if (this.validateForm()) {
        const message =
          'Datos para la clave <br/> Nombre: ' +
          this.trabajador.Nombre +
          '<br/>IdTrabajador: ' +
          this.trabajador.IdTrabajador +
          '<br/>Cajero: ' +
          this.register.Cajero +
          '<br/>¿Los datos son correctos y corresponde al trabajador?'
        this.showAlertDialogOption([
          message,
          'Registrando clave',
          () => {
            this.hideAlertDialogOption()
            this.registerClave()
          },
          'warning',
          'light',
          this.hideAlertDialogOption,
        ])
      }
    },
    async registerClave() {
      this.setLoading(true)
      const response = await this.addClave([
        this.sucursal,
        this.register.Clave.trim(),
        this.register.Cajero.trim(),
        this.trabajador.IdTrabajador,
      ])
      console.log(response)
      if (!response.success) this.showAlertDialog([response.message])
      else this.showAlertDialog([response.message, 'Exito', 'success'])
      this.setLoading(false)
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
      if (this.register.RepetirClave.trim() === '') {
        this.showAlertDialog(['Repita su contraseña'])
        return false
      }
      if (this.register.Clave !== this.register.RepetirClave) {
        this.showAlertDialog(['Las contraseñas no coinciden'])
        return false
      }
      if (this.trabajador.IdTrabajador === '') {
        this.showAlertDialog(['Falta selecionar trabajador'])
        return false
      }
      return true
    },
  },
}
</script>

<style scoped>
#inputID {
  width: 60%;
  margin-bottom: 10px;
}
#inputCat {
  width: 39%;
  margin-left: 1%;
  margin-bottom: 10px;
}

@media screen and (max-width: 575px) {
  #inputID,
  #inputCat {
    width: 100%;
    margin-left: 0px;
  }
}
</style>
