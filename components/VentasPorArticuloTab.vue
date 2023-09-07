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
      id="tablevXarticulo"
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
      <template #cell(Zaragoza)="row">
        {{ dataFormated(row.item.ZR) }}
      </template>
      <template #cell(Victoria)="row">
        {{ dataFormated(row.item.VC) }}
      </template>
      <template #cell(Enriquez)="row">
        {{ dataFormated(row.item.ER) }}
      </template>
      <template #cell(Oluta)="row">
        {{ dataFormated(row.item.OU) }}
      </template>
      <template #cell(Sayula)="row">
        {{ dataFormated(row.item.SY) }}
      </template>
      <template #cell(Jaltipan)="row">
        {{ dataFormated(row.item.JL) }}
      </template>
      <template #cell(Totales)="row">
        {{ dataFormated(row.item.Totales) }}
      </template>
      <template #foot(Fecha)>{{ 'Resumen' }}</template>
      <template #foot(Zaragoza)>
        {{ dataFormated(totalesRefactor.ZR, 'Total') }}
      </template>
      <template #foot(Victoria)>
        {{ dataFormated(totalesRefactor.VC, 'Total') }}
      </template>
      <template #foot(Enriquez)>
        {{ dataFormated(totalesRefactor.ER, 'Total') }}
      </template>
      <template #foot(Oluta)>
        {{ dataFormated(totalesRefactor.OU, 'Total') }}
      </template>
      <template #foot(Sayula)>
        {{ dataFormated(totalesRefactor.SY, 'Total') }}
      </template>
      <template #foot(Jaltipan)>
        {{ dataFormated(totalesRefactor.JL, 'Total') }}
      </template>
      <template #foot(Totales)>
        {{ dataFormated(totalesRefactor.Totales, 'Total') }}
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
      fields: [
        'Fecha',
        'Zaragoza',
        'Victoria',
        'Enriquez',
        'Oluta',
        'Sayula',
        'Jaltipan',
        'Totales',
      ],
      totales: {
        Fecha: 'Resumen',
        ZR: { Piezas: 0, Cajas: 0, Valor: 0 },
        VC: { Piezas: 0, Cajas: 0, Valor: 0 },
        ER: { Piezas: 0, Cajas: 0, Valor: 0 },
        OU: { Piezas: 0, Cajas: 0, Valor: 0 },
        SY: { Piezas: 0, Cajas: 0, Valor: 0 },
        JL: { Piezas: 0, Cajas: 0, Valor: 0 },
        Totales: { Piezas: 0, Cajas: 0, Valor: 0 },
      },
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      const datos = [...this.$store.state.ventasporarticulo.data.data]
      datos.forEach((dia, index) => {
        const cells = Object.keys(dia)
        cells.forEach((suc) => {
          if (dia[`${suc}`].Fail) {
            datos[index]._cellVariants = {}
            if (suc === 'ZR') datos[index]._cellVariants.Zaragoza = 'danger'
            else if (suc === 'VC')
              datos[index]._cellVariants.Victoria = 'danger'
            else if (suc === 'ER')
              datos[index]._cellVariants.Enriquez = 'danger'
            else if (suc === 'OU') datos[index]._cellVariants.Oluta = 'danger'
            else if (suc === 'SY') datos[index]._cellVariants.Sayula = 'danger'
            else if (suc === 'JL')
              datos[index]._cellVariants.Jaltipan = 'danger'
            else if (suc === 'SC')
              datos[index]._cellVariants.Victoria = 'danger'
          }
        })
      })
      return datos
    },
    totalesRefactor() {
      const data = [...this.$store.state.ventasporarticulo.data.data]
      const totales = {
        ZR: { Piezas: 0, Cajas: 0, Valor: 0 },
        VC: { Piezas: 0, Cajas: 0, Valor: 0 },
        ER: { Piezas: 0, Cajas: 0, Valor: 0 },
        OU: { Piezas: 0, Cajas: 0, Valor: 0 },
        SY: { Piezas: 0, Cajas: 0, Valor: 0 },
        JL: { Piezas: 0, Cajas: 0, Valor: 0 },
        Totales: { Piezas: 0, Cajas: 0, Valor: 0 },
      }
      data.forEach((row) => {
        Object.keys(row).forEach((suc) => {
          if (
            totales[`${suc}`] &&
            row[`${suc}`] &&
            row[`${suc}`][`${this.article}`]
          ) {
            totales[`${suc}`].Piezas += row[`${suc}`][`${this.article}`].Piezas
            totales[`${suc}`].Cajas += row[`${suc}`][`${this.article}`].Cajas
            totales[`${suc}`].Valor += row[`${suc}`][`${this.article}`].Valor
          }
        })
      })
      return totales
    },
  },
  mounted() {},
  methods: {
    dataFormated(value, from) {
      if (value === null || value === undefined || !value) return '-'
      if (value.Fail) return '!'
      const conteo = from === 'Total' ? value : value[`${this.article}`]
      if (!conteo) return '-'
      const comp = this.view === 'Valor' ? '$ ' : ''
      return (
        comp +
        this.utils.aplyFormatNumeric(this.utils.roundTo(conteo[`${this.view}`]))
      )
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
