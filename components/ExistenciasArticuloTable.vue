<template>
  <b-table
    hover
    head-variant="dark"
    :items="listArticulosrefactor"
    :fields="fields"
    :class="variantThemeTableBody"
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
    variantThemeTableBody() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeTableBody'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeTableBody'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeItemList'
      else return ''
    },
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
