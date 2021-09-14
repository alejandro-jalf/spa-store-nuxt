<template>
  <div class="pb-5">
    <transition name="fade">
      <float-button
        v-if="showFloatButton"
        icon-float="arrow-up-circle"
        :click-float="upPage"
        variant-float="info"
      ></float-button>
    </transition>
    <b-form-group id="input-group-1" label-for="inpSearch" class="pt-5">
      <div class="text-left mb-1">
        <span class="font-weight-bold">Busqueda por:</span>
        <b-button-group class="ml-2" size="md">
          <b-button
            :pressed="!searchByName"
            variant="info"
            @click="setSearchBy('codigo')"
          >
            <b-icon :icon="selectedCodigoIcon" />
            Codigo
          </b-button>
          <b-button
            :pressed="searchByName"
            variant="info"
            @click="setSearchBy('nombre')"
          >
            <b-icon :icon="selectedNameIcon" />
            Nombre
          </b-button>
        </b-button-group>
      </div>
      <b-input-group id="inpSearch">
        <template #append>
          <b-button type="button" variant="primary" @click="loadAriculos()">
            Buscar
          </b-button>
        </template>
        <b-form-input
          v-model="inputSearch.search"
          :name="nameInputSearch"
          :placeholder="placeholder"
          style="min-width: 150px"
          aria-describedby="search-help-block"
          :class="backgroundInputTheme"
          @keyup.enter="loadAriculos()"
        ></b-form-input>
      </b-input-group>
      <b-form-text id="search-help-block">
        {{ description }}
      </b-form-text>
    </b-form-group>

    <b-button-group size="md mt-4">
      <b-button
        :pressed="stateList"
        variant="outline-info"
        @click="stateBtn('list')"
      >
        Lista de articulos
      </b-button>
      <b-button
        :pressed="stateDetails"
        variant="outline-info"
        @click="stateBtn('details')"
      >
        Detalles de articulo
      </b-button>
    </b-button-group>
    <div class="line-buttons bg-info"></div>

    <div v-if="stateList">
      <b-button
        v-if="finded > 0"
        :variant="variantClean"
        class="mb-1"
        :block="blockButton"
        @click="cleanListArticles()"
      >
        <b-icon icon="archive" />
        Limpiar lista de articulos encontrados
      </b-button>
      <b-alert :variant="variantAlert" show>
        Articulos encontrados: {{ finded }}
      </b-alert>
      <existencias-articulo-card
        v-if="isMovil"
        :articulos="listArt"
        :show-details="showDetails"
      ></existencias-articulo-card>

      <existencias-articulo-table
        v-else
        :list-articulos="listArt"
        :show-details="showDetails"
      ></existencias-articulo-table>
    </div>

    <div v-else-if="!isEmptyDetails">
      <b-button
        :variant="variantClean"
        :block="blockButton"
        class="mb-1"
        @click="cleanDetails()"
      >
        <b-icon icon="archive" />
        Limpiar detalles del articulo
      </b-button>
      <existencias-articulo-details
        :details="detailsArticulo"
      ></existencias-articulo-details>
    </div>

    <b-alert v-else show :variant="variantAlert">
      No se ha solicitado el detalle de ningun producto
    </b-alert>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ExistenciasArticuloTable from '../components/ExistenciasArticuloTable'
import ExistenciasArticuloCard from '../components/ExistenciasArticuloCard'
import ExistenciasArticuloDetails from '../components/ExistenciasArticuloDetails'
import FloatButton from '../components/FloatButton'

