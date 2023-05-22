<template>
  <div class="containerRevision">
    <h4 class="text-center">Revision de Costos</h4>
    <div class="siteLeft">
      <b-input-group prepend="Suc" size="sm" class="w-100 mb-3">
        <b-form-select
          :value="sucursal"
          :options="options"
          :disabled="!accessChangeSucursal"
          @change="selectSucursal"
        ></b-form-select>
      </b-input-group>
      <b-form-group label="Tienda:" label-for="tienda">
        <b-form-input
          id="tienda"
          v-model="tienda"
          type="text"
          required
          :class="backgroundInputTheme"
          readonly
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Almacen:" label-for="almacen">
        <b-form-input
          id="almacen"
          v-model="almacen"
          type="text"
          required
          :class="backgroundInputTheme"
          readonly
        ></b-form-input>
      </b-form-group>
      <b-calendar
        v-model="dia"
        locale="es-mx"
        label-today="Hoy"
        label-selected="Seleccione dia"
        label-current-month="Mes Actual"
        label-next-month="Siguiente Mes"
        label-prev-month="Mes Anterior"
        label-next-year="Siguiente Año"
        label-prev-year="Año Anterior"
        label-no-date-selected="Seleccione una Fecha"
        label-help="Use el cursor para navegar entre las fechas"
      />
      <b-button block variant="info" class="mt-3" size="sm">Buscar</b-button>
    </div>
    <div class="siteRight">
      <b-table
        hover
        small
        head-variant="dark"
        outlined
        responsive
        :fields="fields"
        :items="dataCostos"
        :class="variantThemeTableBody"
        class="mt-0"
      >
        <template #cell(ExistenciaActualRegular)="row">
          {{ formatNumber(row.item.ExistenciaActualRegular) }}
        </template>
        <template #cell(ExistenciaActualUC)="row">
          {{ formatNumber(row.item.ExistenciaActualUC) }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  data() {
    return {
      sucursal: 'ZR',
      tienda: 0,
      almacen: 0,
      dia: '',
      fields: [
        'Fecha',
        'Documento',
        'Articulo',
        'Nombre',
        'CostoUnitario',
        'UltimoCosto',
        'Diferencia',
      ],
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
    }
  },
  computed: {
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    dataCostos() {
      return []
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
  },
  mounted() {
    this.setSucursalForUser()
  },
  methods: {
    selectSucursal(suc) {
      console.log(suc, this.sucursal)
      this.tienda = utils.getTiendaBySuc(suc)
      this.almacen = utils.getAlmacenBySuc(suc)
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.sucursal = sucUser
        this.selectSucursal(sucUser)
      }
    },
  },
}
</script>

<style scoped>
.containerRevision {
  position: relative;
}

.siteLeft {
  position: absolute;
  left: 0px;
  width: 270px;
}

#sucursal,
#tienda,
#almacen {
  background: #fff;
  color: black;
  height: 30px;
}

.siteRight {
  display: inline-block;
  margin-left: 290px;
  background: rgb(149, 240, 186);
  width: calc(100% - 410px);
}
</style>
