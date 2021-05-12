<template>
  <div>
    <transition name="fade">
      <float-button
        v-if="showFloatButton"
        icon="arrow-up-circle"
        :click="upPage"
        size="50px"
        variant="info"
      ></float-button>
    </transition>
    <b-form-group id="input-group-1" label-for="inpSearch" class="mt-5">
      <div class="text-left mb-1">
        <span class="font-weight-bold">Busqueda por:</span>
        <b-button-group class="ml-2" size="md">
          <b-button
            :pressed="!searchByName"
            variant="info"
            @click="setSearchBy('codigo')"
          >
            <b-icon :icon="iconSelectedCodigo"></b-icon>
            Codigo
          </b-button>
          <b-button
            :pressed="searchByName"
            variant="info"
            @click="setSearchBy('nombre')"
          >
            <b-icon :icon="iconSelectedName"></b-icon>
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
          @keyup.enter="loadAriculos()"
        ></b-form-input>
      </b-input-group>
      <b-form-text id="search-help-block">
        {{ description }}
      </b-form-text>
    </b-form-group>

    <b-button-group size="md mt-5">
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
      <b-alert show>Articulos encontrados: {{ finded }}</b-alert>
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

    <existencias-articulo-details
      v-else-if="!isEmptyDetails"
      :details="detailsArticulo"
    ></existencias-articulo-details>

    <b-alert v-else show variant="warning">
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
      if (this.inputSearch.selected === 'codigo') return 'check-square-fill'
      return 'square'
    },
    iconSelectedName() {
      if (this.inputSearch.selected === 'nombre') return 'check-square-fill'
      return 'square'
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
  },
  methods: {
    ...mapActions({
      getListArticulos: 'existenciasarticulo/getListArticulos',
      getDetailsArticulo: 'existenciasarticulo/getDetailsArticulo',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
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
      return screen.width <= 800
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
