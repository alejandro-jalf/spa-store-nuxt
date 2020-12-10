<template>
  <div>
    <b-card
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
      header="Ofertas de Sigma del 10/12/2020 al 15/12/2020"
    >
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
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log('Datos:', this.$store.state.ofertas.ofertaActual)
  },
}
</script>
