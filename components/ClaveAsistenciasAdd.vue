<template>
  <div class="py-3">
    <b-card
      class="w-75"
      :class="variantTheme"
      style="margin: auto"
      :title="title"
    >
      <b-input-group prepend="Sucursal" class="mb-2">
        <b-form-select
          :value="sucursal"
          :options="options"
          :class="backgroundInputTheme"
          :disabled="disabledSucursal"
          @change="selectSucursal"
        ></b-form-select>
      </b-input-group>
      <b-form-group id="gpCaj" label="Cajero:" label-for="ipCajero">
        <b-input-group>
          <b-form-input
            id="ipCajero"
            ref="ipCajero"
            v-model="register.Cajero"
            :disabled="disabledCajero"
            type="text"
            autocomplete="false"
            placeholder="Numero de cajero"
            required
            :class="backgroundInputTheme"
            @keyup.enter="enterCajero"
          ></b-form-input>
          <b-input-group-append v-if="editingClave">
            <b-button variant="info" @click="getDataTrabajador">
              Buscar
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-form-group id="gpCla" label="Contraseña:" label-for="ipClave">
        <b-form-input
          id="ipClave"
          ref="inputClave"
          v-model="register.Clave"
          type="password"
          placeholder="Contraseña"
          autocomplete="false"
          :disabled="disabledClave"
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
          :disabled="disabledRClave"
          required
          :class="backgroundInputTheme"
          @keyup.enter="$refs.btnSelect.focus()"
        ></b-form-input>
      </b-form-group>
      <div class="my-2">
        Trabajador:
        <b-button
          ref="btnSelect"
          v-b-modal.modalSelect
          variant="info"
          :disabled="editingClave"
        >
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
        v-if="!editingClave"
        ref="btnRegister"
        variant="primary"
        class="mt-3"
        @click="prepareAddClave"
      >
        <b-icon icon="clipboard-check" />
        Registrar
      </b-button>
      <b-button
        v-else
        ref="btnUpdated"
        variant="primary"
        class="mt-3"
        @click="prepareUpdateClave"
      >
        <b-icon icon="clipboard-check" />
        Actualizar
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
      disabledCajero: false,
      disabledSucursal: false,
      disabledClave: false,
      disabledRClave: false,
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
    title() {
      const view = this.$store.state.claveasistencias.view
      return view === 'AGREGAR'
        ? 'Registro de Clave'
        : view === 'EDITARCLAVE'
        ? 'Editando Contraseña'
        : 'Reasignando Trabajador'
    },
    editingClave() {
      return this.$store.state.claveasistencias.view === 'EDITARCLAVE'
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
    if (this.editingClave) {
      this.disabledClave = true
      this.disabledRClave = true
    }
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
      getClave: 'claveasistencias/getClave',
      updateClaveTrabajador: 'claveasistencias/updateClaveTrabajador',
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
    selectTrabajador(items) {
      this.trabajador = { ...items }
      this.$refs.modalSelect.hide()
    },
    enterCajero() {
      if (this.register.Cajero === '') return false
      if (this.editingClave) this.getDataTrabajador()
      else this.$refs.inputClave.focus()
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
    async getDataTrabajador() {
      this.setLoading(true)
      const response = await this.getClave([
        this.sucursal,
        this.register.Cajero.trim(),
      ])
      if (!response.success) this.showAlertDialog([response.message])
      else {
        this.disabledCajero = true
        this.disabledSucursal = true
        this.disabledClave = false
        this.disabledRClave = false
        this.register.Clave = response.data[0].Clave
        this.register.RepetirClave = response.data[0].Clave
        this.trabajador.IdTrabajador = response.data[0].IdTrabajador
        this.trabajador.Nombre = response.data[0].Nombre
        this.trabajador.Categoria = response.data[0].Categoria
        this.$refs.inputClave.focus()
      }
      this.setLoading(false)
    },
    async registerClave() {
      this.setLoading(true)
      const response = await this.addClave([
        this.sucursal,
        this.register.Clave.trim(),
        this.register.Cajero.trim(),
        this.trabajador.IdTrabajador,
      ])
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
    prepareUpdateClave() {
      if (this.validateForm()) {
        this.showAlertDialogOption([
          '¿Quiere actualizar la contraseña de ' + this.trabajador.Nombre,
          'Actualizando contraseña',
          () => {
            this.hideAlertDialogOption()
            this.updateClave()
          },
          'warning',
          'light',
          this.hideAlertDialogOption,
        ])
      }
    },
    async updateClave() {
      this.setLoading(true)
      const response = await this.updateClaveTrabajador([
        this.sucursal,
        this.register.Cajero.trim(),
        this.register.Clave.trim(),
      ])
      if (!response.success) this.showAlertDialog([response.message])
      else this.showAlertDialog([response.message, 'Exito', 'success'])
      this.setLoading(false)
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
