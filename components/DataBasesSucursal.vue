<template>
  <div>
    <b-button
      :variant="variantInfo"
      class="d-inline-block mb-3"
      @click="loadData"
    >
      <b-icon icon="arrow-repeat"></b-icon>
      Refrescar
    </b-button>

    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fields"
      :items="dataExistencias"
      :class="variantThemeTableBody"
    >
      <template #cell(DataFileSizeMB)="row">
        {{ formatNumber(row.item.DataFileSizeMB) }}
      </template>
      <template #cell(LogFileSizeMB)="row">
        {{ formatNumber(row.item.LogFileSizeMB) }}
      </template>
      <template #cell(LastBackup)="row">
        {{ formatDate(row.item.LastBackup) }}
      </template>
      <template #cell(Acciones)>
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template #button-content>
            <b-icon icon="three-dots" />
          </template>
          <b-dropdown-item @click="functionNotAvailable">
            Respaldar
          </b-dropdown-item>
          <b-dropdown-item @click="functionNotAvailable">
            Reducir log
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  props: {
    sucursal: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      fields: [
        { key: 'DataBaseName', label: 'Base de Datos', sortable: true },
        { key: 'DataFileSizeMB', label: 'Tamaño de Data(MB)', sortable: true },
        { key: 'LogFileSizeMB', label: 'Tamaño Log(MB)', sortable: true },
        { key: 'Estatus', label: 'Estatus', sortable: true },
        { key: 'LastBackup', label: 'Ultimo Respaldo', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: true },
      ],
      utils,
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    dataExistencias() {
      const data = this.$store.state.databases.data.data
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      return sucFindIndex !== -1 ? data[sucFindIndex].data : []
    },
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'databases/changeData',
    }),
    functionNotAvailable() {
      this.showAlertDialog(['No disponible por el momento'])
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    formatDate(value) {
      if (value === null) return '----------'
      return utils.toDate(value) + ' ' + utils.toHour(value)
    },
    async loadData() {
      const sucursal = this.sucursal
      this.setLoading(true)
      const response = await this.changeData([sucursal])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
      }
    },
  },
}
</script>
