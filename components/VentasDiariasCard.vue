<template>
  <div>
    <b-card :class="variantTheme">
      <div class="container-col">
        <h6 class="pb-0 mt-3 color-success">
          <span class="font-weight-bold">Venta Total:</span>
          {{ dataFormated(sucursal.VentaTotal) }}
          <Divider />
        </h6>

        <div class="h6">
          <span class="font-weight-bold">Costo Total:</span>
          {{ dataFormated(sucursal.CostoTotal) }}
          <Divider />
        </div>
        <div class="h6">
          <span class="font-weight-bold">Utilidad Total:</span>
          {{ dataFormated(sucursal.UtilidadTotal) }}
          <Divider />
        </div>
        <div class="h6">
          <span class="font-weight-bold">Utilidad Porcentual:</span>
          {{
            utils.parseToPorcent(
              utils.roundTo(sucursal.UtilidadPorcentual),
              4,
              true
            ) + ' %'
          }}
          <Divider />
        </div>
        <div class="h6">
          <span class="font-weight-bold">Unidades Vendidas:</span>
          {{ dataFormated(sucursal.UnidadesVendidas) }}
          <Divider />
        </div>
      </div>
      <div class="container-col">
        <div class="h6">
          <span class="font-weight-bold">Tickets Totales:</span>
          {{ dataFormated(sucursal.TicketsTotales) }}
          <Divider />
        </div>
        <div class="h6">
          <span class="font-weight-bold">Mejor Ticket:</span>
          {{ dataFormated(sucursal.MejorTicket) }}
          <Divider />
        </div>
        <div class="h6">
          <span class="font-weight-bold">Peor Ticket:</span>
          {{ dataFormated(sucursal.PeorTicket) }}
          <Divider />
        </div>
        <div class="h6">
          <span class="font-weight-bold">Ticket Promedio:</span>
          {{ dataFormated(sucursal.TicketPromedio) }}
          <Divider />
        </div>
      </div>
      <div class="sucursal">{{ isResume }}</div>
    </b-card>
  </div>
</template>

<script>
import Divider from '../components/Divider'
import utils from '../modules/utils'

export default {
  components: {
    Divider,
  },
  props: {
    sucursal: {
      required: true,
      type: Object,
    },
    showDetails: {
      required: true,
      type: Function,
    },
    dataFormated: {
      required: true,
      type: Function,
    },
  },
  data() {
    return {
      utils,
    }
  },
  computed: {
    variantTheme() {
      const valida =
        this.sucursal.Fecha === 'Resumen de Ventas' ? 'color-dark' : ''
      const themeCardBody =
        this.$store.state.general.themesComponents.themeCard2Body
      return themeCardBody === 'containerCard'
        ? valida
        : `${themeCardBody} ${valida}`
    },
    isResume() {
      return this.sucursal.Fecha === 'Resumen de Ventas'
        ? this.sucursal.Fecha
        : utils.toDate(this.sucursal.Fecha)
    },
  },
}
</script>

<style scoped>
.container-col {
  display: inline-block;
  width: 48%;
  margin-right: 1%;
}

.sucursal {
  position: absolute;
  top: 1px;
  right: 1px;
  padding: 5px;
  background: rgb(2, 185, 155);
  color: #fff;
  border-radius: 0px 3px 0px 5px;
}

.color-success {
  background: rgb(167, 255, 156);
  color: #000;
}

.color-dark {
  background: rgb(41, 41, 41);
  color: rgb(255, 255, 255);
}

@media screen and (max-width: 540px) {
  .container-col {
    width: 100%;
    margin-right: 0px;
  }
}
</style>
