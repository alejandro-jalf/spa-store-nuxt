<template>
  <div>
    <div class="containerInp">
      <b-input-group prepend="Suc">
        <b-form-select
          v-model="selected"
          :options="options"
          :disabled="!accessChangeSucursal"
          @change="changeSuc"
        ></b-form-select>
      </b-input-group>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Fecha Corte">
        <b-form-datepicker
          id="dateEnd"
          v-model="dateEnd"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de Corte"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button variant="info">
      <b-icon icon="search" />
      Buscar
    </b-button>

    <div class="content-titles">
      <img id="imgLogoSpa" class="imgLogo" src="@/assets/cesta.png" />
      <h4 class="mt-3">Reporte de Reposiciones de Compras</h4>
      <h5>Super Promociones de Acayucan</h5>
      <div>Detalle de Suc. Oluta Al 27/12/2022</div>
    </div>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  data() {
    return {
      selected: 'ZR',
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'TF', text: 'Tortilleria Acayucan F.', disabled: true },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'TY', text: 'Sayula Tortilleria', disabled: true },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
  },
  mounted() {
    this.setSucursalForUser()
  },
  methods: {
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        this.selected = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        // this.setSucursal(sucursalUser)
      }
    },
    getOptionBySucursal(sucursal = 'Zaragoza') {
      sucursal = sucursal.trim().toUpperCase()
      if (sucursal === 'ZARAGOZA') return 'ZR'
      if (sucursal === 'VICTORIA') return 'VC'
      if (sucursal === 'ENRIQUEZ') return 'ER'
      if (sucursal === 'TORTILLERIAF') return 'TF'
      if (sucursal === 'OLUTA') return 'OU'
      if (sucursal === 'SAYULA') return 'SY'
      if (sucursal === 'SAYULAT') return 'TY'
      if (sucursal === 'JALTIPAN') return 'JL'
      if (sucursal === 'BODEGA') return 'BO'
      return 'SPAZARAGOZA'
    },
  },
}
</script>

<style scoped>
.content-titles {
  text-align: left;
  height: max-content;
  min-height: 100px;
}

.imgLogo {
  width: 100px;
  height: 100px;
  float: left;
  margin-right: 40px;
}

.canvasLogo {
  position: fixed;
  top: 100px;
  left: -250px;
  z-index: 11;
}

.containerInp {
  display: inline-block;
  margin-top: 7px;
}

@media screen and (max-width: 1000px) {
  .containerInp {
    display: block;
  }
}
</style>
