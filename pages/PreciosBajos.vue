<template>
  <div>
    <h1 class="text-center mt-2">Articulos con precios Bajos</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        :disabled="!accessChangeSucursal"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-form-input
          id="input-porcentaje"
          v-model="porcentaje"
          v-b-tooltip.hover
          title="% Minimo"
          value="10"
          placeholder="% Min."
          type="number"
          size="sm"
          class="h-100 w-25"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-button variant="info" @click="verifyArticles">Verificar</b-button>
      </b-input-group-append>
    </b-input-group>

    <div v-if="!isCleanData">
      <b-button
        :variant="variantClean"
        :block="width < 528"
        class="my-4"
        @click="cleanData"
      >
        <b-icon icon="ui-checks" />
        Limpiar tabla
      </b-button>

      <div class="h3 mb-3">
        Articulos de "{{ getNameBySuc(sucConsult) }}" con algun precio menor del
        {{ montoMinino * 100 }}% utilidad
      </div>
      <b-badge pill variant="info" class="chip">
        Total: {{ dataRefactor.length }}
      </b-badge>
    </div>

    <b-table
      v-if="width > 767"
      id="tablePreciosBajos"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="my-3"
      :class="variantThemeTableBody"
    >
      <template #cell(Exist)="row">
        {{ dataNumberForNull(row.item.Exist) }}
      </template>
      <template #cell(Costo)="row">
        {{ '$' + dataNumberForNull(row.item.Costo) }}
      </template>
      <template #cell(Precio1)="row">
        <span
          :class="{
            marcador1: isValidUtilitie(row.item.Util1, row.item.UtilidadMinima),
          }"
        >
          {{ '$' + dataNumberForNull(row.item.Precio1) }}
        </span>
      </template>
      <template #cell(Precio2)="row">
        <span
          :class="{
            marcador2: isValidUtilitie(row.item.Util2, row.item.UtilidadMinima),
          }"
        >
          {{ '$' + dataNumberForNull(row.item.Precio2) }}
        </span>
      </template>
      <template #cell(Precio3)="row">
        <span
          :class="{
            marcador3: isValidUtilitie(row.item.Util3, row.item.UtilidadMinima),
          }"
        >
          {{ '$' + dataNumberForNull(row.item.Precio3) }}
        </span>
      </template>
      <template #cell(Util1)="row">
        <span
          :class="{
            marcador1: isValidUtilitie(row.item.Util1, row.item.UtilidadMinima),
          }"
        >
          {{ dataPercentageForNull(row.item.Util1) }}
        </span>
      </template>
      <template #cell(Util2)="row">
        <span
          :class="{
            marcador2: isValidUtilitie(row.item.Util2, row.item.UtilidadMinima),
          }"
        >
          {{ dataPercentageForNull(row.item.Util2) }}
        </span>
      </template>
      <template #cell(Util3)="row">
        <span
          :class="{
            marcador3: isValidUtilitie(row.item.Util3, row.item.UtilidadMinima),
          }"
        >
          {{ dataPercentageForNull(row.item.Util3) }}
        </span>
      </template>
      <template #cell(Acciones)="row">
        <b-button
          v-b-tooltip.hover.lefttop="'Ver detalles'"
          class="mb-2 ml-2"
          size="sm"
          variant="info"
          @click="showDetails(row.item)"
        >
          <b-icon icon="eye" />
        </b-button>
        <b-button
          v-b-tooltip.hover.lefttop="titleTooltip(row.item.Articulo)"
          class="mb-2 ml-2"
          variant="info"
          size="sm"
          @click="utils.copyToClipBoard(row.item.Articulo, $bvToast)"
        >
          <b-icon icon="files" />
        </b-button>
      </template>
    </b-table>
    <div v-else class="my-3">
      <PreciosBajosCard
        v-for="(article, indexArticle) in dataRefactor"
        :key="indexArticle"
        :data-number-for-null="dataNumberForNull"
        :data-percentage-for-null="dataPercentageForNull"
        :article="article"
        :show-details="showDetails"
        class="mb-2"
      />
    </div>
    <PreciosBajosDetalles
      v-if="viewDetails"
      :data-number-for-null="dataNumberForNull"
      :data-percentage-for-null="dataPercentageForNull"
      :article-actual="articleActual"
      :close-details="closeDetails"
    />

    <div v-if="!isCleanData" class="float-right h5 mb-5">
      <span class="font-weight-bold">Fecha de consulta:</span>
      {{ horaConsult }}
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import PreciosBajosCard from '../components/PreciosBajosCard'
import PreciosBajosDetalles from '../components/PreciosBajosDetalles'
import utils from '../modules/utils'

