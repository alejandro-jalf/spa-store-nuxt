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
      const data = [...this.$store.state.ventasporarticulo.data.data]
      return data
    },
    totalesRefactor() {
      const data = [...this.$store.state.ventasporarticulo.data.data]
      let total = 0
      const tipo =
        this.view === 'Piezas'
          ? 'VentasPza'
          : this.view === 'Cajas'
          ? 'VentasCja'
          : 'VentasValor'
      data.forEach((row) => {
        if (row.Articulo === this.article) total += row[`${tipo}`]
      })
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
      let conteo = value
      if (from !== 'total') {
        if (this.view === 'Piezas') conteo = value.VentasPza
        else if (this.view === 'Cajas') conteo = value.VentasCja
        else conteo = value.VentasValor
      }
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
