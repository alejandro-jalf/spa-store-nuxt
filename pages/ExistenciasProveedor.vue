<template>
  <div>
    <h3 class="text-center py-3">Existencias Por Proveedor</h3>
    <b-input-group prepend="Sucursal" class="mb-3 w-100">
      <b-form-select
        :value="sucursalSelected"
        :options="options"
        class="w-150"
        @change="selectSucursal"
      ></b-form-select>
    </b-input-group>
    <b-input-group prepend="Proveedor" class="mb-0 w-100">
      <b-form-input
        v-model="proveedor"
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
        @click="updateProviders"
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
            {{ prov.Nombre }}
          </div>
        </div>
      </b-card>
    </div>

    <b-button variant="info" class="mt-3 mb-3" @click="loadData">
      <b-icon icon="search" />
      Buscar Existencias
    </b-button>

    <b-container fluid="xl">
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
      outlined
      responsive
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataExistencias"
      :class="variantThemeTableBody"
      class="pt-4"
    >
      <template #cell(ExistenciaActualRegular)="row">
        {{ formatNumber(row.item.ExistenciaActualRegular) }}
      </template>
      <template #cell(ExistenciaActualUC)="row">
        {{ formatNumber(row.item.ExistenciaActualUC) }}
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
      perPage: 15,
      pageOptions: [5, 10, 15, 20, 50, 100],
      currentPage: 1,
      // fields: ['Suc', 'Articulo', 'Nombre', 'Relacion', 'ExistenciaActualRegular', 'ExistenciaActualUC'],
      fields: [
        { key: 'Suc', label: 'Sucursal', sortable: false },
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Relacion', label: 'Relacion', sortable: true },
        { key: 'ExistenciaActualRegular', label: 'Exist. UV', sortable: true },
        { key: 'ExistenciaActualUC', label: 'Exist. UC', sortable: true },
      ],
      sucursalSelected: this.$store.state.existenciasproveedor.sucursal,
      options: [
        { value: '', text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
        { value: 'ALL', text: 'Todas' },
      ],
      proveedor: '',
      visibleCard: false,
      loadingTable: false,
    }
  },
  computed: {
    findProviders() {
      const text = this.proveedor
      const expr = new RegExp(text.toUpperCase().replace(' ', '.*'))
      return this.$store.state.existenciasproveedor.providers.data.filter(
        (proveedor) => expr.test(proveedor.Nombre.toUpperCase())
      )
    },
    proveedores() {
      return this.$store.state.existenciasproveedor.providers.data
    },
    animationTable() {
      return this.loadingTable ? 'spin-pulse' : ''
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    rows() {
      return this.$store.state.existenciasproveedor.data.data.length
    },
    dataExistencias() {
      console.log(this.$store.state.existenciasproveedor.data)
      const resumen = this.$store.state.existenciasproveedor.data.resumen
      const datos = []
      if (resumen && resumen.length !== 0) {
        const offline = this.$store.state.existenciasproveedor.data.data.filter(
          (exist) => exist.Nombre === 'Offline'
        )
        resumen.forEach((existencia) => {
          const data = { ...existencia }
          data.Suc = 'ALL'
          if (data.ExistenciaActualRegular === 0) data._rowVariant = 'warning'
          if (data.Nombre === 'Offline') data._rowVariant = 'danger'
          datos.push(data)
        })
        datos.push(...offline)
      } else {
        this.$store.state.existenciasproveedor.data.data.forEach(
          (existencia) => {
            const data = { ...existencia }
            if (data.ExistenciaActualRegular === 0) data._rowVariant = 'warning'
            if (data.Nombre === 'Offline') data._rowVariant = 'danger'
            datos.push(data)
          }
        )
      }
      return datos
    },
  },
  mounted() {
    this.proveedor = this.$store.state.existenciasproveedor.provider.Nombre
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'existenciasproveedor/setSucursal',
      setProvider: 'existenciasproveedor/setProvider',
    }),
    ...mapActions({
      changeData: 'existenciasproveedor/changeData',
      loadProveedores: 'existenciasproveedor/loadProveedores',
    }),
    formatNumber(value) {
      if (value === 'Offline') return value
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    selectSucursal(suc) {
      this.setSucursal(suc)
    },
    selectProvider(prov) {
      this.visibleCard = false
      this.setProvider(prov)
      this.proveedor = prov.Nombre
    },
    async updateProviders() {
      this.loadingTable = true
      const response = await this.loadProveedores()
      this.loadingTable = false
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    async loadData() {
      const sucursal = this.$store.state.existenciasproveedor.sucursal
      const proveedor =
        this.$store.state.existenciasproveedor.provider.Proveedor
      this.setLoading(true)
      const response = await this.changeData([sucursal, proveedor])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
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
</style>
