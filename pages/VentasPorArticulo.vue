<template>
  <div class="mt-3">
    <div class="h3 text-center">Ventas Por Articulo</div>
    <div id="input-Sucursal" class="inputs">
      <b-input-group prepend="Suc">
        <b-form-select
          v-model="selected"
          :options="options"
          @change="changeSuc"
        ></b-form-select>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="date-init"
          v-model="dateInit"
          label-no-date-selected="Fecha no seleccionada"
          @context="onContextDI"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Al">
        <b-form-datepicker
          id="date-end"
          v-model="dateEnd"
          label-no-date-selected="Fecha no seleccionada"
          @context="onContextDE"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button variant="info" :block="width < 992" @click="updateVentas">
      <b-icon icon="search"></b-icon>
      <span v-if="width < 992">Buscar</span>
    </b-button>
    <b-form-tags
      v-model="articles"
      no-outer-focus
      class="mb-2"
      tag-variant="primary"
      @input="setArticles"
    >
      <template
        v-slot="{
          tags,
          inputAttrs,
          inputHandlers,
          tagVariant,
          addTag,
          removeTag,
        }"
      >
        <b-input-group class="mb-2">
          <b-form-input
            v-bind="inputAttrs"
            placeholder="Escribe el articulo y presiona enter para agregar"
            class="form-control"
            v-on="inputHandlers"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="primary" @click="addTag()">Agregar</b-button>
          </b-input-group-append>
        </b-input-group>
        <div class="d-inline-block" style="font-size: 1.5rem">
          <b-form-tag
            v-for="tag in tags"
            :key="tag"
            :title="tag"
            :variant="tagVariant"
            class="mr-1"
            @remove="removeTag(tag)"
          >
            {{ tag }}
          </b-form-tag>
        </div>
      </template>
    </b-form-tags>

    <div v-if="!emptyData">
      <div class="h4 my-3">{{ leyenda + sucursal }}</div>

      <div class="container-tipo">
        <b-form-group label="Vizualizar Resultados en:">
          <b-form-radio-group
            id="radio-group-1"
            v-model="selectViewBy"
            :options="optionsViewBY"
            name="radio-options"
            @change="updateGraphics"
          ></b-form-radio-group>
        </b-form-group>
      </div>

      <b-dropdown
        id="df"
        ref="dropdown"
        size="lg"
        variant="light"
        toggle-class="text-decoration-none"
        class="filter-down"
      >
        <template #button-content>
          <b-icon icon="filter" />
        </template>
        <b-dropdown-form>
          <AllSelector
            title="Sucursales"
            :options="optionsFilter"
            :set-options="setSucursales"
            :initials="$store.state.ventasporarticulo.sucursales"
            un-select-all-message="Deseleccionar"
          />
        </b-dropdown-form>
      </b-dropdown>

      <b-tabs content-class="mt-3">
        <b-tab v-for="(tabA, indexTab) in tabs" :key="indexTab" :title="tabA">
          <VentasPorArticuloTab
            :utils="utils"
            :article="tabA"
            :view="selectViewBy"
            :data-article="getTotalByAticle(tabA)"
          />
          <h2>Grafico</h2>
          <div class="mb-5">
            <b-button variant="info" @click="changeGrafico('bar')">
              <b-icon :icon="graficoBar" />
              Barra
            </b-button>
            <b-button variant="info" @click="changeGrafico('line')">
              <b-icon :icon="graficoLine" />
              Linea
            </b-button>
          </div>
          <VentasPorArticuloChart
            v-if="showGraph"
            :datos-reactor="dataRefactor"
            :fields="options"
            :utils="utils"
            :tipo="tipoGrafico"
            :article="tabA"
            :view="selectViewBy"
            class="mb-5"
          />
          <div v-else class="spin">
            <b-spinner variant="primary" label="Spinning"></b-spinner>
          </div>
        </b-tab>
      </b-tabs>
    </div>

    <!-- <div v-else>
      <ventasporarticuloCard
        v-for="(dia, indexDia) in dataRefactor"
        :key="indexDia"
        :sucursal="dia"
        :data-formated="dataFormated"
        :show-details="updateVentas"
        class="mb-2"
      />
      <ventasporarticuloCard
        :sucursal="totalesRefactor"
        :data-formated="dataFormated"
        :show-details="updateVentas"
        class="mb-2"
      />
    </div> -->
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import VentasPorArticuloChart from '../components/VentasPorArticuloChart'
// import ventasporarticuloCard from '../components/ventasporarticuloCard'
import VentasPorArticuloTab from '../components/VentasPorArticuloTab'
import AllSelector from '../components/AllSelector'
import utils from '../modules/utils'

