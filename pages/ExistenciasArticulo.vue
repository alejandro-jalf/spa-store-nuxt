<template>
  <div>
    <b-form-group
      id="input-group-1"
      :label="label"
      label-for="inpSearch"
      :description="description"
      class="mt-5"
    >
      <b-input-group id="inpSearch">
        <template #append>
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
          <b-button type="button" variant="primary" @click="loadAriculos()">
            Buscar
          </b-button>
        </template>
        <b-form-input
          v-model="inputSearch.search"
          name="iS"
          :placeholder="placeholder"
          @keyup.enter="loadAriculos()"
        ></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-button-group size="md">
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
      v-else
      :details="detailsArticulo"
    ></existencias-articulo-details>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ExistenciasArticuloTable from '../components/ExistenciasArticuloTable'
import ExistenciasArticuloCard from '../components/ExistenciasArticuloCard'
import ExistenciasArticuloDetails from '../components/ExistenciasArticuloDetails'

export default {
  components: {
    ExistenciasArticuloTable,
    ExistenciasArticuloCard,
    ExistenciasArticuloDetails,
  },
  data() {
    return {
      inputSearch: {
        search: '',
        selected: 'nombre',
      },
      options: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Codigo', value: 'codigo' },
      ],
      listArt: this.$store.state.existenciasarticulo.listArticulos.data,
      finded: this.$store.state.existenciasarticulo.articulosFinded,
      isMovil: false,
      detailsArticulo: this.$store.state.existenciasarticulo.details,
      stateList: true,
      stateDetails: false,
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
      return this.inputSearch.selected === 'nombre' ? '*articulo*' : '0000000'
    },
    searchByName() {
      return this.inputSearch.selected === 'nombre'
    },
    iconSelectedCodigo() {
      if (this.inputSearch.selected === 'codigo') return 'check-square-fill'
      return 'check-square'
    },
    iconSelectedName() {
      if (this.inputSearch.selected === 'nombre') return 'check-square-fill'
      return 'check-square'
    },
  },
  mounted() {
    this.isMovil = this.isDiplayMovil()
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
      if (this.inputSearch.search.trim() === '') {
        this.showAlertDialog(['Nombre o Codigo articulo no puede quedar vacio'])
        return
      }
      this.setLoading(true)
      const response = await this.getListArticulos(this.inputSearch.search)
      this.listArt = response.data
      this.finded = response.count
      this.setLoading(false)
    },
    isDiplayMovil() {
      return screen.width <= 800
    },
    async showDetails(articulo) {
      this.setLoading(true)
      const response = await this.getDetailsArticulo(articulo)
      this.detailsArticulo = response
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
</style>