export default {
  components: {
    ExistenciasArticuloTable,
    ExistenciasArticuloCard,
    ExistenciasArticuloDetails,
    FloatButton,
  },
  data() {
    return {
      inputSearch: {
        search: '',
        selected: 'nombre',
      },
      listArt: this.$store.state.existenciasarticulo.listArticulos.data,
      finded: this.$store.state.existenciasarticulo.articulosFinded,
      isMovil: false,
      detailsArticulo: this.$store.state.existenciasarticulo.details,
      stateList: true,
      stateDetails: false,
      showFloatButton: false,
    }
  },
  computed: {
    blockButton() {
      return this.$store.state.general.widthWindow <= 500
    },
    variantAlert() {
      return this.$store.state.general.themesComponents.themeVariantAlert
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    label() {
      return this.inputSearch.selected === 'nombre'
        ? 'Nombre del articulo'
        : 'Codigo del articulo'
    },
    description() {
      return this.inputSearch.selected === 'nombre'
        ? 'Para la busqueda del articulo puede incluir los *'
        : 'Solo codigo del articulo'
    },
    placeholder() {
      return this.inputSearch.selected === 'nombre'
        ? '*nombre_articulo*'
        : '0000000'
    },
    searchByName() {
      return this.inputSearch.selected === 'nombre'
    },
    iconSelectedCodigo() {
      return this.inputSearch.selected === 'codigo'
    },
    selectedCodigoIcon() {
      return this.inputSearch.selected === 'codigo'
        ? 'check-square-fill'
        : 'square'
    },
    iconSelectedName() {
      return this.inputSearch.selected === 'nombre'
    },
    selectedNameIcon() {
      return this.inputSearch.selected === 'nombre'
        ? 'check-square-fill'
        : 'square'
    },
    nameInputSearch() {
      if (this.inputSearch.selected === 'nombre') return 'searchName'
      return 'searchCode'
    },
    isEmptyDetails() {
      return Object.values(this.detailsArticulo).length === 0
    },
  },
  mounted() {
    const that = this
    this.isMovil = this.isDiplayMovil()
    window.addEventListener('scroll', () => {
      that.showFloatButton = window.scrollY >= 500
    })
    window.addEventListener('resize', () => {
      this.isMovil = this.isDiplayMovil()
    })
  },
  methods: {
    ...mapActions({
      getListArticulos: 'existenciasarticulo/getListArticulos',
      getDetailsArticulo: 'existenciasarticulo/getDetailsArticulo',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setListArticulos: 'existenciasarticulo/setListArticulos',
      setArticulosFinded: 'existenciasarticulo/setArticulosFinded',
      setArticuloDetails: 'existenciasarticulo/setArticuloDetails',
    }),
    cleanListArticles() {
      this.setListArticulos({ data: [] })
      this.setArticulosFinded(0)
      this.listArt = []
      this.finded = 0
    },
    cleanDetails() {
      this.setArticuloDetails({})
      this.detailsArticulo = {}
    },
    async loadAriculos() {
      const search = this.inputSearch.search
      if (search.trim() === '') {
        const find =
          this.inputSearch.selected === 'nombre' ? 'Nombre' : 'Codigo'
        this.showAlertDialog([`${find} de articulo no puede quedar vacio`])
        return
      }
      this.setLoading(true)
      if (this.inputSearch.selected === 'nombre') {
        const response = await this.getListArticulos(search)
        this.listArt = response.data
        this.finded = response.count
        this.stateBtn('list')
      } else {
        const response = await this.getDetailsArticulo(search)
        if (Object.values(response).length === 0) {
          this.setLoading(false)
          this.showAlertDialog([`El codigo de articulo ${search} no existe`])
          this.detailsArticulo = response
        } else this.detailsArticulo = response
        this.stateBtn('details')
      }
      this.setLoading(false)
    },
    isDiplayMovil() {
      return screen.width < 992
    },
    async showDetails(articulo) {
      this.setLoading(true)
      const response = await this.getDetailsArticulo(articulo)
      this.detailsArticulo = response
      this.stateBtn('details')
      this.setLoading(false)
    },
    stateBtn(from) {
      if (from === 'list') {
        this.stateList = true
        this.stateDetails = false
      } else {
        this.stateList = false
        this.stateDetails = true
      }
    },
    setSearchBy(searchBy) {
      this.inputSearch.selected = searchBy
    },
    upPage() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style scoped>
.line-buttons {
  margin-bottom: 20px;
  width: calc(100% - 5px);
  margin-left: 5px;
  height: 1px;
  margin-top: -1px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
