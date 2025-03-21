<template>
  <div>
    <b-card
      :header-bg-variant="editing ? 'success' : 'info'"
      header-text-variant="light"
      text-variant="dark"
      style="width: 100%; max-width: 500px; margin: auto"
    >
      <template #header>
        <h6 class="title-card">
          {{ editing ? 'Editando ID: ' + formFolio.id : 'Agregando Folio' }}
        </h6>
        <b-icon icon="x-lg" class="close-card" @click="setView('NO')"></b-icon>
      </template>

      <b-form class="p-2">
        <b-input-group prepend="Sucursal" class="my-3">
          <b-form-select
            :value="suc"
            :options="options"
            disabled
          ></b-form-select>
        </b-input-group>

        <b-input-group prepend="Fecha" class="mb-0 p-0 mr-2">
          <b-form-datepicker
            id="date-init"
            v-model="formFolio.fecha"
            disabled
            locale="es-MX"
            label-no-date-selected="Fecha no seleccionada"
          ></b-form-datepicker>
        </b-input-group>

        <b-input-group prepend="Folio" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.folio"
            type="text"
            required
            disabled
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Prov.">
          <b-form-input
            v-model="formFolio.proveedor"
            autocomplete="off"
            placeholder="Proveedor"
            type="search"
            @focus="visibleCard = true"
          ></b-form-input>
          <b-button
            v-b-tooltip.hover
            variant="light"
            size="sm"
            title="Este boton refresca la lista de proveedores"
            @click="loadProveedores"
          >
            <b-icon icon="arrow-clockwise" :animation="animationTable"></b-icon>
            Refrescar
          </b-button>
        </b-input-group>
        <div class="container-card">
          <b-card v-if="visibleCard" class="card-providers" no-body>
            <div v-if="findProviders.length === 0" class="not-found">
              No se encontraron resultados
            </div>
            <div v-else>
              <div
                v-for="(prov, index) in findProviders"
                :key="index"
                class="item-option"
                @click="selectProvider(prov)"
              >
                {{ prov.Proveedor }}
              </div>
            </div>
          </b-card>
        </div>

        <b-input-group prepend="Subtotal" class="my-3">
          <b-form-input
            ref="inputsubtotal"
            v-model="formFolio.subtotal"
            type="number"
            required
            class="bg-white"
            @focus="$refs.inputsubtotal.select()"
            @keyup.enter="$refs.inputdescuento.focus()"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Descuento" class="my-3">
          <b-form-input
            ref="inputdescuento"
            v-model="formFolio.descuento"
            type="number"
            required
            class="bg-white"
            @focus="$refs.inputdescuento.select()"
            @keyup.enter="$refs.inputieps.focus()"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Ieps" class="my-3">
          <b-form-input
            ref="inputieps"
            v-model="formFolio.ieps"
            type="number"
            required
            class="bg-white"
            @focus="$refs.inputieps.select()"
            @keyup.enter="$refs.inputiva.focus()"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Iva" class="my-3">
          <b-form-input
            ref="inputiva"
            v-model="formFolio.iva"
            type="number"
            required
            class="bg-white"
            @focus="$refs.inputiva.select()"
            @keyup.enter="$refs.inputdocumento.focus()"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Total" class="my-3">
          <b-form-input
            v-model="formFolio.total"
            type="number"
            readonly
            class="total"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Documento" class="my-3">
          <b-form-input
            ref="inputdocumento"
            v-model="formFolio.documento"
            type="text"
            required
            class="bg-white inputDocument"
            @focus="$refs.inputdocumento.select()"
            @keyup.enter="$refs.btnAceptar.focus()"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Estatus" class="my-3">
          <b-form-input
            v-model="formFolio.estatus"
            type="text"
            required
            readonly
          ></b-form-input>
        </b-input-group>

        <b-button
          ref="btnAceptar"
          :variant="editing ? 'success' : 'info'"
          block
          @click="pushAceptar"
        >
          <b-icon icon="plus-circle-fill" />
          {{ editing ? 'Guardar Cambios' : 'Aceptar' }}
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  props: {
    selected: {
      type: String,
      required: true,
    },
    loadListCompras: {
      type: Function,
      required: true,
    },
    editing: {
      type: Boolean,
      required: true,
    },
    body: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      suc: 'ZR',
      loadingTable: false,
      visibleCard: false,
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'SC', text: 'SPASOCONUSCO' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      formFolio: {
        id: '',
        sucursal: '',
        fecha: '',
        folio: '',
        proveedor: '',
        subtotal: 0,
        descuento: 0,
        ieps: 0,
        iva: 0,
        total: 0,
        documento: '',
        estatus: 'A TIEMPO',
      },
    }
  },
  computed: {
    isManager() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    animationTable() {
      return this.loadingTable ? 'spin-pulse' : ''
    },
    findProviders() {
      const text = this.formFolio.proveedor
      const expr = new RegExp(text.toUpperCase().replace(' ', '.*'))
      return this.$store.state.bitacoradigitalcompras.proveedores.data.filter(
        (proveedor) => expr.test(proveedor.Proveedor.toUpperCase())
      )
    },
    proveedores() {
      const options =
        this.$store.state.bitacoradigitalcompras.proveedores.data.reduce(
          (opt, provider) => {
            opt.push(provider.Proveedor)
            return opt
          },
          []
        )

      return options
    },
  },
  watch: {
    'formFolio.subtotal'(newValue) {
      this.calculateTotal(
        newValue,
        this.formFolio.descuento,
        this.formFolio.iva,
        this.formFolio.ieps
      )
    },
    'formFolio.descuento'(newValue) {
      this.calculateTotal(
        this.formFolio.subtotal,
        newValue,
        this.formFolio.iva,
        this.formFolio.ieps
      )
    },
    'formFolio.ieps'(newValue) {
      this.calculateTotal(
        this.formFolio.subtotal,
        this.formFolio.descuento,
        this.formFolio.iva,
        newValue
      )
    },
    'formFolio.iva'(newValue) {
      this.calculateTotal(
        this.formFolio.subtotal,
        this.formFolio.descuento,
        newValue,
        this.formFolio.ieps
      )
    },
  },
  mounted() {
    this.suc = this.selected
    if (!this.editing) {
      this.formFolio.fecha = utils.getDateNow().format('YYYY-MM-DD')
      this.generaFolio()
    } else this.setDataBody(this.body)
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setView: 'bitacoradigitalcompras/setView',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      getProveedores: 'bitacoradigitalcompras/getProveedores',
    }),
    setDataBody(body) {
      this.suc = body.Sucursal
      this.formFolio.id = body.id
      this.formFolio.fecha = body.Fecha
      this.formFolio.folio = body.Folio
      this.formFolio.proveedor = body.Proveedor
      this.formFolio.subtotal = body.Subtotal
      this.formFolio.descuento = body.Descuento
      this.formFolio.ieps = body.Ieps
      this.formFolio.iva = body.Iva
      this.formFolio.total = body.Total
      this.formFolio.documento = body.Documento
      this.formFolio.estatus = body.Estatus
    },
    calculateTotal(subtotal, descuento, iva, ieps) {
      this.formFolio.total = utils.roundTo(
        this.getFloatTo(subtotal) -
          this.getFloatTo(descuento) +
          this.getFloatTo(iva) +
          this.getFloatTo(ieps),
        3
      )
    },
    getFloatTo(value) {
      try {
        if (value.toString().trim() === '') return 0.0
        return parseFloat(value)
      } catch (error) {
        return 0.0
      }
    },
    selectProvider(prov) {
      this.visibleCard = false
      this.formFolio.proveedor = prov.Proveedor
      this.$refs.inputsubtotal.focus()
    },
    async loadProveedores() {
      this.setLoading(true)
      this.loadingTable = true
      const response = await this.getProveedores()
      this.setLoading(false)
      this.loadingTable = false
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    async generaFolio() {
      try {
        const url =
          process.env.spastore_url_backend +
          'api/v1/bitacoradigital/compras/generate/' +
          this.suc +
          '/' +
          utils.getDateNow().format('YYYYMMDD')
        const response = await this.$axios({
          url,
          method: 'get',
        })

        if (response.data.success)
          this.formFolio.folio = response.data.data.Folio
        else this.showAlertDialog(['No se pudo generar el folio', 'Fallo'])
      } catch (error) {
        if (error.response) {
          return error.response.data
        }
        return {
          success: false,
          message: 'Error Al cargar folio',
          error,
        }
      }
    },
    pushAceptar() {
      if (this.editing) {
        this.showAlertDialogOption([
          '¿Quiere actualizar los datos de este registro?',
          'Actualizando Folio',
          () => {
            this.hideAlertDialogOption()
            this.updateRegistro()
          },
          'warning',
          'light',
          this.hideAlertDialogOption,
        ])
      } else this.addRegistro()
    },
    validateForm() {
      if (this.suc.trim() === '') {
        this.showAlertDialog(['Fallo al cargar sucursal', 'Campo vacio'])
        return false
      }
      if (this.formFolio.folio.trim() === '') {
        this.showAlertDialog(['Fallo al cargar el folio', 'Campo vacio'])
        return false
      }
      if (this.formFolio.proveedor.trim() === '') {
        this.showAlertDialog([
          'No se ha seleccionado un proveedor',
          'Campo vacio',
        ])
        return false
      }
      if (this.getFloatTo(this.formFolio.subtotal) === 0) {
        this.showAlertDialog([
          'El subtotal no puede quedar vacio',
          'Campo vacio',
        ])
        return false
      }
      if (this.formFolio.documento.trim() === '') {
        this.showAlertDialog(['Falta Documento', 'Campo vacio'])
        return false
      }
      return true
    },
    async addRegistro() {
      try {
        if (!this.validateForm()) return false
        const body = {
          Sucursal: this.selected,
          Fecha: utils.getDateNow().format('YYYYMMDD'),
          Folio: this.formFolio.folio,
          Proveedor: this.formFolio.proveedor,
          Subtotal: this.getFloatTo(this.formFolio.subtotal),
          Descuento: this.getFloatTo(this.formFolio.descuento),
          Ieps: this.getFloatTo(this.formFolio.ieps),
          Iva: this.getFloatTo(this.formFolio.iva),
          Total: this.formFolio.total,
          Documento: this.formFolio.documento.toUpperCase(),
        }

        const url =
          process.env.spastore_url_backend + 'api/v1/bitacoradigital/compras/'
        const response = await this.$axios({
          url,
          method: 'post',
          data: body,
        })

        if (response.data.success) {
          this.showAlertDialog(['Folio generado', 'Exito', 'success'])
          this.setView('NO')
          this.loadListCompras()
        } else {
          this.showAlertDialog(['Fallo al generar folio', 'Fallo'])
        }
      } catch (error) {
        if (error.response) {
          return error.response.data
        }
        return {
          success: false,
          message: 'Error Al cargar folio',
          error,
        }
      }
    },
    async updateRegistro() {
      try {
        if (!this.validateForm()) return false
        const body = {
          Proveedor: this.formFolio.proveedor,
          Subtotal: this.getFloatTo(this.formFolio.subtotal),
          Descuento: this.getFloatTo(this.formFolio.descuento),
          Ieps: this.getFloatTo(this.formFolio.ieps),
          Iva: this.getFloatTo(this.formFolio.iva),
          Total: this.formFolio.total,
          Documento: this.formFolio.documento.toUpperCase(),
        }

        const url =
          process.env.spastore_url_backend +
          'api/v1/bitacoradigital/compras/' +
          this.formFolio.id
        const response = await this.$axios({
          url,
          method: 'put',
          data: body,
        })

        if (response.data.success) {
          this.showAlertDialog(['Folio Actualizado', 'Exito', 'success'])
          this.setView('NO')
          this.loadListCompras()
        } else this.showAlertDialog(['Fallo al actualizar el folio', 'Fallo'])
      } catch (error) {
        if (error.response)
          this.showAlertDialog([
            error.response.data.message,
            'Fallo con el servidor',
          ])
        else
          this.showAlertDialog([
            'Ocurrio un error durante el proceso',
            'Fallo con el servidor',
          ])
      }
    },
  },
}
</script>

<style scoped>
.container-card {
  position: relative;
}

.card-providers {
  position: absolute;
  z-index: 8;
  max-height: 350px;
  width: 100%;
  overflow-y: auto;
  border: #93979a 2px solid;
  box-shadow: #757575 2px 4px 4px;
  border-top: 0px;
  border-left: 0px;
}

.not-found {
  font-style: italic;
  color: #757575;
  padding-left: 28px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.item-option {
  padding: 5px;
  padding-left: 20px;
  font-size: 15px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
}

.item-option:hover {
  background: #e4e4e4;
}

.title-card {
  margin: 0px;
  display: inline-block;
}

.close-card {
  float: right;
}

.close-card:hover {
  font-size: 15pt;
}

.inputDocument {
  text-transform: uppercase;
}

.total {
  background: #fff9b6;
}
</style>
