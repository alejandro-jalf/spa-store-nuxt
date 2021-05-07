<template>
  <div>
    <b-form inline class="mt-4 font-weight-bold">
      <label class="mr-sm-2" for="checkBy">Buscar por: </label>
      <b-form-radio-group
        v-model="inputSearch.selected"
        :options="options"
        name="busqueda"
        class="mr-4"
      ></b-form-radio-group>
    </b-form>
    <b-form-group
      id="input-group-1"
      :label="label"
      label-for="inpSearch"
      :description="description"
      class="mt-5"
    >
      <b-input-group id="inpSearch">
        <template #append>
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
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ExistenciasArticuloTable from '../components/ExistenciasArticuloTable'
import ExistenciasArticuloCard from '../components/ExistenciasArticuloCard'

export default {
  components: {
    ExistenciasArticuloTable,
    ExistenciasArticuloCard,
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
  },
  mounted() {
    this.isMovil = this.isDiplayMovil()
  },
  methods: {
    ...mapActions({
      getListArticulos: 'existenciasarticulo/getListArticulos',
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
    showDetails() {},
  },
}
</script>
