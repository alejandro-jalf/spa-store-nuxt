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
      <template #cell(Acciones)="row">
        <div v-if="isLoadedBackup(row.item)">
          <div class="progress-backup">{{ messageProgress(row.item) }}</div>
          <b-progress
            :value="progressBackup(row.item)"
            :max="100"
            animated
          ></b-progress>
        </div>
        <b-dropdown
          v-else
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template #button-content>
            <b-icon icon="three-dots" />
          </template>
          <b-dropdown-item @click="approveBackup(row.item)">
            Respaldar
          </b-dropdown-item>
          <b-dropdown-item @click="functionNotAvailable">
            Reducir log
          </b-dropdown-item>
          <b-dropdown-item
            v-if="haveDetails(row.item)"
            @click="showDetailsBackup(row.item)"
          >
            Detalles Respaldo
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
      const data = [...this.$store.state.databases.data.data]
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
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      changeData: 'databases/changeData',
      uploadBackup: 'databases/uploadBackup',
    }),
    isLoadedBackup(data) {
      return data.IsSupporting
    },
    progressBackup(data) {
      return data.progress
    },
    messageProgress(data) {
      return data.message
    },
    haveDetails(data) {
      const resultBackup = Object.keys(data.resultBackup)
      const resultUpload = Object.keys(data.resultUpload)
      const resultZip = Object.keys(data.resultZip)
      return resultBackup.length > 0 || resultUpload > 0 || resultZip > 0
    },
    functionNotAvailable() {
      this.showAlertDialog(['No disponible por el momento'])
    },
    showDetailsBackup(data) {
      const resultBackup = data.resultBackup.success
        ? 'Exito al Generar respaldo'
        : JSON.stringify(data.resultBackup, undefined, 4)
      const resultUpload = data.resultUpload.success
        ? 'Exito al subir respaldo'
        : JSON.stringify(data.resultUpload, undefined, 4)
      const resultZip = data.resultZip.success
        ? 'Exito al comprimir respaldo'
        : JSON.stringify(data.resultZip, undefined, 4)
      const message =
        'Resultados al generar backup: <br/>' +
        resultBackup +
        '<br/>Resultados al comprimir backup: <br/>' +
        resultZip +
        '<br/>Resultados al subir backup a drive: <br/>' +
        resultUpload
      this.showAlertDialog([message, 'Detalles de Backup', 'info'])
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
    },
    approveBackup(items) {
      this.showAlertDialogOption([
        `¿Realizar respaldo a la base de datos [${items.DataBaseName}]?`,
        'Confirmando Reslpado',
        () => {
          this.hideAlertDialogOption()
          this.generateBackup(items)
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async generateBackup(items) {
      const sucursal = this.sucursal
      const dateName = utils.getDateNow().format('YYYYMMDDHHmm')
      const nameBackup = `${items.DataBaseName}_${dateName}.BAK`
      const source = utils.getSourceBySuc(sucursal)
      const response = await this.uploadBackup([
        sucursal,
        source,
        items.DataBaseName,
        nameBackup,
      ])
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.progress-backup {
  font-size: 11px;
}
</style>
