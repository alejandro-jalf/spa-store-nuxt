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

    <b-container v-if="dataComparativa.length > 20" fluid="xl">
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
      :items="dataComparativa"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(FechaPedidoEnSucursal)="row">
        {{ formatDateHour(row.item.FechaPedidoEnSucursal) }}
      </template>
      <template #cell(FechaPedidoEnviado)="row">
        {{ formatDateHour(row.item.FechaPedidoEnviado) }}
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
    dataComparativa() {
      return this.$store.state.pedidosmayoristas.data.data
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'pedidosmayoristas/changeData',
    }),
    formatDateHour(date) {
      if (!date || date === null) return '--/--/-- 00:00'
      return utils.formatWithMoment(date, 'DD/MM/YYYY HH:MM a')
    },
    async loadData() {
      this.setLoading(true)
      console.log(
        this.dateInit.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, '')
      )
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
