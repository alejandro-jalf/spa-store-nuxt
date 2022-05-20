<template>
  <div class="bg-container-details">
    <b-card
      class="card-details"
      :class="variantTheme"
      header="Detalles de articulo"
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
              <span class="font-weight-bold">Articulo:</span>
              {{ articleActual.Articulo }}
              <Divider class="my-3" />
              <span class="font-weight-bold">Nombre:</span>
              {{ articleActual.Nombre }}
              <Divider class="my-3" />
              <span class="font-weight-bold">Relacion:</span>
              {{ articleActual.Relacion }}
              <Divider class="my-3" />
              <span class="font-weight-bold">Existencia Actual:</span>
              {{ dataNumberForNull(articleActual.ExistenciaActualRegular) }}
              <Divider class="my-3" />
              <span class="font-weight-bold">Ultimo Costo:</span>
              {{ dataNumberForNull(articleActual.UltimoCosto) }}
              <Divider class="mt-3" />
              <div :class="aplyColor(1)">
                <span class="font-weight-bold">Precio 1 con IVA:</span>
                {{ dataNumberForNull(articleActual.Precio1IVAUV) }}
              </div>
              <Divider />
              <div :class="aplyColor(1)">
                <span class="font-weight-bold">Utilidad para Precio 1:</span>
                {{ dataPercentageForNull(articleActual.Utilidad1) }}
              </div>
              <Divider class="mb-3" />
            </div>
            <div class="col-md">
              <div :class="aplyColor(1) + 'mt-0 mb-3'">
                <span class="font-weight-bold">Cantidad Para Precio 1:</span>
                {{ dataNumberForNull(articleActual.CantidadParaPrecio1) }}
              </div>
              <Divider />
              <div :class="aplyColor(2)">
                <span class="font-weight-bold">Precio 2 con IVA:</span>
                {{ dataNumberForNull(articleActual.Precio2IVAUV) }}
              </div>
              <Divider />
              <div :class="aplyColor(2)">
                <span class="font-weight-bold">Utilidad para Precio 2:</span>
                {{ dataPercentageForNull(articleActual.Utilidad2) }}
              </div>
              <Divider />
              <div :class="aplyColor(2)">
                <span class="font-weight-bold">Cantidad Para Precio 2:</span>
                {{ dataNumberForNull(articleActual.CantidadParaPrecio2) }}
              </div>
              <Divider />
              <div :class="aplyColor(3)">
                <span class="font-weight-bold">Precio 3 con IVA:</span>
                {{ dataNumberForNull(articleActual.Precio3IVAUV) }}
              </div>
              <Divider />
              <div :class="aplyColor(3)">
                <span class="font-weight-bold">Utilidad para Precio 3:</span>
                {{ dataPercentageForNull(articleActual.Utilidad3) }}
              </div>
              <Divider />
              <div :class="aplyColor(3)">
                <span class="font-weight-bold">Cantidad Para Precio 3:</span>
                {{ dataNumberForNull(articleActual.CantidadParaPrecio3) }}
              </div>
              <Divider class="mb-3" />
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import utils from '../modules/utils'
import Divider from './Divider'

export default {
  name: 'ValidaOfertasDetails',
  components: { Divider },
  props: {
    articleActual: {
      required: true,
      type: Object,
    },
    closeDetails: {
      required: true,
      type: Function,
    },
    dataNumberForNull: {
      required: true,
      type: Function,
    },
    dataPercentageForNull: {
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
      const themeCardBody = this.$store.state.general.themesComponents
        .themeCard2Body
      return themeCardBody === 'containerCard' ? '' : themeCardBody
    },
  },
  methods: {
    aplyColor(nivelPrecio) {
      switch (nivelPrecio) {
        case 1:
          if (
            this.articleActual.Utilidad1 !== null &&
            this.articleActual.Utilidad1 < this.articleActual.UtilidadMinima
          )
            return 'color-danger marcador1 py-3'
          return 'py-3'
        case 2:
          if (
            this.articleActual.Utilidad2 !== null &&
            this.articleActual.Utilidad2 < this.articleActual.UtilidadMinima
          )
            return 'color-danger marcador2 py-3'
          return 'py-3'
        case 3:
          if (
            this.articleActual.Utilidad3 !== null &&
            this.articleActual.Utilidad3 < this.articleActual.UtilidadMinima
          )
            return 'color-danger marcador3 py-3'
          return 'py-3'
      }
    },
  },
}
</script>

<style scoped>
.marcador1 {
  border-bottom: 3px solid rgb(57, 189, 1);
}

.marcador2 {
  border-bottom: 3px solid rgb(173, 0, 0);
}

.marcador3 {
  border-bottom: 3px solid rgb(255, 0, 225);
}
.card-details {
  height: max-content;
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

@media screen and (max-width: 768px) {
  .card-details {
    height: 100%;
  }
}
</style>