export default {
  components: {
    VentasPorArticuloChart,
    // ventasporarticuloCard,
    VentasPorArticuloTab,
    AllSelector,
  },
  data() {
    return {
      selected: 'ALL',
      options: [
        { value: 'ALL', text: 'Todas' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'SC', text: 'Soconusco', disabled: true },
        { value: 'BO', text: 'Bodega', disabled: true },
      ],
      optionsFilter: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
      ],
      optionsViewBY: [
        { text: 'Piezas', value: 'Piezas' },
        { text: 'Cajas', value: 'Cajas' },
        { text: 'Pesos', value: 'Valor' },
      ],
      selectViewBy: 'Piezas',
      articles: [],
      dateInit: '',
      dateEnd: '',
      dateInitLetra: '',
      dateEndLetra: '',
      utils,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    leyenda() {
      return (
        'Reporte de ventas del ' +
        this.$store.state.ventasporarticulo.dateInit +
        ' Al ' +
        this.$store.state.ventasporarticulo.dateEnd +
        ' De la sucursal '
      )
    },
    sucursal() {
      const sucs = this.options
      const suc = this.$store.state.ventasporarticulo.data.Sucursal
      const sucFinded = sucs.find((s) => s.value === suc.toUpperCase())
      if (!suc) return ''
      return sucFinded.text
    },
    emptyData() {
      return this.$store.state.ventasporarticulo.data.Sucursal === 'null'
    },
    tabs() {
      return Object.keys(this.$store.state.ventasporarticulo.data.Totales)
    },
    dataRefactor() {
      const datos = [...this.$store.state.ventasporarticulo.data.data]
      return datos
    },
    graficoBar() {
      return this.$store.state.ventasporarticulo.tipo === 'bar'
        ? 'check-circle-fill'
        : 'circle'
    },
    graficoLine() {
      return this.$store.state.ventasporarticulo.tipo !== 'bar'
        ? 'check-circle-fill'
        : 'circle'
    },
    showGraph() {
      return this.$store.state.ventasporarticulo.showGraph
    },
    tipoGrafico() {
      return this.$store.state.ventasporarticulo.tipo
    },
  },
  mounted() {
    const tablevXarticulo = document.getElementById('tablevXarticulo')
    const sucSel = this.$store.state.ventasporarticulo.sucursal
    this.selected = sucSel
    this.setDateInitials()
    this.articles = [...this.$store.state.ventasporarticulo.articles]

    if (tablevXarticulo) {
      tablevXarticulo.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tablevXarticulo.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'ventasporarticulo/setSucursal',
      setTipoGrafico: 'ventasporarticulo/setTipoGrafico',
      setShowGraph: 'ventasporarticulo/setShowGraph',
      setArticles: 'ventasporarticulo/setArticles',
      setDateInitM: 'ventasporarticulo/setDateInitM',
      setDateEndM: 'ventasporarticulo/setDateEndM',
      setSucursales: 'ventasporarticulo/setSucursales',
    }),
    ...mapActions({
      changeData: 'ventasporarticulo/changeData',
    }),
    onContextDI(ctx) {
      this.setDateInitM(ctx.selectedYMD)
      this.dateInitLetra = ctx.selectedFormatted
    },
    onContextDE(ctx) {
      this.setDateEndM(ctx.selectedYMD)
      this.dateEndLetra = ctx.selectedFormatted
    },
    getTotalByAticle(article) {
      const datos = { ...this.$store.state.ventasporarticulo.data.Totales }
      return datos[`${article}`]
    },
    validateData() {
      if (
        this.$store.state.ventasporarticulo.sucursal === null ||
        this.$store.state.ventasporarticulo.sucursal === 'null'
      ) {
        this.showAlertDialog(['Necesita seleccionar una sucursal'])
        return false
      }
      if (this.dateInit === '') {
        this.showAlertDialog(['No ha seleccionado la fecha de inicio'])
        return false
      }
      if (this.dateEnd === '') {
        this.showAlertDialog(['No ha seleccionado la fecha final'])
        return false
      }
      return true
    },
    async updateVentas() {
      if (!this.validateData()) return false
      this.setLoading(true)
      this.setShowGraph(false)
      const response = await this.changeData([
        this.$store.state.ventasporarticulo.sucursal,
        this.dateInit.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
        this.dateInitLetra,
        this.dateEndLetra,
        this.articles,
      ])
      this.setLoading(false)
      this.setShowGraph(true)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    setDateInitials() {
      const dayActual = utils.getDateNow()
      const dayLast = utils.getDateNow().add(-7, 'days')
      const dateStartSaved = this.$store.state.ventasporarticulo.dateInitM
      const dateEndSaved = this.$store.state.ventasporarticulo.dateEndM

      if (!dateStartSaved || dateStartSaved === null)
        this.dateInit = dayLast.format('yyyy-MM-DD')
      else this.dateInit = dateStartSaved
      if (!dateEndSaved || dateEndSaved === null)
        this.dateEnd = dayActual.format('yyyy-MM-DD')
      else this.dateEnd = dateEndSaved
    },
    changeSuc(suc) {
      this.setSucursal(suc)
    },
    updateGraphics() {
      const typeBar = this.$store.state.ventasporarticulo.tipo
      this.changeGrafico(typeBar)
    },
    changeGrafico(tipo) {
      const that = this
      this.setShowGraph(false)
      setTimeout(() => {
        that.setTipoGrafico(tipo)
        this.setShowGraph(true)
      }, 10)
    },
  },
}
</script>

<style scoped>
.inputs {
  width: (33% - 8px);
  margin-bottom: 10px;
  display: inline-block;
}

.container-tipo {
  margin-bottom: 10px;
  display: inline-block;
}

.filter-down {
  margin-left: 30px;
  margin-bottom: 10px;
  display: inline-block;
}

@media screen and (max-width: 1199px) {
  .inputs {
    width: calc(49% - 19px);
  }

  #input-Sucursal {
    width: 100%;
  }
}

@media screen and (max-width: 991px) {
  .inputs {
    width: calc(49% + 2px);
  }
}

@media screen and (max-width: 767px) {
  .inputs {
    width: 100%;
  }
}
</style>
