<template>
  <b-table
    hover
    head-variant="dark"
    :items="listArticulosrefactor"
    :fields="fields"
    class="darkThemeTable"
    responsive
  >
    <template #cell(Acciones)="row">
      <b-button size="sm" class="mb-1" @click="showDetails(row.item.Articulo)">
        Detalles
      </b-button>
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    listArticulos: {
      type: Array,
      required: true,
    },
    showDetails: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        'Articulo',
        'Codigo',
        'Nombre',
        'Relacion',
        'SubFamilia',
        'DescSubfamilia',
        'Acciones',
      ],
    }
  },
  computed: {
    listArticulosrefactor() {
      let arrayAticulos = []
      if (this.listArticulos) {
        arrayAticulos = this.listArticulos.reduce((acumArticulo, articulo) => {
          const art = {
            Articulo: articulo.Articulo,
            Codigo: articulo.CodigoBarras,
            Nombre: articulo.Nombre,
            Relacion: articulo.Relacion,
            SubFamilia: articulo.Subfamilia,
            DescSubfamilia: articulo.DescSubfamila,
          }
          acumArticulo.push(art)
          return acumArticulo
        }, [])
      }
      return arrayAticulos
    },
  },
}
</script>

<style scoped>
.darkThemeTable {
  background: rgb(182, 182, 182);
}
</style>
