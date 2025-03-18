<template>
  <div>
    <b-card
      header-bg-variant="info"
      header-text-variant="light"
      text-variant="dark"
      style="width: 100%; max-width: 500px; margin: auto"
    >
      <template #header>
        <h6 class="title-card">Agregando Folio</h6>
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

        <b-input-group prepend="Prov." class="my-3">
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
            class="bg-white"
            @focus="$refs.inputdocumento.select()"
            @keyup.enter="$refs.inputsubtotal.focus()"
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
        estatus: '',
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
    this.formFolio.fecha = utils.getDateNow().format('YYYY-MM-DD')
    this.generaFolio()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setView: 'bitacoradigitalcompras/setView',
    }),
    ...mapActions({
      getProveedores: 'bitacoradigitalcompras/getProveedores',
    }),
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
      if (value.toString().trim() === '') return 0.0
      return parseFloat(value)
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

        if (response.data.success) {
          this.formFolio.folio = response.data.data.Folio
        } else {
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
  left: 98px;
  max-height: 350px;
  width: calc(100% - 98px);
  overflow-y: auto;
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

.total {
  background: #fff9b6;
}
</style>
