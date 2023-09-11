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
      <template #cell(Bodega)="row">
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
    return {
      fields: [
        'Articulo',
        'Zaragoza',
        'Victoria',
        'Enriquez',
        'Oluta',
        'Sayula',
        'Jaltipan',
        'Bodega',
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
        { value: 'BO', text: 'Bodega' },
      ]
      const fields = sucsAviables.reduce(
        (headers, item) => {
          const sucFinded = sucsVisibles.find((suc) => suc === item.value)
          if (sucFinded) headers.push(item.text)
          return headers
        },
        ['Total']
      )
      fields.push('Bodega')
      return fields
    },
    dataRefactor() {
      const exist = { ...this.$store.state.ventasporarticulo.data.Existencias }
      const sucsVisibles = [...this.$store.state.ventasporarticulo.sucursales]
      const allSucs = ['ZR', 'VC', 'ER', 'OU', 'SY', 'JL']
      const onlyVisibles = allSucs.filter((suc) =>
        sucsVisibles.find((item) => item === suc)
      )
      const total = {
        CostoExistenciaNeto: 0,
        ExistenciaActual: 0,
        ExistenciaActualUC: 0,
      }

      if (!exist[`${this.article}`]) return []
      const allData = exist[`${this.article}`]
      const suc = {}
      onlyVisibles.forEach((item) => {
        suc[`${item}`] = allData[`${item}`]
        total.CostoExistenciaNeto += allData[`${item}`].CostoExistenciaNeto
        total.ExistenciaActual += allData[`${item}`].ExistenciaActual
        total.ExistenciaActualUC += allData[`${item}`].ExistenciaActualUC
      })
      suc.BO = { ...allData.BO }
      suc.Total = total

      return [suc]
    },
  },
  mounted() {},
  methods: {
    dataFormated(value) {
      if (value === null || value === undefined || !value) return '-'
      if (value.Fail) return '!'
      const valor =
        this.view === 'Piezas'
          ? 'ExistenciaActual'
          : this.view === 'Cajas'
          ? 'ExistenciaActualUC'
          : 'CostoExistenciaNeto'
      const comp = this.view === 'Valor' ? '$ ' : ''
      return (
        comp +
        this.utils.aplyFormatNumeric(this.utils.roundTo(value[`${valor}`]))
      )
    },
  },
}
</script>
