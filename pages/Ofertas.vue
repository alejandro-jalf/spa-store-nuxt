<template>
  <div>
    <h1 class="text-center">Programacion de ofertas</h1>
    <oferta-form class="pt-2 pb-2"></oferta-form>
    <oferta-lista class="pb-2"></oferta-lista>
    <b-table
      hover
      head-variant="dark"
      fixed
      outlined
      :items="listaOfertas"
      :fields="fields"
    >
      <template #cell(Acciones)="row">
        <b-button size="sm" class="mr-2" @click="row.toggleDetails">
          Details
        </b-button>
      </template>
    </b-table>
  </div>
</template>
<script>
import OfertaForm from '../components/OfertaForm'
import OfertaLista from '../components/OfertaLista'

export default {
  components: {
    OfertaForm,
    OfertaLista,
  },
  data() {
    return {
      fields: [
        'uuid',
        'tipoOferta',
        'fechaInico',
        'fechaFin',
        'descripcion',
        'Acciones',
      ],
    }
  },
  computed: {
    listaOfertas() {
      return Object.values(this.$store.state.ofertas.listaOfertas)
    },
  },
}
</script>
