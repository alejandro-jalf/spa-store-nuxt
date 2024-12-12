<template>
  <div>
    <h2 class="text-center my-4">Sucursales</h2>
    <b-card title="Agregando Sucursal" class="text-dark">
      <b-form inline class="mt-1">
        <span id="spanCodigo" class="input-sel">
          <div class="label">Codigo</div>
          <b-form-input
            ref="inputCodigo"
            v-model="Codigo"
            class="w-100 cajaCodigo"
            placeholder="Codigo"
            maxlength="2"
            :disabled="editing"
            @focus="$refs.inputCodigo.select()"
            @keyup.enter="$refs.inputDescripcion.focus()"
            @keyup.esc="clean"
          />
          <div class="description">2 Caracteres</div>
        </span>
        <span class="input-sel">
          <div class="label">Descripcion</div>
          <b-form-input
            ref="inputDescripcion"
            v-model="Descripcion"
            class="w-100 caja"
            placeholder="Nombre de la sucursal"
            @focus="$refs.inputDescripcion.select()"
            @keyup.enter="$refs.inputEstado.focus()"
            @keyup.esc="clean"
          />
          <div class="description">50 Caracteres Maximo</div>
        </span>
        <span class="input-sel">
          <div class="label">Estado</div>
          <b-form-input
            ref="inputEstado"
            v-model="Estado"
            class="w-100"
            @focus="$refs.inputEstado.select()"
            @keyup.enter="$refs.inputCiudad.focus()"
            @keyup.esc="clean"
          />
          <div class="description">*</div>
        </span>
        <span class="input-sel">
          <div class="label">Ciudad</div>
          <b-form-input
            ref="inputCiudad"
            v-model="Ciudad"
            class="w-100"
            @focus="$refs.inputCiudad.select()"
            @keyup.enter="$refs.inputCalle.focus()"
            @keyup.esc="clean"
          />
        </span>
        <span id="spanCalle" class="input-sel">
          <div class="label">Calle</div>
          <b-form-input
            ref="inputCalle"
            v-model="Calle"
            class="w-100 Calle"
            @focus="$refs.inputCalle.select()"
            @keyup.enter="$refs.inputNumero.focus()"
            @keyup.esc="clean"
          />
        </span>
        <span id="spanNumero" class="input-sel">
          <div class="label">Numero</div>
          <b-form-input
            ref="inputNumero"
            v-model="Numero"
            class="w-100"
            placeholder="#"
            @focus="$refs.inputNumero.select()"
            @keyup.enter="$refs.inputCP.focus()"
            @keyup.esc="clean"
          />
        </span>
        <span id="spanCP" class="input-sel">
          <div class="label">CP</div>
          <b-form-input
            ref="inputCP"
            v-model="CP"
            class="w-100"
            placeholder="00000"
            maxlength="6"
            @focus="$refs.inputCP.select()"
            @keyup.enter="$refs.btnAgregar.focus()"
            @keyup.esc="clean"
          />
        </span>
      </b-form>
      <div class="footer-card-add">
        <b-button
          ref="btnAgregar"
          variant="success"
          type="button"
          class="float-right"
          @keyup.esc="clean"
          @click="decideSave"
        >
          <b-icon icon="plus-lg" />
          {{ textBtnSave }}
        </b-button>
        <b-button
          ref="btnCancelar"
          variant="warning"
          type="button"
          class="float-right mr-3"
          @keyup.esc="clean"
          @keyup.enter="clean"
          @click="clean"
        >
          <b-icon icon="x-lg" />
          Cancelar (ESC)
        </b-button>
      </div>
    </b-card>
    <b-card class="mt-3" body-text-variant="dark">
      <b-button
        ref="btnRefrescar"
        variant="info"
        type="button"
        @click="loadData"
      >
        <b-icon icon="arrow-clockwise" />
        Refrescar
      </b-button>
      <b-table
        hover
        head-variant="dark"
        outlined
        responsive
        :items="sucursales"
        :fields="fields"
        class="mt-3"
      >
        <template #cell(Direccion)="row">
          {{ address(row.item) }}
        </template>
        <template #cell(Acciones)="row">
          <b-button
            variant="warning"
            size="sm"
            class="mb-1"
            @click="editItems(row.item)"
          >
            <b-icon icon="pencil" />
          </b-button>
          <b-button
            variant="danger"
            size="sm"
            class="mb-1"
            @click="prepareDeleteSuc(row.item)"
          >
            <b-icon icon="trash-fill" />
          </b-button>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      editing: false,
      Codigo: '',
      Descripcion: '',
      Estado: '',
      Ciudad: '',
      Calle: '',
      Numero: 'S/N',
      CP: '',
      fields: [
        'Codigo',
        'Descripcion',
        'Estado',
        'Ciudad',
        { key: 'Direccion', label: 'Calle y Num' },
        'CP',
        'Acciones',
      ],
    }
  },
  computed: {
    textBtnSave() {
      return this.editing ? 'Guardar Cambios' : 'Agregar'
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    sucursales() {
      return this.$store.state.sucursalesinvcea.data.data
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      changeData: 'sucursalesinvcea/changeData',
      addSucursal: 'sucursalesinvcea/addSucursal',
      updateSucursal: 'sucursalesinvcea/updateSucursal',
      deleteSucursal: 'sucursalesinvcea/deleteSucursal',
    }),
    async loadData() {
      this.setLoading(true)
      const response = await this.changeData()
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    address(items) {
      return items.Calle + ' ' + items.Numero
    },
    editItems(item) {
      this.editing = true
      this.Codigo = item.Codigo
      this.Descripcion = item.Descripcion
      this.Estado = item.Estado
      this.Ciudad = item.Ciudad
      this.Calle = item.Calle
      this.Numero = item.Numero
      this.CP = item.CP
    },
    clean() {
      this.editing = false
      this.Codigo = ''
      this.Descripcion = ''
      this.Estado = ''
      this.Ciudad = ''
      this.Calle = ''
      this.Numero = 'S/N'
      this.CP = ''
      this.$refs.inputCodigo.focus()
    },
    validateData() {
      if (this.Codigo.trim().length < 2) {
        this.showAlertDialog([
          'Codigo debe tener 2 Caracteres',
          'Campo requerido',
        ])
        return false
      }
      if (this.Descripcion.trim() === '') {
        this.showAlertDialog(['Falta Nombre de la Sucursal', 'Campo requerido'])
        return false
      }
      return true
    },
    decideSave() {
      if (this.editing) this.prepareSaveChanged()
      else this.prepareCreateSuc()
    },
    prepareSaveChanged() {
      this.showAlertDialogOption([
        `Quiere actualizar los datos de la sucursal?`,
        'Actualizando Datos',
        () => {
          this.hideAlertDialogOption()
          this.saveSucursal()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    prepareCreateSuc() {
      this.showAlertDialogOption([
        `Quiere agregar una nueva sucursal?`,
        'Agregando Sucursal',
        () => {
          this.hideAlertDialogOption()
          this.createSucursal()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async saveSucursal() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.updateSucursal([
        this.Codigo.toUpperCase(),
        {
          Descripcion: this.Descripcion,
          Estado: this.Estado,
          Ciudad: this.Ciudad,
          Calle: this.Calle,
          Numero: this.Numero,
          CP: this.CP,
        },
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.loadData()
        this.clean()
      }
    },
    async createSucursal() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.addSucursal({
        Codigo: this.Codigo.toUpperCase(),
        Descripcion: this.Descripcion,
        Estado: this.Estado,
        Ciudad: this.Ciudad,
        Calle: this.Calle,
        Numero: this.Numero,
        CP: this.CP,
      })
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.loadData()
        this.clean()
      }
    },
    prepareDeleteSuc(items) {
      const codigo = items.Codigo
      const Descripcion = items.Descripcion
      this.showAlertDialogOption([
        `Quiere eliminar a la sucursal [${codigo} - ${Descripcion}]?`,
        'Eliminando Sucursal',
        () => {
          this.hideAlertDialogOption()
          this.eliminaSucursal(codigo)
        },
        'danger',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async eliminaSucursal(Codigo) {
      this.setLoading(true)
      const response = await this.deleteSucursal(Codigo)
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.showAlertDialog(['Sucursal Eliminada', 'Exito', 'success'])
        this.loadData()
      }
    },
  },
}
</script>

<style scoped>
.input-sel {
  margin-left: 10px;
  width: calc(33% - 30px);
}

#spanCodigo {
  width: 100%;
  max-width: 140px;
}

#spanCalle {
  width: 50%;
}

#spanNumero,
#spanCP {
  width: 13%;
  min-width: 110px;
}

.label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.cajaCodigo {
  text-transform: uppercase;
}

.description {
  font-style: italic;
  color: rgb(127, 127, 127);
}

.footer-card-add {
  padding: 15px;
}
</style>
