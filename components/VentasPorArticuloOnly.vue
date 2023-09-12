<template>
  <div>
    <div class="container-data">
      <span>{{ dataArticle.Articulo }}</span>
      <span class="dividerSlash">/</span>
      <span>{{ dataArticle.Nombre }}</span>
      <span class="dividerSlash">/</span>
      <span>{{ '[' + dataArticle.Relacion + ']' }}</span>
      <span class="dividerSlash">/</span>
      <span v-if="view === 'Cajas'" class="existence">
        Existencia Actual UC
        {{ formatedExistences(dataArticle.ExistenciaActualUC) }}
      </span>
      <span v-else-if="view === 'Piezas'" class="existence">
        Existencia Actual UV
        {{ formatedExistences(dataArticle.ExistenciaActual) }}
      </span>
      <span v-else class="existence">
        Existencia Costo $
        {{ formatedExistences(dataArticle.CostoExistenciaNeto) }}
      </span>
    </div>
    <b-table
      id="tablevXarticuloOnly"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="mt-3"
      :class="variantThemeTableBody"
      foot-clone
    >
      <template #cell(Fecha)="row">
        {{ row.item.Fecha }}
      </template>
      <template #cell(Cantidad)="row">
        {{ dataFormated(row.item) }}
      </template>
      <template #cell(Articulo)> {{ dataArticle.Articulo }} </template>
      <template #cell(Nombre)> {{ dataArticle.Nombre }} </template>
      <template #cell(Relacion)> {{ dataArticle.Relacion }} </template>
      <template #foot(Fecha)> {{ totalesRefactor.Fecha }} </template>
      <template #foot(Articulo)> {{ totalesRefactor.Articulo }} </template>
      <template #foot(Nombre)> {{ totalesRefactor.Nombre }} </template>
      <template #foot(Relacion)> {{ totalesRefactor.Relacion }} </template>
      <template #foot(Cantidad)>
        {{ dataFormated(totalesRefactor.Cantidad, 'total') }}
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  props: {
    utils: {
      type: Object,
      required: true,
    },
    article: {
      type: String,
      required: true,
    },
    dataArticle: {
      type: Object,
      required: true,
    },
    view: {
      default: 'Piezas',
      type: String,
      required: false,
    },
  },
  data() {
    return {
      fields: ['Fecha', 'Articulo', 'Nombre', 'Relacion', 'Cantidad'],
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      const datos = [...this.$store.state.ventasporarticulo.data.data]
      return datos
    },
    totalesRefactor() {
      const totales = this.$store.state.ventasporarticulo.data.Totales
      const total = totales[`${this.article}`][`${this.view}`]
      return {
        Fecha: 'Total',
        Articulo: '',
        Nombre: '',
        Relacion: '',
        Cantidad: total,
      }
    },
  },
  methods: {
    dataFormated(value, from) {
      if (value === null || value === undefined || !value) return '-'
      let conteo = from === 'total' ? value : value[`${this.article}`]
      if (!conteo) return '-'
      if (from !== 'total') conteo = value[`${this.article}`][`${this.view}`]
      const comp = this.view === 'Valor' ? '$ ' : ''
      return comp + this.utils.aplyFormatNumeric(this.utils.roundTo(conteo))
    },
    dateFormat(date) {
      const moment = this.utils.toMoment(
        date.replaceAll('T', ' ').replaceAll('Z', '')
      )
      return moment.format('DD-MM-YYYY')
    },
    formatedExistences(value) {
      if (value === null || value === undefined || !value) return '-'
      return this.utils.aplyFormatNumeric(this.utils.roundTo(value))
    },
  },
}
</script>

<style scoped>
.container-data {
  display: inline-block;
  top: 10px;
  left: 20px;
  z-index: 9;
  border-radius: 10px;
  padding: 8px 14px;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(6, 97, 93);
  color: black;
}

.dividerSlash {
  margin: 0px 10px;
  color: brown;
}

.existence {
  font-weight: bold;
  font-style: italic;
  color: darkgreen;
}
</style>
