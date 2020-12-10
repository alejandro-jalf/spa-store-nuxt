<template>
  <div>
    <b-card
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
      :header="'Oferta abierta:' + uuid"
      :title="tipoOferta + ' Del ' + fechaInico + ' al ' + fechaFin"
    >
      <b-dropdown-divider class="mt-2"></b-dropdown-divider>
      <b-card-text class="font-weight-bold">Elija un articulo</b-card-text>
      <b-container class="mb-3">
        <b-row>
          <b-col cols="3">
            <b-form-group
              label="Codigo de articulo"
              label-for="codigo-articulo"
            >
              <b-form-input
                id="codigo-articulo"
                placeholder="Articulo"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Codigo de barras" label-for="codigo-barras">
              <b-form-input
                id="codigo-barras"
                placeholder="Codigo"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="Nombre articulo" label-for="nombre">
              <b-form-input id="nombre" placeholder="Nombre"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <b-dropdown-divider class="mt-2"></b-dropdown-divider>
      <b-card-text class="font-weight-bold">Datos de la oferta</b-card-text>
      <b-table
        hover
        head-variant="dark"
        fixed
        outlined
        :items="listaProductos"
        :fields="fields"
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
    </b-card>
  </div>
</template>

<script>
import { BIconPencilSquare, BIconTrash } from 'bootstrap-vue'
// import { mapState } from 'vuex'

export default {
  components: {
    BIconPencilSquare,
    BIconTrash,
  },
  data() {
    return {
      fields: [
        'Sucursal',
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
