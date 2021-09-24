<template>
  <div class="container-consolidaciones">
    <div class="containerInp">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="dateStart"
          v-model="dateStar"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Al">
        <b-form-datepicker id="dateEnd" v-model="dateEnd"></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button
      variant="success"
      :block="width < 1100"
      :class="{ 'mt-2': width < 1100 }"
      @click="updateConsolidaciones"
    >
      Buscar
    </b-button>

    <b-table
      id="tableConsolidaciones"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="mt-3"
      :class="variantThemeTableBody"
    >
      <template #cell(Fecha)="row">
        {{ utils.toDate(row.item.CantidadRegular) }}
      </template>
      <template #cell(Hora)="row">
        {{ utils.toHour(row.item.CantidadRegular) }}
      </template>
    </b-table>
    <div class="footerConexiones">
      <span class="mr-3 mt-2">
        <span class="font-weight-bold">Sucursal: </span>
        {{ sucursal }}
      </span>
      <b-button variant="success"> Cambiar sucursal </b-button>
    </div>
    <b-modal
      :visible="alertShow"
      title="Cambiando sucursal"
      header-bg-variant="warning"
      header-text-variant="white"
      :centered="true"
    >
      <b-container fluid>
        <b-form-select v-model="selected" :options="options"></b-form-select>
      </b-container>

      <template #modal-footer>
        <div class="w-100">
          <b-button variant="primary" size="sm" class="float-right">
            Aceptar
          </b-button>
          <b-button variant="secondary" size="sm" class="float-right mr-2">
            Cancelar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      alertShow: true,
      dateStar: '',
      dateEnd: '',
      fields: [
        'Fecha',
        'Hora',
        'Transferencia',
        'Entrada',
        'Referencia',
        'AlmacenDestino',
        'Observaciones',
        'Estatus',
      ],
      utils,
      sucursales: {
        ZR: 'SPAZARAGOZA',
        VC: 'SPACENTRO',
        OU: 'SPAOLUTA',
        JL: 'SPAJALTIPAN',
        BO: 'SPABODEGA',
      },
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPACENTRO' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    dataRefactor() {
      const datos = []
      this.$store.state.consolidaciones.data.data.forEach((consolidacion) => {
        const data = { ...consolidacion }
        if (data.Estatus === 'Fallo') data._rowVariant = 'warning'
        else if (data.Estatus !== 'Exito') data._rowVariant = 'danger'
        datos.push(data)
      })
      return datos
    },
    sucursal() {
      const sucursales = this.sucursales
      return sucursales[`${this.$store.state.consolidaciones.sucursal}`]
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
  },
  mounted() {
    const tableConsolidaciones = document.getElementById('tableConsolidaciones')
    const dateNow = new Date()
    const now =
      dateNow.getFullYear() +
      '-' +
      utils.completeDateHour(dateNow.getMonth() + 1) +
      '-' +
      utils.completeDateHour(dateNow.getDate())
    this.dateStar = now
    this.dateEnd = now

    if (tableConsolidaciones) {
      tableConsolidaciones.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableConsolidaciones.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'consolidaciones/setSucursal',
    }),
    ...mapActions({
      changeData: 'consolidaciones/changeData',
    }),
    async updateConsolidaciones() {
      this.setLoading(true)
      const response = await this.changeData([
        this.dateStar.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
        'ZR',
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.container-consolidaciones {
  padding-top: 10px;
  padding-bottom: 60px;
}

.footerConexiones {
  background: rgba(196, 167, 167, 0.411);
  width: 100%;
  padding: 10px;
  padding-right: 10px;
}

.containerInp {
  display: inline-block;
  margin-top: 7px;
}

@media screen and (max-width: 1100px) {
  .containerInp {
    display: block;
  }
}
</style>
