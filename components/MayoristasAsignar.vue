<template>
  <div class="container-back">
    <div class="container-cancel">
      <span class="container-data">
        <span>{{ data.Articulo }}</span>
        <span class="mr-1 ml-1 text-danger">/</span>
        <span>{{ data.Nombre }}</span>
        <span class="mr-1 ml-1 text-danger">/</span>
        <span>{{ '[' + data.Relacion + ']' }}</span>
        <span class="mr-1 ml-1 text-danger">/</span>
        <span>
          ${{
            utils.aplyFormatNumeric(utils.roundTo(data.CostoValor, 2, true))
          }}
        </span>
        <span class="mr-1 ml-1 text-danger">/</span>
        <span>{{ '(' + data.CantidadRegularUC + ' Cajas)' }}</span>
      </span>
      <b-button variant="danger" class="float-right" @click="close">
        <b-icon icon="x-lg" />
        Cancelar
      </b-button>
    </div>
    <b-form-group
      id="group-article"
      label="Articulo"
      label-for="input-article"
      description="Puede incluir los comodines **"
      class="middle"
    >
      <b-form-input
        id="input-article"
        v-model="article"
        autocomplete="off"
        autofocus
        type="search"
        placeholder="*articulo*"
        required
        @keyup.enter="$refs.inputName.focus()"
      ></b-form-input>
    </b-form-group>

    <b-form-group
      id="group-name"
      label="Nombre"
      label-for="input-name"
      description="Puede incluir los comodines **"
      class="middle"
    >
      <b-form-input
        id="input-name"
        ref="inputName"
        v-model="name"
        autocomplete="off"
        type="search"
        placeholder="*nombre*"
        required
      ></b-form-input>
    </b-form-group>

    <b-container v-if="dataExcel.length > 20" fluid="xl">
      <b-row cols="1" cols-sm="2">
        <b-col sm="3" md="2" class="mb-2">
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="9" md="10" class="mb-2">
          <b-pagination
            v-model="currentPage"
            aria-controls="tableInventarioValuacion"
            :total-rows="rows"
            :per-page="perPage"
            align="fill"
            size="sm"
            first-number
            class="my-0"
            last-number
          >
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      hover
      head-variant="dark"
      outlined
      :per-page="perPage"
      :current-page="currentPage"
      :fields="fields"
      :items="dataExcel"
      :class="variantThemeTableBody"
      class="mt-0"
    >
      <template #cell(ArticuloG)="row">
        {{ row.item.ArticuloGlobal }}
      </template>
      <template #cell(FactorG)="row">
        {{ row.item.Factor }}
      </template>
      <template #cell(UnidadG)="row">
        {{ row.item.Unidad }}
      </template>
      <template #cell(PEDIDOG)="row">
        {{ formatNumber(row.item.PEDIDO) }}
      </template>
      <template #cell(Acciones)="row">
        <b-button variant="info" @click="signarArticle(row.item)">
          Asignar
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import utils from '../modules/utils'

export default {
  name: 'MayoristasAsignar',
  props: {
    articleFind: {
      required: true,
      type: String,
    },
    data: {
      required: true,
      type: Object,
    },
    close: {
      required: true,
      type: Function,
    },
  },
  data() {
    return {
      utils,
      article: '',
      name: '',
      perPage: 7,
      pageOptions: [5, 7, 10, 15, 20, 50, 100],
      currentPage: 1,
      fields: [
        { key: 'CodigoBarras', label: 'CodigoBarras', sortable: true },
        { key: 'ArticuloG', label: 'ArticuloG', sortable: true },
        { key: 'Nombre', label: 'NombreG', sortable: true },
        { key: 'FactorG', label: 'FactorG', sortable: false },
        { key: 'UnidadG', label: 'UnidadG', sortable: false },
        { key: 'PEDIDOG', label: 'PEDIDOG', sortable: false },
        { key: '*', label: '*', sortable: false },
        { key: 'Observaciones', label: 'Observaciones', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: false },
      ],
    }
  },
  computed: {
    rows() {
      return this.$store.state.mayoristas.excel.data.length
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataExcel() {
      const articleFilter = this.article
      const nameFilter = this.name
      const expArticle = new RegExp(
        `.*${articleFilter.replaceAll('*', '.*')}.*`
      )
      const expName = new RegExp(
        `.*${nameFilter.toLowerCase().replaceAll('*', '.*')}.*`
      )

      const data = []
      this.$store.state.mayoristas.excel.data.forEach((artExcel) => {
        if (articleFilter.trim() !== '' && nameFilter.trim() !== '') {
          if (
            expName.test(artExcel.ArticuloGlobal) ||
            expArticle.test(artExcel.Nombre.toLowerCase())
          )
            data.push(artExcel)
        } else if (articleFilter.trim() !== '') {
          if (expArticle.test(artExcel.ArticuloGlobal)) data.push(artExcel)
        } else if (nameFilter.trim() !== '') {
          if (expName.test(artExcel.Nombre.toLowerCase())) data.push(artExcel)
        } else data.push(artExcel)
      })
      return data
    },
  },
  methods: {
    ...mapMutations({
      setComparativa: 'mayoristas/setComparativa',
    }),
    formatNumber(value) {
      if (value === null) return value
      else if (value === undefined) return null
      return utils.aplyFormatNumeric(utils.roundTo(value, 2, true))
    },
    signarArticle(article) {
      const comparativa = { ...this.$store.state.mayoristas.comparativa }
      const data = []
      comparativa.data.forEach((articleC) => {
        const ArticleDocument = { ...articleC.ArticleDocument }
        let ArticuloExcel = {}
        if (articleC.ArticleDocument.Articulo === this.articleFind) {
          ArticuloExcel = { ...article }
          const pactado =
            ArticuloExcel.Proveedor / ArticleDocument.IEPS / ArticleDocument.IVA
          const totalPactado = pactado * ArticleDocument.CantidadRegularUC
          const diferencia = ArticleDocument.CostoValor - totalPactado

          ArticleDocument.Pactado = pactado
          ArticleDocument.TotalPactado = totalPactado
          ArticleDocument.Diferencia = diferencia
        } else ArticuloExcel = { ...articleC.ArticuloExcel }
        data.push({
          ArticleDocument,
          ArticuloExcel,
        })
      })
      this.setComparativa({
        documento: comparativa.documento,
        excel: comparativa.excel,
        data,
      })
      this.close()
    },
  },
}
</script>

<style scoped>
.container-back {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: auto;
  z-index: 9;
  color: #000;
  background: rgba(217, 217, 217, 0.95);
}

.container-cancel {
  display: block;
  height: 50px;
}

.container-data {
  position: fixed;
  top: 10px;
  left: 20px;
  z-index: 9;
  border-radius: 10px;
  padding: 8px 14px;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(6, 97, 93);
}

.middle {
  display: inline-block;
  width: calc(50% - 5px);
  margin-bottom: 10px;
}

@media screen and (max-width: 704px) {
  .middle {
    width: 100%;
  }
}
</style>
