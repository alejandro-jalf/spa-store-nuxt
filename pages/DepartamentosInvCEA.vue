<template>
  <div>
    <h2 class="text-center my-4">Departamentos</h2>
    <b-card title="Agregando Departamento" class="text-dark">
      <b-form inline class="mt-1">
        <span id="spanCodigo" class="input-sel">
          <div class="label">Codigo</div>
          <b-form-input
            ref="inputCodigo"
            v-model="Codigo"
            class="w-100 cajaCodigo"
            placeholder="Codigo"
            maxlength="3"
            :disabled="editing"
            @focus="$refs.inputCodigo.select()"
            @keyup.enter="$refs.inputDescripcion.focus()"
            @keyup.esc="clean"
          />
          <div class="description">3 Caracteres</div>
        </span>
        <span id="spanDescripcion" class="input-sel">
          <div class="label">Descripcion</div>
          <b-form-input
            ref="inputDescripcion"
            v-model="Descripcion"
            class="w-100 caja"
            placeholder="Nombre del departamento"
            @focus="$refs.inputDescripcion.select()"
            @keyup.enter="$refs.btnAgregar.focus()"
            @keyup.esc="clean"
          />
          <div class="description">150 Caracteres Maximo</div>
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
        :items="departamentos"
        :fields="fields"
        class="mt-3"
      >
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
            @click="prepareDeleteDep(row.item)"
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
      fields: ['Codigo', 'Descripcion', 'Acciones'],
    }
  },
  computed: {
    textBtnSave() {
      return this.editing ? 'Guardar Cambios' : 'Agregar'
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    departamentos() {
      return this.$store.state.departamentosinvcea.data.data
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
      changeData: 'departamentosinvcea/changeData',
      add: 'departamentosinvcea/add',
      update: 'departamentosinvcea/update',
      delete: 'departamentosinvcea/delete',
    }),
    async loadData() {
      this.setLoading(true)
      const response = await this.changeData()
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },

    editItems(item) {
      this.editing = true
      this.Codigo = item.Codigo
      this.Descripcion = item.Descripcion
      this.$refs.inputDescripcion.focus()
    },
    clean() {
      this.editing = false
      this.Codigo = ''
      this.Descripcion = ''
      this.$refs.inputCodigo.focus()
    },
    validateData() {
      if (this.Codigo.trim().length < 2) {
        this.showAlertDialog([
          'Codigo debe tener 3 Caracteres',
          'Campo requerido',
        ])
        return false
      }
      if (this.Descripcion.trim() === '') {
        this.showAlertDialog([
          'Falta Nombre del departamento',
          'Campo requerido',
        ])
        return false
      }
      return true
    },
    decideSave() {
      if (this.editing) this.prepareUpdateDep()
      else this.prepareCreateDep()
    },
    prepareCreateDep() {
      this.showAlertDialogOption([
        `Quiere agregar un nuevo departamento?`,
        'Agregando Departamento',
        () => {
          this.hideAlertDialogOption()
          this.createDepartamento()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    prepareUpdateDep() {
      this.showAlertDialogOption([
        `Quiere actualizar los datos del departamento?`,
        'Actualizando Datos',
        () => {
          this.hideAlertDialogOption()
          this.updateDepartamento()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async updateDepartamento() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.update([
        this.Codigo.toUpperCase(),
        { Descripcion: this.Descripcion },
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.loadData()
        this.clean()
      }
    },
    async createDepartamento() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.add({
        Codigo: this.Codigo.toUpperCase(),
        Descripcion: this.Descripcion,
      })
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.loadData()
        this.clean()
      }
    },
    prepareDeleteDep(items) {
      const codigo = items.Codigo
      const Descripcion = items.Descripcion
      this.showAlertDialogOption([
        `Quiere eliminar a el departamento [${codigo} - ${Descripcion}]?`,
        'Eliminando Departamento',
        () => {
          this.hideAlertDialogOption()
          this.eliminaDepartamento(codigo)
        },
        'danger',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async eliminaDepartamento(Codigo) {
      this.setLoading(true)
      const response = await this.delete(Codigo)
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.showAlertDialog(['Departamento Eliminado', 'Exito', 'success'])
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

#spanDescripcion {
  width: 65%;
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
