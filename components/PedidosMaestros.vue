<template>
  <div>
    <b-input-group
      v-if="dataUser.tipo_user === 'manager'"
      prepend="Sucursal"
      class="mb-4"
    >
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
    </b-input-group>

    <b-form-checkbox
      id="checkUpdate"
      v-model="updateEachTime"
      value="true"
      unchecked-value="false"
      class="d-inline-block ml-1"
    >
      Actualizar cada 5 Min
    </b-form-checkbox>
    <b-button
      :variant="variantInfo"
      class="d-inline-block"
      @click="loadPedidos"
    >
      <b-icon icon="arrow-repeat"></b-icon>
      Actualizar manualmente
    </b-button>
    <b-button :variant="variantPrimary" class="d-inline-block float-right ml-1">
      Cancelar
    </b-button>
    <b-button :variant="variantPrimary" class="d-inline-block float-right ml-1">
      Editar
    </b-button>
    <b-button :variant="variantPrimary" class="d-inline-block float-right ml-1">
      Agregar
    </b-button>
    <b-button :variant="variantPrimary" class="d-inline-block float-right ml-1">
      Atendido
    </b-button>
    <b-button :variant="variantPrimary" class="d-inline-block float-right ml-1">
      En Proceso
    </b-button>

    <b-table
      id="tableValidaOfertas"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataPedidos"
      head-variant="dark"
      class="mt-3"
      :class="variantThemeTableBody"
    >
      <template #cell(Fecha)="row">
        {{ utils.toDate(row.item.Fecha) }}
      </template>
      <template #cell(Hora)="row">
        {{ utils.toDate(row.item.Hora) }}
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
      fields: [
        'Pedido',
        'Sucursal',
        'Fecha',
        'Hora',
        'Estatus',
        'TransferenciaSalida',
        'TransferenciaEntrada',
        'Documento',
      ],
      options: [],
      selected: null,
      utils,
      updateEachTime: false,
    }
  },
  computed: {
    suc() {
      return this.$store.state.pedidos.sucursal
    },
    dataUser() {
      return this.$store.state.user.user
    },
    dataPedidos() {
      return this.$store.state.pedidos.dataPedidos.data
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    variantPrimary() {
      return this.$store.state.general.themesComponents.themeButtonPrimary
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
  },
  mounted() {
    this.setOptions()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'pedidos/setSucursal',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      updateDataPedidos: 'pedidos/updateDataPedidos',
    }),
    async loadPedidos() {
      const sucursal = this.getSucursal()
      if (sucursal === null) {
        this.showAlertDialog(['No se encontro la sucursal'])
        return false
      }
      this.setLoading(true)
      const isBodega = sucursal === 'BODEGA'
      const response = await this.updateDataPedidos([
        undefined,
        undefined,
        sucursal,
        isBodega,
      ])
      this.setLoading(false)
      if (!response.success) this.showAlertDialog([response.message])
    },
    getSucursal() {
      const sucursal = this.$store.state.pedidos.sucursal
      const sucursalesData = [
        { name: 'ZARAGOZA', alias: 'ZR' },
        { name: 'VICTORIA', alias: 'VC' },
        { name: 'OLUTA', alias: 'OU' },
        { name: 'JALTIPAN', alias: 'JL' },
        { name: 'BODEGA', alias: 'BO' },
        { name: 'ENRIQUEZ', alias: 'EN' },
        { name: 'SAYULA', alias: 'SA' },
        { name: 'SAYULAB', alias: 'SB' },
        { name: 'MAYOREO', alias: 'MA' },
        { name: 'SUPER', alias: 'SU' },
        { name: 'REPARTO', alias: 'RE' },
        { name: 'SUPER', alias: 'CO' },
      ]
      const sucFinded = sucursalesData.find((suc) => suc.alias === sucursal)
      if (!sucFinded) return null
      return sucFinded.name
    },
    selectSucursal(sucursal) {
      this.selected = sucursal
      this.setSucursal(sucursal)
    },
    setOptions() {
      const user = this.$store.state.user.user
      const sucSplited = user.sucursal_user.split(' ')
      const company =
        sucSplited[0].trim().toUpperCase() === 'CAASA' ? 'CAASA' : 'SPA'
      if (company === 'SPA') {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'ZR', text: 'Zaragoza' },
          { value: 'VC', text: 'Victoria' },
          { value: 'OU', text: 'Oluta' },
          { value: 'JL', text: 'Jaltipan' },
          { value: 'BO', text: 'Bodega' },
        ]
      } else {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'SU', text: 'Super' },
          { value: 'MA', text: 'Mayoreo' },
          { value: 'RE', text: 'Reparto' },
          { value: 'EN', text: 'Enriquez' },
          { value: 'SA', text: 'Sayula' },
          { value: 'SB', text: 'Sayula Bodega' },
        ]
      }
      const sucFinded = this.options.find((suc) => suc.value === this.selected)
      if (!sucFinded) this.selected = null
    },
  },
}
</script>
