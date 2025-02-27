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
        <b-icon icon="x-lg" class="close-card"></b-icon>
      </template>

      <b-form class="p-2">
        <b-input-group prepend="Sucursal" class="my-3">
          <b-form-select
            :value="suc"
            :options="options"
            @change="selectSucursal"
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
  data() {
    return {
      suc: 'ZR',
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'SC', text: 'Soconusco' },
        { value: 'SN', text: 'San Andres' },
        { value: 'SNP', text: 'San Andres P' },
        { value: 'BO', text: 'Bodega' },
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
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      getProveedores: 'bitacoradigitalcompras/getProveedores',
    }),
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
