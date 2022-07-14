<template>
  <div>
    <b-alert variant="info" :show="isEmptyDetails">
      No hay detalles que mostrar
    </b-alert>
    <div v-if="!isEmptyDetails" class="mb-5">
      <div class="text-center mb-2">
        Envia:
        <span class="font-weight-bold">
          {{ sucursal }}
        </span>
      </div>
      <div class="mb-2">
        <span>
          Origen:
          <span class="font-weight-bold">
            {{ consolidacionActual.AlmacenOrigen }}
          </span>
        </span>
        <span class="float-right">
          Fecha:
          <span class="font-weight-bold">
            {{ utils.toDate(consolidacionActual.Fecha) }}
          </span>
        </span>
      </div>
      <div class="mb-2">
        <span>
          Documento:
          <span class="font-weight-bold">
            {{ consolidacionActual.Transferencia }}
          </span>
        </span>
        <span class="float-right">
          Referencia:
          <span class="font-weight-bold">
            {{ consolidacionActual.Referencia.toUpperCase() }}
          </span>
        </span>
      </div>
      <div class="mb-2">
        <span>
          Destino:
          <span class="font-weight-bold">
            {{ consolidacionActual.AlmacenDestino }}
          </span>
        </span>
        <span class="float-right">
          Transfirio:
          <span class="font-weight-bold">
            {{ consolidacionActual.NombreCajero.toUpperCase() }}
          </span>
        </span>
      </div>
      <div class="text-center mb-3">
        Observaciones:
        <span class="font-weight-bold">
          {{ consolidacionActual.Observaciones.toUpperCase() }}
        </span>
      </div>
      <b-table
        ref="tableSelectProduct"
        head-variant="dark"
        hover
        striped
        :fields="fields"
        :items="articles"
        responsive="sm"
        :class="variantThemeTableBody"
      >
        <template #cell(CantUV)="row">
          {{ formatNumber(row.item.CantidadRegular) }}
        </template>
        <template #cell(CantUC)="row">
          {{ formatNumber(row.item.CantidadRegularUC) }}
        </template>
        <template #cell(CostoUV)="row">
          {{
            formatNumberWithFooter(row.item.CostoUnitarioNeto, row.item.footer)
          }}
        </template>
        <template #cell(CostoIvaUV)="row">
          <span class="font-weight-bold">
            {{
              formatNumberWithFooter(
                row.item.CostoUnitarioNetoIva,
                row.item.footer
              )
            }}
          </span>
        </template>
        <template #cell(CostoUC)="row">
          {{
            formatNumberWithFooter(
              row.item.CostoUnitarioNetoUC,
              row.item.footer
            )
          }}
        </template>
        <template #cell(CostoIvaUC)="row">
          <span class="font-weight-bold">
            {{
              formatNumberWithFooter(
                row.item.CostoUnitarioNetoUCIva,
                row.item.footer
              )
            }}
          </span>
        </template>
        <template #cell(ImporteIva)="row">
          <span class="font-weight-bold">
            {{ formatNumber(row.item.CostoConIva) }}
          </span>
        </template>
      </b-table>
      <Divider class="my-3" />
      <div class="float-right text-right">
        <span class="font-weight-bold d-inline"> Subtotal: </span>
        <div class="rectangle">
          {{ formatNumber(subTotal) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Iva: </span>
        <div class="rectangle">
          {{ formatNumber(iva) }}
        </div>
        <br />
        <span class="font-weight-bold d-inline"> Total: </span>
        <div class="rectangle">
          {{ formatNumber(total) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import utils from '../modules/utils'

export default {
  props: {
    sucursales: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        'Articulo',
        'Nombre',
        'Relacion',
        'CantUV',
        'CostoUV',
        'CostoIvaUV',
        'CantUC',
        'CostoUC',
        'CostoIvaUC',
        'ImporteIva',
        'Tasa',
      ],
      utils,
    }
  },
  computed: {
    sucursal() {
      const sucursales = this.sucursales
      return sucursales[`${this.$store.state.consolidaciones.sucursal}`]
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    consolidacionActual() {
      return this.$store.state.consolidaciones.consolidacionActual.data
    },
    isEmptyDetails() {
      return (
        this.$store.state.consolidaciones.consolidacionActual.data.length === 0
      )
    },
    articles() {
      const listArticles = []
      this.$store.state.consolidaciones.details.data.forEach((article) => {
        listArticles.push(article)
      })

      return listArticles
    },
    total() {
      return this.$store.state.consolidaciones.details.data.reduce(
        (sum, article) => {
          sum += article.CostoConIva
          return sum
        },
        0
      )
    },
    iva() {
      return this.$store.state.consolidaciones.details.data.reduce(
        (sum, article) => {
          sum += article.Iva
          return sum
        },
        0
      )
    },
    subTotal() {
      return this.$store.state.consolidaciones.details.data.reduce(
        (sum, article) => {
          sum += article.CostoValorNeto
          return sum
        },
        0
      )
    },
  },
  methods: {
    ...mapMutations({
      setShowDetails: 'consolidaciones/setShowDetails',
    }),
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    formatNumberWithFooter(value, footer) {
      if (footer) return ''
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
  },
}
</script>

<style scoped>
.rectangle {
  display: inline-block;
  width: 150px;
}
</style>
