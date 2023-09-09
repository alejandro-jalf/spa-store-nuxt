<template>
  <div>
    <h4>Existencia Actual</h4>
    <b-table
      id="tablevXarticulo"
      responsive
      striped
      hover
      :fields="fieldsVisibles"
      :items="dataRefactor"
      head-variant="dark"
      class="mt-3"
      :class="variantThemeTableBody"
    >
      <template #cell(Articulo)="row">
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
        'Articulo',
        'Zaragoza',
        'Victoria',
        'Enriquez',
        'Oluta',
        'Sayula',
        'Jaltipan',
        'Total',
      ],
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    fieldsVisibles() {
      const sucsVisibles = [...this.$store.state.ventasporarticulo.sucursales]
      const sucsAviables = [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
      ]
      const fields = sucsAviables.reduce(
        (headers, item) => {
          const sucFinded = sucsVisibles.find((suc) => suc === item.value)
          if (sucFinded) headers.push(item.text)
          return headers
        },
        ['Articulo']
      )
      fields.push('Total')
      return fields
    },
    dataRefactor() {
      const exist = { ...this.$store.state.ventasporarticulo.data.Existencias }
      const sucsVisibles = [...this.$store.state.ventasporarticulo.sucursales]
      const allSucs = ['ZR', 'VC', 'ER', 'OU', 'SY', 'JL']
      const onlyVisibles = allSucs.filter((suc) =>
        sucsVisibles.find((item) => item === suc)
      )

      console.log(exist, this.article, sucsVisibles)
      if (!exist[`${this.article}`]) return []
      const allData = exist[`${this.article}`]
      console.log(allData, onlyVisibles)
      const suc = {}
      onlyVisibles.forEach((item) => {
        suc[`${item}`] = allData[`${item}`]
      })

      // datos.forEach((dia, index) => {
      //   const cells = Object.keys(dia)
      //   cells.forEach((suc) => {
      //     if (!datos[index]._cellVariants) datos[index]._cellVariants = {}
      //     if (dia[`${suc}`].Fail) {
      //       if (suc === 'ZR') datos[index]._cellVariants.Zaragoza = 'danger'
      //       else if (suc === 'VC')
      //         datos[index]._cellVariants.Victoria = 'danger'
      //       else if (suc === 'ER')
      //         datos[index]._cellVariants.Enriquez = 'danger'
      //       else if (suc === 'OU') datos[index]._cellVariants.Oluta = 'danger'
      //       else if (suc === 'SY') datos[index]._cellVariants.Sayula = 'danger'
      //       else if (suc === 'JL')
      //         datos[index]._cellVariants.Jaltipan = 'danger'
      //       else if (suc === 'SC')
      //         datos[index]._cellVariants.Victoria = 'danger'
      //       if (suc === 'Totales') datos[index]._cellVariants.Totales = 'dark'
      //     } else {
      //       if (suc === 'Totales') datos[index]._cellVariants.Totales = 'dark'
      //       const sf = sucsNotFinded.find((item) => item === suc)
      //       if (
      //         !!sf &&
      //         datos[index].Totales[`${this.article}`] &&
      //         datos[index][`${suc}`][`${this.article}`]
      //       ) {
      //         const total = { ...datos[index].Totales[`${this.article}`] }
      //         total.Piezas -= datos[index][`${suc}`][`${this.article}`].Piezas
      //         total.Cajas -= datos[index][`${suc}`][`${this.article}`].Cajas
      //         total.Valor -= datos[index][`${suc}`][`${this.article}`].Valor
      //         datos[index].Totales[`${this.article}`] = total
      //       }
      //     }
      //   })
      // })
      return [suc]
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
  },
}
</script>
