<template>
  <div>
    <h2 class="text-center my-4">Tipos de equipos</h2>
    <b-card title="Agregando Tipo de Equipo" class="text-dark">
      <b-form inline class="mt-1">
        <span id="spanCodigo" class="input-sel">
          <div class="label">Codigo</div>
          <b-form-input
            ref="inputCodigo"
            v-model="Codigo"
            class="w-100 cajaCodigo"
            placeholder="Codigo"
            maxlength="3"
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
            placeholder="Nombre del Tipo Equipo"
            @focus="$refs.inputDescripcion.select()"
            @keyup.enter="$refs.btnAgregar.focus()"
            @keyup.esc="clean"
          />
          <div class="description">150 Caracteres Maximo</div>
        </span>
      </b-form>

      <b-card no-body class="mb-1">
        <b-card-header
          header-tag="header"
          header-bg-variant="dark"
          class="text-right p-2"
          role="tab"
        >
          <b-button
            v-b-toggle.accordion-1
            block
            variant="dark"
            class="text-right"
          >
            Campos para la ficha tecnica
            <b-icon icon="caret-down-fill"></b-icon>
          </b-button>
        </b-card-header>
        <b-collapse
          id="accordion-1"
          visible
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body class="bodyCard">
            <b-form inline class="mt-1">
              <b-form-checkbox-group v-model="selected" name="checkbox-1">
                <span
                  v-for="(campo, indexCampo) in options"
                  :key="indexCampo"
                  class="spanCheck"
                  :class="getClassChecked(campo.value)"
                >
                  <b-form-checkbox :value="campo.value" class="cajaSelect">
                    {{ campo.text }}
                  </b-form-checkbox>
                </span>
              </b-form-checkbox-group>
            </b-form>
          </b-card-body>
        </b-collapse>
      </b-card>

      <div class="footer-card-add">
        <b-button
          ref="btnAgregar"
          variant="success"
          type="button"
          class="float-right"
          @keyup.esc="clean"
          @click="prepareCreateTipo"
        >
          <b-icon icon="plus-lg" />
          Agregar
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
    <b-card class="my-3" body-text-variant="dark">
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
        :items="tipoequipos"
        :fields="fields"
        class="mt-3"
      >
        <template #cell(Acciones)>
          <b-button variant="warning" size="sm" class="mb-1">
            <b-icon icon="pencil" />
          </b-button>
          <b-button variant="danger" size="sm" class="mb-1">
            <b-icon icon="trash-fill" />
          </b-button>
        </template>

        <template #cell(Campos)="row">
          <b-button
            variant="info"
            size="sm"
            class="mr-2"
            @click="row.toggleDetails"
          >
            {{ row.detailsShowing ? 'Ocultar' : 'Mostrar' }}
            Campos
            <b-icon icon="caret-down-fill"></b-icon>
          </b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <span
              v-for="(campo, indexAdd) in splitCampos(row.item.Campos)"
              :key="indexAdd"
              class="checked spanList"
            >
              {{ campo.text }}
            </span>
          </b-card>
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
      Codigo: '',
      Descripcion: '',
      fields: ['Codigo', 'Descripcion', 'Campos', 'Acciones'],
      selected: [],
      options: [
        { text: 'Modelo', value: 'Modelo' },
        { text: 'Marca', value: 'Marca' },
        { text: 'Pantalla Pulgadas', value: 'PantallaPulgadas' },
        { text: 'Tamaño Pulgadas', value: 'TamañoPulgadas' },
        { text: 'Fabricante', value: 'Fabricante' },
        { text: 'Puerto HDMI', value: 'PuertoHDMI' },
        { text: 'Puerto VGA', value: 'PuertoVGA' },
        { text: 'Color', value: 'Color' },
        { text: 'Serie', value: 'Serie' },
        { text: 'Codigo', value: 'Codigo' },
        { text: 'Clave', value: 'Clave' },
        { text: 'Digitos', value: 'Digitos' },
        { text: 'Largo', value: 'Largo' },
        { text: 'Ancho', value: 'Ancho' },
        { text: 'Grosor', value: 'Grosor' },
        { text: 'Alambrico', value: 'Alambrico' },
        { text: 'Sistema Operativo', value: 'SO' },
        { text: 'MotherBoard', value: 'MotherBoard' },
        { text: 'Procesador', value: 'Procesador' },
        { text: 'DiscoDuro', value: 'DiscoDuro' },
        { text: 'RAM', value: 'RAM' },
        { text: 'Conectividad', value: 'Conectividad' },
        { text: 'TipoPila', value: 'TipoPila' },
        { text: 'Duracion Bateria', value: 'DuracionBateria' },
        { text: 'Voltaje', value: 'Voltaje' },
        { text: 'Accesorios', value: 'Accesorios' },
        { text: 'Garantia', value: 'Garantia' },
        { text: 'Toner', value: 'Toner' },
        { text: 'Tambor', value: 'Tambor' },
        { text: 'Tipo', value: 'Tipo' },
        { text: 'Numero Serial', value: 'NumeroSerial' },
        { text: 'Material', value: 'Material' },
        { text: 'Valocidades', value: 'Valocidades' },
        { text: 'Capacidad', value: 'Capacidad' },
        { text: 'Contiene Bateria', value: 'ContieneBateria' },
        { text: 'Numero Puertas', value: 'NumeroPuertas' },
        { text: 'Temperatura Operacion', value: 'TemperaturaOperacion' },
        { text: 'Consumo Energetico', value: 'ConsumoEnergetico' },
        { text: 'Iluminacion', value: 'Iluminacion' },
        { text: 'Sistema Refrigeracion', value: 'SistemaRefrigeracion' },
        { text: 'Combustible', value: 'Combustible' },
        { text: 'Contactos', value: 'Contactos' },
        { text: 'Cargador', value: 'Cargador' },
      ],
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    tipoequipos() {
      const datos = []
      this.$store.state.tiposequiposinvcea.data.data.forEach((row) => {
        const object = { ...row }
        datos.push(object)
      })
      return datos
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
      changeData: 'tiposequiposinvcea/changeData',
      addSucursal: 'tiposequiposinvcea/addSucursal',
    }),
    splitCampos(campos) {
      return this.options.filter((value) => {
        const arrayCampos = campos.split(',')
        const campoFinded = arrayCampos.find(
          (campo) => campo.trim() === value.value
        )
        return !!campoFinded
      })
    },
    getClassChecked(value) {
      const valueFinded = this.selected.find((campo) => campo === value)
      if (valueFinded) return 'checked'
      return ''
    },
    async loadData() {
      this.setLoading(true)
      const response = await this.changeData()
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    clean() {
      this.Codigo = ''
      this.Descripcion = ''
      this.selected = []
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
          'Falta Nombre del Tipo de Equipo',
          'Campo requerido',
        ])
        return false
      }
      return true
    },
    prepareCreateTipo() {
      this.showAlertDialogOption([
        `Quiere agregar un nuevo tipoequipo?`,
        'Agregando tipoequipo',
        () => {
          this.hideAlertDialogOption()
          this.createtipoequipo()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async createtipoequipo() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.addSucursal({
        Codigo: this.Codigo.toUpperCase(),
        Descripcion: this.Descripcion,
        Campos: this.selected.toString(),
      })
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.loadData()
        this.clean()
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

.spanCheck,
.spanList {
  padding: 5px;
  padding-left: 10px;
  border-radius: 5px;
  border: 1px solid #0c5739;
  background: #ffffff;
  margin: 0px 15px 10px 0px;
}

.checked {
  background: #015432;
  color: #ffffff;
}

.cajaSelect {
  height: 100%;
  margin: 10px 0px;
  padding: 0px 10px 0px 20px;
}

.spanList {
  display: inline-block;
  margin: 5px;
}

.footer-card-add {
  padding: 15px;
}
</style>
