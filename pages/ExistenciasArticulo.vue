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
          <b-button type="button" variant="primary">Buscar</b-button>
        </template>
        <b-form-input
          v-model="inputSearch.search"
          name="iS"
          :placeholder="placeholder"
        ></b-form-input>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script>
export default {
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
}
</script>
