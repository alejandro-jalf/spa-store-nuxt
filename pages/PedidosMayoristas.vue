<template>
  <div>
    <h1 class="text-center py-3">Monitor de Pedidos de Mayoristas</h1>
    <div class="inputs">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="date-init"
          v-model="dateInit"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de consulta"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Al">
        <b-form-datepicker
          id="date-end"
          v-model="dateEnd"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de consulta"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>

    <b-button variant="info" @click="loadData">
      <b-icon icon="search"></b-icon>
      <span>Buscar</span>
    </b-button>

    <b-container v-if="dataPedidos.length > 20" fluid="xl">
      <b-row cols="1" cols-sm="2">
        <b-col sm="3" md="2" class="mb-2">
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="9" md="10" class="mb-2">
          <b-pagination
            v-model="currentPage"
            aria-controls="tableInventarioValuacion"
            :total-rows="rows"
            :per-page="perPage"
            align="fill"
            size="sm"
            first-number
            class="my-0"
            last-number
          >
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      hover
      head-variant="dark"
      foot-variant="dark"
      outlined
      responsive
      select-mode="single"
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataPedidos"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(FechaPedidoEnSucursal)="row">
        {{ formatDateHour(row.item.FechaPedidoEnSucursal) }}
      </template>
      <template #cell(FechaPedidoEnviado)="row">
        {{ formatDateHour(row.item.FechaPedidoEnviado) }}
      </template>
      <template #cell(acciones)="row">
        <div v-if="visibleButton(row.item, 'load')">
          <b-spinner
            v-for="(canti, position) in 9"
            :key="position"
            style="width: 6px; height: 6px"
            class="ml-1"
            variant="success"
            type="grow"
          ></b-spinner>
        </div>
        <b-button
          v-else-if="visibleButton(row.item, 'action')"
          variant="info"
          @click="prepareUploadCarga(row.item)"
        >
          <b-icon icon="cart-plus-fill"></b-icon>
          {{ messageButtonIcons(row.item) }}
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      dateInit: '',
      dateEnd: '',
      perPage: 50,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      fields: [
        { key: 'Pedido', label: 'Consecutivo', sortable: true },
        { key: 'Sucursal', label: 'Sucursal', sortable: true },
        { key: 'Estatus', label: 'Estado', sortable: true },
        { key: 'FechaPedidoEnSucursal', label: 'Generado', sortable: true },
        { key: 'FechaPedidoEnviado', label: 'Enviado', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: false },
      ],
    }
  },
  computed: {
    dataPedidos() {
      const listRequest = [...this.$store.state.pedidosmayoristas.data.data]
      listRequest.forEach((request) => {
        const status = request.Estatus
        if (status === 'PEDIDO ATENDIDO') request._rowVariant = 'success'
        else if (status === 'PEDIDO ENVIADO') request._rowVariant = 'warning'
        else request._rowVariant = 'light'
      })
      return listRequest
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    tipoUser() {
      return this.$store.state.user.user.tipo_user
    },
    rows() {
      return this.dataPedidos.length
    },
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      changeData: 'pedidosmayoristas/changeData',
      uploadPedido: 'pedidosmayoristas/uploadPedido',
    }),
    messageButtonIcons(dataReq) {
      if (dataReq.Estatus === 'PEDIDO ENVIADO') return 'Subir Carga'
      return 'Volver a Cargar'
    },
    visibleButton(dataReq, typeButton) {
      const status = dataReq.Estatus
      switch (status) {
        case 'PEDIDO EN SUCURSAL':
          if (typeButton === 'load') return true
          else return false
        case 'PEDIDO ENVIADO':
          if (typeButton === 'action') return this.tipoUser === 'manager'
          else return false
        case 'PEDIDO ATENDIDO':
          if (typeButton === 'action') return this.tipoUser === 'manager'
          else return false
        default:
          return false
      }
    },
    formatDateHour(date) {
      if (!date || date === null) return '--/--/-- 00:00'
      return utils.formatWithMoment(date, 'DD/MM/YYYY HH:MM a')
    },
    validateDate() {
      if (this.dateInit === null || this.dateInit === '') {
        this.showAlertDialog([
          'Falta seleccionar fecha inicio',
          'Saleccione fecha',
        ])
        return false
      }
      if (this.dateEnd === null || this.dateEnd === '') {
        this.showAlertDialog([
          'Falta seleccionar fecha final',
          'Saleccione fecha',
        ])
        return false
      }
      return true
    },
    async loadData() {
      if (!this.validateDate()) return
      this.setLoading(true)
      const response = await this.changeData([
        this.dateInit.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
      }
    },
    prepareUploadCarga(dataItem) {
      const msj =
        dataItem.Estatus === 'PEDIDO ATENDIDO'
          ? '¿Quiere volver a subir la carga de este pedido?'
          : '¿Quiere subir la carga de este pedido?'
      this.showAlertDialogOption([
        msj,
        'Subiendo Carga',
        () => {
          this.hideAlertDialogOption()
          this.uploadCarga(dataItem)
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async uploadCarga(dataItem) {
      this.setLoading(true)
      const response = await this.uploadPedido([
        dataItem.Sucursal,
        dataItem.Pedido,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.showAlertDialog(['Se ha cargado los articulos', 'Carga subida'])
        const data = this.$store.state.pedidosmayoristas.data
        this.setLoading(true)
        await this.changeData([data.fechaInit, data.fechaEnd])
        this.setLoading(false)
      }
    },
  },
}
</script>

<style scoped>
.inputs {
  width: (33% - 8px);
  margin-bottom: 10px;
  display: inline-block;
}

@media screen and (max-width: 1199px) {
  .inputs {
    width: calc(49% - 19px);
  }
}

@media screen and (max-width: 991px) {
  .inputs {
    width: calc(49% + 2px);
  }
}

@media screen and (max-width: 767px) {
  .inputs {
    width: 100%;
  }
}
</style>
