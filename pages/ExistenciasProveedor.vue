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
        placeholder="Proveedor"
        type="search"
        @focus="visibleCard = true"
      ></b-form-input>
      <b-button
        v-b-tooltip.hover
        variant="light"
        size="sm"
        title="Este boton refresca la lista de proveedores"
      >
        <b-icon icon="arrow-clockwise"></b-icon>
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
    <b-table></b-table>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
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
  },
  methods: {
    ...mapMutations({
      setSucursal: 'existenciasproveedor/setSucursal',
    }),
    selectSucursal(suc) {
      this.setSucursal(suc)
    },
    selectProvider(prov) {
      this.proveedor = prov.Nombre
      this.visibleCard = false
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
