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
      :items="items"
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
        'Tipo_oferta',
        'Fecha_inicio',
        'Fecha_termino',
        'Descripcion',
        'Acciones',
      ],
      items: [
        {
          Tipo_oferta: 'Sigma',
          Fecha_inicio: '03/12/2020',
          Fecha_termino: '07/12/2020',
          Descripcion: 'Ofertas de sigma',
        },
        {
          Tipo_oferta: 'Fin de semana',
          Fecha_inicio: '07/11/2020',
          Fecha_termino: '010/11/2020',
          Descripcion: 'Ofertas de fin de semana',
        },
        {
          Tipo_oferta: 'Sigma',
          Fecha_inicio: '01/11/2020',
          Fecha_termino: '07/11/2020',
          Descripcion: 'Ofertas de sigma',
        },
        {
          Tipo_oferta: 'Sigma',
          Fecha_inicio: '28/10/2020',
          Fecha_termino: '31/10/2020',
          Descripcion: 'Ofertas de sigma',
        },
        {
          Tipo_oferta: 'Sigma',
          Fecha_inicio: '28/10/2020',
          Fecha_termino: '02/11/2020',
          Descripcion: 'Ofertas de sigma',
        },
      ],
    }
  },
}
</script>
