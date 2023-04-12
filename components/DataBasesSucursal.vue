<template>
  <div>
    <b-button
      :variant="variantInfo"
      :disabled="dataSupportingDB"
      class="d-inline-block mb-3"
      @click="loadData"
    >
      <b-icon :icon="iconRefresh"></b-icon>
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
      <template #cell(create_date)="row">
        {{ formatDate(row.item.create_date) }}
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
            v-if="haveFilesDetails(row.item)"
            @click="functionNotAvailable"
          >
            Detalles de Archivos
          </b-dropdown-item>
          <b-dropdown-item v-else>Sin Detalles de Archivos</b-dropdown-item>
          <b-dropdown-item
            v-if="haveDetails(row.item)"
            @click="showDetailsBackup(row.item)"
          >
            Detalles Respaldo
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
    <b-modal
      :id="'modal-details-backup-' + sucursal"
      title="Detalles de Respaldo"
      hide-footer
      header-bg-variant="dark"
      header-text-variant="info"
      body-text-variant="dark"
    >
      <h6>Resultados de Generar Respaldo:</h6>
      <b-form-textarea id="textarea" v-model="detailsBack" rows="5" readonly />
      <h6 class="mt-2">Resultados de Comprimir Reslpado:</h6>
      <b-form-textarea id="textarea" v-model="detailsZip" rows="5" readonly />
      <h6 class="mt-2">Resultados de Subir Respaldo a Google Drive:</h6>
      <b-form-textarea id="textarea" v-model="detailsDrive" rows="5" readonly />
      <b-button variant="info" class="my-2" @click="hideModalDetails">
        Aceptar
      </b-button>
    </b-modal>
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
      detailsBack: '{}',
      detailsZip: '{}',
      detailsDrive: '{}',
      fields: [
        { key: 'DataBaseName', label: 'Base de Datos', sortable: true },
        { key: 'DataFileSizeMB', label: 'Tamaño de Data(MB)', sortable: true },
        { key: 'LogFileSizeMB', label: 'Tamaño Log(MB)', sortable: true },
        { key: 'Estatus', label: 'Estatus', sortable: true },
        { key: 'create_date', label: 'Creado', sortable: true },
        { key: 'LastBackup', label: 'Ultimo Respaldo', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: false },
      ],
      utils,
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    variantInfo() {
      const data = [...this.$store.state.databases.data.data]
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      let isSupporting = false
      if (sucFindIndex !== -1)
        data[sucFindIndex].data.forEach((dataDB) => {
          if (dataDB.IsSupporting) isSupporting = true
        })
      if (isSupporting) return 'danger'
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
    dataSupportingDB() {
      const data = [...this.$store.state.databases.data.data]
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      let isSupporting = false
      if (sucFindIndex !== -1)
        data[sucFindIndex].data.forEach((dataDB) => {
          if (dataDB.IsSupporting) isSupporting = true
        })
      return isSupporting
    },
    iconRefresh() {
      const data = [...this.$store.state.databases.data.data]
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      let isSupporting = false
      if (sucFindIndex !== -1)
        data[sucFindIndex].data.forEach((dataDB) => {
          if (dataDB.IsSupporting) isSupporting = true
        })
      return isSupporting ? 'toggle2-off' : 'arrow-repeat'
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
    haveFilesDetails(data) {
      const resultDataFile = data.dataFiles.data
      return resultDataFile ? resultDataFile.length > 0 : false
    },
    functionNotAvailable() {
      this.showAlertDialog(['No disponible por el momento'])
    },
    hideModalDetails() {
      this.$bvModal.hide('modal-details-backup-' + this.sucursal)
    },
    showDetailsBackup(data) {
      this.detailsBack = JSON.stringify(data.resultBackup, undefined, 4)
      this.detailsZip = JSON.stringify(data.resultZip, undefined, 4)
      this.detailsDrive = JSON.stringify(data.resultUpload, undefined, 4)

      this.$bvModal.show('modal-details-backup-' + this.sucursal)
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
