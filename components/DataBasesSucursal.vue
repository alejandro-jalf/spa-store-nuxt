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

    <div class="container-hd">
      <b-icon icon="hdd-fill" class="icon-hd" />
      <span>
        <span class="name-hd">Disco ({{ HDDisk }}:)</span>
        <b-progress :max="100" class="progress-hd">
          <b-progress-bar
            :value="HDValue"
            :label="`${Math.round(HDValue)} %`"
          />
        </b-progress>
        <p class="disponible-hd">{{ HDAvailable }}</p>
      </span>
    </div>

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
            <b-icon icon="layer-forward" /> Respaldar
          </b-dropdown-item>
          <b-dropdown-item @click="approveReduceLog(row.item)">
            <b-icon icon="speedometer" />
            Reducir log
          </b-dropdown-item>
          <b-dropdown-item
            v-if="haveFilesDetails(row.item)"
            @click="showDetailsFiles(row.item)"
          >
            <b-icon icon="file-earmark-fill" />
            DATA y LOG
          </b-dropdown-item>
          <b-dropdown-item v-else disabled>
            <b-icon icon="info-circle-fill" />
            No hay DATA ni LOG
          </b-dropdown-item>
          <b-dropdown-item
            v-if="haveDetails(row.item)"
            @click="showDetailsBackup(row.item)"
          >
            <b-icon icon="eye" />
            Detalles Respaldo
          </b-dropdown-item>
          <b-dropdown-item
            v-if="haveDetailsReduce(row.item)"
            @click="showDetailsReduce(row.item)"
          >
            <b-icon icon="eye" />
            Detalles de Reduccion
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
      <b-form-textarea id="textarea1" v-model="detailsBack" rows="5" readonly />
      <h6 class="mt-2">Resultados de Comprimir Reslpado:</h6>
      <b-form-textarea id="textarea2" v-model="detailsZip" rows="5" readonly />
      <h6 class="mt-2">Resultados de Subir Respaldo a Google Drive:</h6>
      <b-form-textarea id="textare3" v-model="detailsDrive" rows="5" readonly />
      <b-button variant="info" class="my-2" @click="hideModalDetails">
        Aceptar
      </b-button>
    </b-modal>
    <b-modal
      :id="'modal-details-reduce-' + sucursal"
      title="Detalles de Reduccion de Log"
      hide-footer
      header-bg-variant="dark"
      header-text-variant="info"
      body-text-variant="dark"
    >
      <h6>Resultados de Reducir Log:</h6>
      <b-form-textarea id="areaRed" v-model="detailsReduce" rows="8" readonly />
      <b-button variant="info" class="my-2" @click="hideModalReduce">
        Aceptar
      </b-button>
    </b-modal>
    <b-modal
      :id="'modal-details-files-' + sucursal"
      title="Data y Log"
      size="xl"
      hide-footer
      header-bg-variant="dark"
      header-text-variant="info"
      body-text-variant="dark"
    >
      <h6>Detalles de archivos fisicos:</h6>
      <b-table
        id="table-details-files"
        hover
        head-variant="dark"
        outlined
        :fields="fieldsFiles"
        :items="itemsFiles"
      ></b-table>
      <b-button variant="info" class="my-2" @click="hideModalFiles">
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
      detailsReduce: '{}',
      fields: [
        { key: 'DataBaseName', label: 'Base de Datos', sortable: true },
        { key: 'DataFileSizeMB', label: 'Tamaño de Data(MB)', sortable: true },
        { key: 'LogFileSizeMB', label: 'Tamaño Log(MB)', sortable: true },
        { key: 'Estatus', label: 'Estatus', sortable: true },
        { key: 'create_date', label: 'Creado', sortable: true },
        { key: 'LastBackup', label: 'Ultimo Respaldo', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: false },
      ],
      fieldsFiles: [
        { key: 'file_id', label: 'ID', sortable: true },
        { key: 'name', label: 'Nombre Logico', sortable: true },
        { key: 'type_desc', label: 'Tipo', sortable: true },
        { key: 'physical_name', label: 'Nombre Fisico', sortable: true },
        { key: 'sizeInMB', label: 'Tamaño', sortable: true },
        { key: 'max_size', label: 'Tamaño Maximo', sortable: true },
      ],
      utils,
      itemsFiles: [],
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
    HDDisk() {
      const data = [...this.$store.state.databases.data.data]
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      return sucFindIndex !== -1 && data[sucFindIndex].detailsHD
        ? data[sucFindIndex].detailsHD.Disco.toUpperCase()
        : '?'
    },
    HDValue() {
      const data = [...this.$store.state.databases.data.data]
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      return sucFindIndex !== -1 && data[sucFindIndex].detailsHD
        ? 100 - data[sucFindIndex].detailsHD.Porcentaje_Disponible
        : 0
    },
    HDAvailable() {
      const data = [...this.$store.state.databases.data.data]
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      return sucFindIndex !== -1 && data[sucFindIndex].detailsHD
        ? `${data[sucFindIndex].detailsHD.Disponible_GB} GB disponibles de ${data[sucFindIndex].detailsHD.total_GB} GB`
        : '?? GB disponibles de ?? GB'
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
      reduceLogDataBase: 'databases/reduceLogDataBase',
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
    haveDetailsReduce(data) {
      if (!data.resultReduceLog) return false
      const resultReduceLog = Object.keys(data.resultReduceLog)
      return resultReduceLog.length > 0
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
    hideModalFiles() {
      this.$bvModal.hide('modal-details-files-' + this.sucursal)
    },
    hideModalReduce() {
      this.$bvModal.hide('modal-details-reduce-' + this.sucursal)
    },
    showDetailsBackup(data) {
      this.detailsBack = JSON.stringify(data.resultBackup, undefined, 4)
      this.detailsZip = JSON.stringify(data.resultZip, undefined, 4)
      this.detailsDrive = JSON.stringify(data.resultUpload, undefined, 4)

      this.$bvModal.show('modal-details-backup-' + this.sucursal)
    },
    showDetailsReduce(data) {
      this.detailsReduce = JSON.stringify(data.resultReduceLog, undefined, 4)

      this.$bvModal.show('modal-details-reduce-' + this.sucursal)
    },
    showDetailsFiles(data) {
      this.itemsFiles = data.dataFiles.data || []
      this.$bvModal.show('modal-details-files-' + this.sucursal)
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
    approveReduceLog(items) {
      this.showAlertDialogOption([
        `¿Quiere reducir el log de la base de datos [${items.DataBaseName}]?`,
        'Confirmando Reduccion de Log',
        () => {
          this.hideAlertDialogOption()
          this.reduceLogDB(items)
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async reduceLogDB(items) {
      const dataLog = items.dataFiles.data
      const nameDataBase = items.DataBaseName
      if (dataLog) {
        const nameLog = dataLog.reduce((nameLogFile, file) => {
          if (file.type_desc === 'LOG') nameLogFile = file.name
          return nameLogFile
        }, '')
        if (nameLog === '')
          return this.showAlertDialog([
            'No se encontro el nombre logico del archivo Log',
            'Fallo en el nombre del archivo',
          ])
        else {
          const sucursal = this.sucursal
          this.setLoading(true)
          const response = await this.reduceLogDataBase([
            sucursal,
            nameDataBase,
            nameLog,
          ])
          this.setLoading(false)
          if (!response.success)
            this.showAlertDialog([response.message, 'Error inesperado'])
          else
            this.showAlertDialog([
              'Se ha reducido el tamaño del log de manera exitosa. <br/>Para ver los detalles vea en la acciones de la cada base de datos en "Detalles de Reduccion"<br/>Puede refrescar la tabla de datos y el grafico para ver los cambios, (tome en cuenta que esto borrara los detalles)',
              'Exito al Reducir',
              'info',
            ])
        }
      } else
        this.showAlertDialog([
          'No hay datos para reducir el Log',
          'Error en archivos',
        ])
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

.container-hd {
  float: right;
  position: relative;
  /* display: inline-block; */
  width: 410px;
  height: 80px;
  border-radius: 10px;
  border: 1px solid rgb(116, 116, 116);
  padding: 5px;
  margin-bottom: 10px;
}

.icon-hd {
  font-size: 60px;
  width: 100px;
}

.name-hd {
  position: absolute;
  top: 00px;
  left: 100px;
  width: 300px;
}

.progress-hd {
  position: absolute;
  top: 30px;
  left: 100px;
  width: 300px;
}

.disponible-hd {
  position: absolute;
  top: 50px;
  left: 100px;
  width: 300px;
}
</style>
