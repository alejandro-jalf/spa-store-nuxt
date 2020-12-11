<template>
  <div>
    <b-card
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
      :header="'Oferta abierta: ' + uuid"
      :title="tipoOferta + ' Del ' + fechaInico + ' al ' + fechaFin"
    >
      <b-card-text class="font-weight-bold mt-3 mb-1">
        Elija un articulo
      </b-card-text>
      <divider></divider>
      <b-form inline class="mt-2">
        <b-form-input
          id="codigo-articulo"
          placeholder="Codigo de articulo"
        ></b-form-input>
        <b-form-input
          id="codigo-barras"
          placeholder="Codigo de barras"
        ></b-form-input>
        <b-form-input
          id="nombre-articulo"
          placeholder="Nombre articulo"
        ></b-form-input>
      </b-form>
      <b-card-text class="font-weight-bold mb-1">
        Datos de la oferta
      </b-card-text>
      <divider class="mb-2"></divider>
      <div class="container-table">
        <b-table
          hover
          head-variant="dark"
          fixed
          outlined
          :items="listaProductos"
          :fields="fields"
          class="table-productos"
        >
          <template #cell(Acciones)="row">
            <b-button
              variant="warning"
              size="sm"
              class="mb-1"
              @click="row.toggleDetails"
            >
              <b-icon-pencil-square></b-icon-pencil-square>
            </b-button>
            <b-button variant="danger" size="sm" @click="row.toggleDetails">
              <b-icon-trash></b-icon-trash>
            </b-button>
          </template>
        </b-table>
      </div>
    </b-card>
  </div>
</template>

<script>
import { BIconPencilSquare, BIconTrash } from 'bootstrap-vue'
import Divider from './Divider'
// import { mapState } from 'vuex'

export default {
  components: {
    BIconPencilSquare,
    BIconTrash,
    Divider,
  },
  data() {
    return {
      fields: [
        'Articulo',
        'Nombre',
        'Costo',
        'Precio',
        'Utilidad',
        'Precio_Oferta',
        'Margen',
        'Acciones',
      ],
    }
  },
  computed: {
    listaProductos() {
      return this.$store.state.ofertas.ofertaActual.listaProductos
    },
    uuid() {
      return this.$store.state.ofertas.ofertaActual.uuid
    },
    tipoOferta() {
      return this.$store.state.ofertas.ofertaActual.tipoOferta
    },
    fechaInico() {
      return this.$store.state.ofertas.ofertaActual.fechaInico
    },
    fechaFin() {
      return this.$store.state.ofertas.ofertaActual.fechaFin
    },
    descripcion() {
      return this.$store.state.ofertas.ofertaActual.descripcion
    },
  },
  mounted() {
    // eslint-disable-next-line no-console
  },
}
</script>

<style scoped>
.container-table {
  overflow: auto;
}

.table-productos {
  min-width: 1000px;
}

#codigo-articulo,
#codigo-barras {
  width: 25%;
  margin-right: 2%;
  margin-bottom: 2%;
}

#nombre-articulo {
  width: 44%;
  margin-bottom: 2%;
}

@media screen and (max-width: 768px) {
  #codigo-articulo,
  #codigo-barras,
  #nombre-articulo {
    width: 100%;
    margin-right: 0px;
  }
}
</style>