export default {
  components: {
    PreciosBajosDetalles,
    PreciosBajosCard,
  },
  data() {
    return {
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      porcentaje: 10,
      fields: [
        'Articulo',
        'Nombre',
        'Relacion',
        'Exist',
        'Costo',
        'Precio1',
        'Precio2',
        'Precio3',
        'Util1',
        'Util2',
        'Util3',
        'Acciones',
      ],
      utils,
      articleActual: {},
      viewDetails: false,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    suc() {
      return this.$store.state.preciosbajos.sucursal
    },
    sucConsult() {
      return this.$store.state.preciosbajos.sucursalConsult
    },
    horaConsult() {
      return this.$store.state.preciosbajos.horaConsult
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    isCleanData() {
      return this.$store.state.preciosbajos.sucursalConsult.trim() === ''
    },
    montoMinino() {
      return this.$store.state.preciosbajos.data.data.length !== 0
        ? this.$store.state.preciosbajos.data.data[0].UtilidadMinima
        : 0
    },
    dataRefactor() {
      const datos = [...this.$store.state.preciosbajos.data.data]
      datos.forEach((articulo) => {
        articulo.Exist = articulo.ExistenciaActualRegular
        articulo.Costo = articulo.UltimoCosto
        articulo.Precio1 = articulo.Precio1IVAUV
        articulo.Precio2 = articulo.Precio2IVAUV
        articulo.Precio3 = articulo.Precio3IVAUV
        articulo.Util1 = articulo.Utilidad1
        articulo.Util2 = articulo.Utilidad2
        articulo.Util3 = articulo.Utilidad3
        articulo._cellVariants = {}
        if (
          articulo.Utilidad1 !== null &&
          articulo.Utilidad1 < articulo.UtilidadMinima
        ) {
          articulo._cellVariants.Util1 = 'danger'
          articulo._cellVariants.Precio1 = 'danger'
        }
        if (
          articulo.Utilidad2 !== null &&
          articulo.Utilidad2 < articulo.UtilidadMinima
        ) {
          articulo._cellVariants.Util2 = 'danger'
          articulo._cellVariants.Precio2 = 'danger'
        }
        if (
          articulo.Utilidad3 !== null &&
          articulo.Utilidad3 < articulo.UtilidadMinima
        ) {
          articulo._cellVariants.Util3 = 'danger'
          articulo._cellVariants.Precio3 = 'danger'
        }
      })
      return datos
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
  },
  mounted() {
    const tablePreciosBajos = document.getElementById('tablePreciosBajos')

    this.setSucursalForUser()
    if (tablePreciosBajos) {
      tablePreciosBajos.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tablePreciosBajos.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setSucursal: 'preciosbajos/setSucursal',
      setData: 'preciosbajos/setData',
      setHoraConsult: 'preciosbajos/setHoraConsult',
      setSucursalConsult: 'preciosbajos/setSucursalConsult',
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'preciosbajos/changeData',
    }),
    titleTooltip(article = '') {
      return `Copiar codigo de articulo "${article}"`
    },
    getNameBySuc(sucRecived) {
      const sucFind = this.options.find((suc) => suc.value === sucRecived)
      return sucFind ? sucFind.text : ''
    },
    cleanData() {
      this.setData({ data: [] })
      this.setSucursalConsult('')
      this.setHoraConsult('')
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
    showDetails(article) {
      this.viewDetails = true
      this.articleActual = article
    },
    closeDetails() {
      this.articleActual = {}
      this.viewDetails = false
    },
    isValidUtilitie(utilidad, min) {
      return utilidad !== null && utilidad < min
    },
    dataNumberForNull(value) {
      if (value === null) return '-'
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    dataPercentageForNull(value) {
      if (value === null) return '-'
      return utils.roundTo(value * 100, 2, true) + '%'
    },
    validateData() {
      if (
        this.$store.state.preciosbajos.sucursal === null ||
        this.$store.state.preciosbajos.sucursal === 'null'
      ) {
        this.showAlertDialog(['Necesita seleccionar una sucursal'])
        return false
      }
      if (
        this.porcentaje === undefined ||
        this.porcentaje === null ||
        this.porcentaje.toString().trim() === ''
      ) {
        this.showAlertDialog([
          'Necesita ingresar un valor minimo de porcentaje de utilidad',
        ])
        return false
      }
      return true
    },
    async verifyArticles() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.changeData([
        this.$store.state.preciosbajos.sucursal,
        this.porcentaje,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else
        this.setHoraConsult(utils.getDateNow().format('DD/MM/YYYY hh:mm:ss a'))
    },
    selectSucursal(sucursal) {
      this.setSucursal(sucursal)
    },
  },
}
</script>

<style scoped>
.chip {
  padding: 5px 15px;
  font-size: 15px;
}

.container-cell {
  position: relative;
}

.marcador1 {
  border-bottom: 3px solid rgb(57, 189, 1);
}

.marcador2 {
  border-bottom: 3px solid rgb(173, 0, 0);
}

.marcador3 {
  border-bottom: 3px solid rgb(255, 0, 225);
}
</style>
