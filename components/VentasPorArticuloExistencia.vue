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
      <template #cell(Total)="row">
        {{ dataFormated(row.item.Total) }}
      </template>
      <template #cell(ZR)="row">
        {{ dataFormated(row.item.ZR) }}
      </template>
      <template #cell(VC)="row">
        {{ dataFormated(row.item.VC) }}
      </template>
      <template #cell(ER)="row">
        {{ dataFormated(row.item.ER) }}
      </template>
      <template #cell(OU)="row">
        {{ dataFormated(row.item.OU) }}
      </template>
      <template #cell(SY)="row">
        {{ dataFormated(row.item.SY) }}
      </template>
      <template #cell(JL)="row">
        {{ dataFormated(row.item.JL) }}
      </template>
      <template #cell(BO)="row">
        {{ dataFormated(row.item.BO) }}
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
    return {}
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    fieldsVisibles() {
      const sucsVisibles = [...this.$store.state.ventasporarticulo.sucursales]
      const sucsAviables = [
        { key: 'ZR', label: 'Zaragoza' },
        { key: 'VC', label: 'Victoria' },
        { key: 'ER', label: 'Enriquez' },
        { key: 'OU', label: 'Oluta' },
        { key: 'SY', label: 'Sayula' },
        { key: 'JL', label: 'Jaltipan' },
        { key: 'BO', label: 'Bodega' },
      ]
      const fields = sucsAviables.reduce(
        (headers, item) => {
          const sucFinded = sucsVisibles.find((suc) => suc === item.key)
          if (sucFinded) headers.push(item)
          return headers
        },
        ['Total']
      )
      fields.push({ key: 'BO', label: 'Bodega' })
      return fields
    },
    dataRefactor() {
      const exist = { ...this.$store.state.ventasporarticulo.data.Existencias }
      const sucsVisibles = [...this.$store.state.ventasporarticulo.sucursales]
      const allSucs = ['ZR', 'VC', 'ER', 'OU', 'SY', 'JL']
      const onlyVisibles = allSucs.filter((suc) =>
        sucsVisibles.find((item) => item === suc)
      )
      const total = { Valor: 0, Piezas: 0, Cajas: 0 }

      if (!exist[`${this.article}`]) return []
      const allData = exist[`${this.article}`]
      const suc = { _cellVariants: {} }
      onlyVisibles.forEach((item) => {
        suc[`${item}`] = allData[`${item}`]
        total.Valor += allData[`${item}`] ? allData[`${item}`].Valor : 0
        total.Piezas += allData[`${item}`] ? allData[`${item}`].Piezas : 0
        total.Cajas += allData[`${item}`] ? allData[`${item}`].Cajas : 0
        if (!allData[`${item}`]) suc._cellVariants[`${item}`] = 'danger'
      })
      suc.BO = { ...allData.BO }
      suc.Total = total

      return [suc]
    },
  },
  mounted() {},
  methods: {
    dataFormated(value) {
      if (value === null || value === undefined || !value) return '!'
      const comp = this.view === 'Valor' ? '$ ' : ''
      return (
        comp +
        this.utils.aplyFormatNumeric(this.utils.roundTo(value[`${this.view}`]))
      )
    },
  },
}
</script>
