<template>
  <div class="bg-container-details">
    <b-card
      class="card-details"
      :class="variantTheme"
      header="Detalles de oferta"
      header-text-variant="light"
      header-bg-variant="info"
      border-variant="info"
    >
      <b-icon
        class="close-btn"
        icon="x-circle-fill"
        @click="closeDetails"
      ></b-icon>
      <div class="containerDetails">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md">
              <span class="font-weight-bold">Sucursal:</span>
              {{ articleActual.Suc }}
              <hr class="p-0" />
              <span class="font-weight-bold">Articulo:</span>
              {{ articleActual.Articulo }}
              <hr class="p-0" />
              <span class="font-weight-bold">Codigo de barras:</span>
              {{ articleActual.CodigoBarras }}
              <hr class="p-0" />
              <span class="font-weight-bold">Nombre:</span>
              {{ articleActual.Nombre }}
              <hr class="p-0" />
              <span class="font-weight-bold">Precio de Oferta:</span>
              {{ articleActual.PrecioOferta }}
              <hr class="p-0" />
              <span class="font-weight-bold">Utilidad de Oferta:</span>
              {{ articleActual.UtilidadOferta }}
              <hr class="p-0" />
              <div :class="UtilidadValida(articleActual.OfertaValida)">
                <span class="font-weight-bold">Es valida la oferta:</span>
                {{ articleActual.OfertaValida }}
              </div>
              <hr class="p-0" />
              <span class="font-weight-bold">Descuento:</span>
              {{ articleActual.Descuento }}
              <hr class="p-0" />
              <span class="font-weight-bold">Ultimo Costo:</span>
              {{ articleActual.UltimoCosto }}
              <hr class="p-0" />
              <span class="font-weight-bold">Precio 1:</span>
              {{ articleActual.Precio1IVAUV }}
              <hr class="p-0" />
            </div>
            <div class="col-md">
              <span class="font-weight-bold">Utilidad Venta:</span>
              {{ articleActual.UtilidadVenta }}
              <hr class="p-0" />
              <div :class="UtilidadValida(articleActual.Precio1Valido)">
                <span class="font-weight-bold">Es valido precio 1:</span>
                {{ articleActual.Precio1Valido }}
              </div>
              <hr class="p-0" />
              <span class="font-weight-bold">Caduca la Oferta:</span>
              {{ articleActual.OfertaCaduca }}
              <hr class="p-0" />
              <span class="font-weight-bold">Fecha de Inicio:</span>
              {{ utils.parseFecha(invierteFecha(articleActual.FechaInicial)) }}
              <hr class="p-0" />
              <span class="font-weight-bold">Fecha de Termino:</span>
              {{ utils.parseFecha(invierteFecha(articleActual.FechaFinal)) }}
              <hr class="p-0" />
              <span class="font-weight-bold">Disponibles:</span>
              {{ articleActual.Disponible }}
              <hr class="p-0" />
              <span class="font-weight-bold">Limite de Oferta:</span>
              {{ articleActual.Limite }}
              <hr class="p-0" />
              <span class="font-weight-bold">Limite por Venta:</span>
              {{ articleActual.LimiteXVenta }}
              <hr class="p-0" />
              <span class="font-weight-bold">Nivel de Precio:</span>
              {{ articleActual.NivelPrecio }}
              <hr class="p-0" />
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  name: 'ValidaOfertasDetails',
  props: {
    articleActual: {
      required: true,
      type: Object,
    },
    closeDetails: {
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
      const themeCardBody =
        this.$store.state.general.themesComponents.themeCard2Body
      return themeCardBody === 'containerCard' ? '' : themeCardBody
    },
  },
  methods: {
    UtilidadValida(response) {
      return response === 'NO' ? `color-danger` : `color-success`
    },
    invierteFecha(date = '00/00/0000') {
      return date.slice(6) + '-' + date.slice(3, 5) + '-' + date.slice(0, 2)
    },
  },
}
</script>

<style scoped>
.card-details {
  height: 100%;
  position: relative;
}

.containerDetails {
  height: 100%;
  overflow: auto;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 33px;
  cursor: pointer;
  color: #fff;
}

.close-btn:hover {
  top: 9px;
  right: 9px;
  font-size: 35px;
  cursor: pointer;
  color: #fff;
}

.bg-container-details {
  position: fixed;
  height: 100%;
  width: 100%;
  padding: 3%;
  top: 0px;
  left: 0px;
  background: rgba(80, 78, 78, 0.384);
  z-index: 11;
}

.color-danger {
  background: rgb(255, 216, 216);
  color: #000;
}

.color-success {
  background: rgb(167, 255, 156);
  color: #000;
}
</style>
