<template>
  <div>
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
  methods: {
    dataFormated(value, from) {
      if (value === null || value === undefined || !value) return '-'
      const conteo = from === 'Total' ? value : value[`${this.article}`]
      if (!conteo) return '-'
      return this.utils.aplyFormatNumeric(
        this.utils.roundTo(conteo[`${this.view}`])
      )
    },
  },
}
</script>
