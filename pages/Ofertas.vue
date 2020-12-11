<template>
  <div>
    <h1 class="text-center">Programacion de ofertas</h1>
    <b-button variant="success" class="mb-3">
      <b-icon-folder-plus></b-icon-folder-plus>
      Programar nueva oferta
    </b-button>
    <oferta-form class="pt-2 pb-2"></oferta-form>
    <oferta-lista class="pb-2"></oferta-lista>
    <div class="container-table-ofe">
      <b-table
        hover
        head-variant="dark"
        fixed
        outlined
        :items="listaOfertas"
        :fields="fields"
        class="table-ofertas"
      >
        <template #cell(Acciones)="row">
          <b-button size="sm" class="mr-2" @click="row.toggleDetails">
            Details
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { BIconFolderPlus } from 'bootstrap-vue'
import OfertaForm from '../components/OfertaForm'
import OfertaLista from '../components/OfertaLista'

export default {
  components: {
    OfertaForm,
    OfertaLista,
    BIconFolderPlus,
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

<style scoped>
.container-table-ofe {
  overflow: auto;
  margin-bottom: 30px;
}

.table-ofertas {
  min-width: 990px;
}
</style>
