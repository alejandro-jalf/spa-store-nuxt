<template>
  <div>
    <div class="px-3 pb-3">
      <div class="font-weight-bold">Metodos de ordenacion</div>
      <div class="line-buttons bg-info"></div>
      <b-input-group prepend="Ordenar Por">
        <b-form-select v-model="selected" :options="options"></b-form-select>
        <template #append>
          <b-form-select
            v-model="descAsc"
            :options="optionsDescAsc"
          ></b-form-select>
        </template>
      </b-input-group>
    </div>
    <b-table
      hover
      head-variant="dark"
      :items="listArticulosrefactor"
      :fields="fields"
      :class="variantThemeTableBody"
      responsive
    >
      <template #cell(Acciones)="row">
        <b-button
          size="sm"
          class="mb-1"
          @click="showDetails(row.item.Articulo)"
        >
          Detalles
        </b-button>
      </template>
    </b-table>
  </div>
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
      options: [
        { value: 'Articulo', text: 'Articulo' },
        { value: 'Codigo', text: 'Codigo de barras' },
        { value: 'Nombre', text: 'Nombre' },
        { value: 'SubFamilia', text: 'SubFamilia' },
      ],
      selected: 'Articulo',
      optionsDescAsc: [
        { value: 'Ascendente', text: 'Ascendente' },
        { value: 'Descendente', text: 'Descendente' },
      ],
      descAsc: 'Descendente',
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    listArticulosrefactor() {
      const ordenarPor = this.selected
      const ascendente = this.descAsc === 'Ascendente' ? -1 : 1
      let arrayAticulos = []
      if (this.listArticulos) {
        arrayAticulos = this.listArticulos
          .reduce((acumArticulo, articulo) => {
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
          .sort((a, b) =>
            a[ordenarPor] < b[ordenarPor] ? -ascendente : ascendente
          )
      }
      return arrayAticulos
    },
  },
}
</script>

<style scoped>
.line-buttons {
  margin-bottom: 20px;
  width: calc(100% - 5px);
  margin-left: 5px;
  height: 1px;
  margin-top: -1px;
}

.container-filters {
  background: rgb(255, 144, 144);
  padding: 10px;
}
</style>
