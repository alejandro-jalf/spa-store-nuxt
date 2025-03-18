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
            @change="changeSucursal"
          ></b-form-select>
        </b-input-group>

        <b-input-group prepend="Fecha" class="mb-0 p-0 mr-2">
          <b-form-datepicker
            id="date-init"
            v-model="formFolio.fecha"
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
            class="bg-white"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Proveedor" class="my-3">
          <b-form-select :value="suc" :options="options"></b-form-select>
          <template #append>
            <b-button @click="loadProveedores">Actualizar</b-button>
          </template>
        </b-input-group>

        <b-input-group prepend="Subtotal" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.Subtotal"
            type="number"
            required
            class="bg-white"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Descuento" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.descuento"
            type="number"
            required
            class="bg-white"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Ieps" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.ieps"
            type="number"
            required
            class="bg-white"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Iva" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.iva"
            type="number"
            required
            class="bg-white"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Total" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.total"
            type="number"
            readonly
            class="bg-white"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Documento" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.documento"
            type="text"
            required
            class="bg-white"
          ></b-form-input>
        </b-input-group>

        <b-input-group prepend="Estatus" class="my-3">
          <b-form-input
            ref="inputoftipo"
            v-model="formFolio.estatus"
            type="text"
            required
            class="bg-white"
          ></b-form-input>
        </b-input-group>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  props: {
    changeSucLocal: {
      type: Function,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suc: 'ZR',
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
  mounted() {
    this.suc = this.selected
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setView: 'bitacoradigitalcompras/setView',
      setSucursal: 'bitacoradigitalcompras/setSucursal',
    }),
    ...mapActions({
      getProveedores: 'bitacoradigitalcompras/getProveedores',
    }),
    changeSucursal(suc) {
      this.suc = suc
      this.changeSucLocal(suc)
      this.setSucursal(suc)
    },
    async loadProveedores() {
      this.setLoading(true)
      const response = await this.getProveedores()
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
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
</style>
