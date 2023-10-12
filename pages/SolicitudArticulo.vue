<template>
  <div>
    <h4 class="text-center my-4">Monitor de Articulos</h4>
    <div v-if="viewList">
      <b-input-group prepend="Sucursal" size="sm" class="mb-2">
        <b-form-select
          :value="sucursal"
          :options="options"
          :disabled="!accessChangeSucursal || isArticlesMaker"
          @change="changeSucursal"
        />
      </b-input-group>
      <b-button variant="info" size="sm" @click="loadData">
        <b-icon icon="arrow-repeat" />
        Refrescar
      </b-button>
      <b-button variant="info" size="sm" to="/existenciasarticulo">
        <b-icon icon="question-circle-fill" />
        Verificar si existe
      </b-button>

      <b-button
        v-if="!isArticlesMaker"
        variant="success"
        size="sm"
        class="float-right"
        :disabled="isAll"
        @click="prepareCreateSolicitud"
      >
        <b-icon icon="plus-circle-fill" />
        Nuevo
      </b-button>
      <b-table
        hover
        small
        head-variant="dark"
        sticky-header="750px"
        outlined
        :fields="fields"
        :items="dataSolicitudes"
        :class="variantThemeTableBody"
        class="mt-2"
      >
        <template #cell(FechaCreado)="row">
          {{ refactorFecha(row.item.FechaCreado) }}
        </template>
        <template #cell(sucursal)="row">
          {{ refactorSucursal(row.item.Sucursal) }}
        </template>
        <template #cell(Nombre)="row">
          {{ refactorName(row) }}
        </template>
        <template #cell(Acciones)="row">
          <b-button
            v-if="isSucursal(row) && allowView('EN SUCURSAL', row)"
            variant="info"
            size="sm"
            @click="
              prepareChangeEstatus('ENVIADO', row.item.UUID, row.item.Articulo)
            "
          >
            <b-icon icon="telegram" /> Enviar
          </b-button>
          <b-button
            v-if="isSucursal(row) && allowView('EN SUCURSAL', row)"
            variant="warning"
            size="sm"
            @click="
              prepareChangeEstatus(
                'CANCELADO',
                row.item.UUID,
                row.item.Articulo
              )
            "
          >
            <b-icon icon="x-circle-fill" /> Cancelar
          </b-button>
          <b-button
            v-if="isSucursal(row) && allowView('EN SUCURSAL', row)"
            variant="secondary"
            size="sm"
            @click="openRequest('EDIT', row.item.UUID)"
          >
            <b-icon icon="pencil-square" /> Editar
          </b-button>
          <b-button
            v-if="isCancel(row) && allowView('CANCELADO', row)"
            variant="success"
            size="sm"
            @click="
              prepareChangeEstatus(
                'EN SUCURSAL',
                row.item.UUID,
                row.item.Articulo
              )
            "
          >
            <b-icon icon="arrow-up-left-circle-fill" /> Restaurar
          </b-button>
          <b-button
            v-if="isCancel(row) && allowView('CANCELADO', row)"
            variant="danger"
            size="sm"
            @click="prepareDeleteRequest(row.item.UUID)"
          >
            <b-icon icon="trash-fill" /> Eliminar
          </b-button>
          <b-button
            v-if="isSending(row) && allowView('ENVIADO', row)"
            variant="info"
            size="sm"
            @click="
              prepareChangeEstatus(
                'EN PROCESO',
                row.item.UUID,
                row.item.Articulo
              )
            "
          >
            <b-icon icon="arrow-up-right-circle-fill" /> En Proceso
          </b-button>
          <b-button
            v-if="isInProcess(row) && allowView('EN PROCESO', row)"
            variant="info"
            size="sm"
            @click="openModal(row.item.UUID)"
          >
            <b-icon icon="patch-check-fill" /> Atendido
          </b-button>
          <b-button
            v-if="isAtendido(row) || isInProcess(row)"
            variant="info"
            size="sm"
            @click="openRequest('VIEW', row.item.UUID)"
          >
            <b-icon icon="eye-fill" /> Ver
          </b-button>
          <div v-if="isSucursal(row) && !allowView('EN SUCURSAL', row)">
            <b-spinner
              v-for="(canti, position) in 5"
              :key="position"
              style="width: 6px; height: 6px"
              class="ml-1"
              variant="success"
              type="grow"
            ></b-spinner>
          </div>
        </template>
      </b-table>
    </div>
    <SolicitudArticuloView v-else :load-data="loadData" />
    <b-modal
      id="modal-li-c"
      hide-footer
      header-bg-variant="info"
      header-text-variant="white"
      body-text-variant="dark"
    >
      <template #modal-title>Codigo de Articulo</template>
      <b-form-group id="gpCode" label="Codigo de WinCaja:" label-for="ipCode">
        <b-form-input
          id="ipCode"
          v-model="codigo"
          type="text"
          placeholder="Codigo del Articulo"
          :state="validation"
          required
          autocomplete="off"
        ></b-form-input>
        <b-form-invalid-feedback :state="validation">
          Codigo No Puede Quedar Vacio
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="float-right">
        <b-button class="mt-3" @click="$bvModal.hide('modal-li-c')">
          Cancelar
        </b-button>
        <b-button variant="info" class="mt-3 ml-2" @click="atender">
          Aceptar
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import SolicitudArticuloView from '../components/SolicitudArticuloView'
import utils from '../modules/utils'

export default {
  components: {
    SolicitudArticuloView,
  },
  data() {
    return {
      uuid: '',
      codigo: '',
      validation: true,
      sucursal: 'ALL',
      options: [
        { value: 'ALL', text: 'Todas' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'SC', text: 'Soconusco' },
        { value: 'JL', text: 'Jaltipan' },
      ],
      fields: [
        { key: 'Consecutivo', label: '#', sortable: true },
        { key: 'Sucursal', label: 'Sucursal', sortable: true },
        { key: 'FechaCreado', label: 'Fecha', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Estatus', label: 'Estatus', sortable: true },
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: false },
      ],
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    isAll() {
      return this.$store.state.solicitudarticulo.sucursal === 'ALL'
    },
    viewList() {
      return this.$store.state.solicitudarticulo.ventana === 'LIST'
    },
    dataSolicitudes() {
      const data = [...this.$store.state.solicitudarticulo.data.data]
      data.forEach((request) => {
        if (request.Estatus === 'ENVIADO') request._rowVariant = 'warning'
        else if (request.Estatus === 'CANCELADO') request._rowVariant = 'danger'
        else if (request.Estatus === 'ATENDIDO') request._rowVariant = 'success'
        else if (request.Estatus === 'EN PROCESO') request._rowVariant = 'info'
      })
      return data
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    isArticlesMaker() {
      return (
        this.$store.state.user.user.correo_user === 'auditoriaspamx@gmail.com'
      )
    },
  },
  mounted() {
    this.setSucursalForUser()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
      setSucursal: 'solicitudarticulo/setSucursal',
      setVentana: 'solicitudarticulo/setVentana',
      setTipoSolicitud: 'solicitudarticulo/setTipoSolicitud',
    }),
    ...mapActions({
      changeData: 'solicitudarticulo/changeData',
      createRequest: 'solicitudarticulo/createRequest',
      loadSolicitud: 'solicitudarticulo/loadSolicitud',
      changeEstatus: 'solicitudarticulo/changeEstatus',
      deleteRequest: 'solicitudarticulo/deleteRequest',
    }),
    allowView(from, row) {
      const userActual = this.$store.state.user.user.correo_user
      const isOwner = row.item.CreadoPor === userActual
      const isManager = this.$store.state.user.user.tipo_user === 'manager'
      if (from === 'EN SUCURSAL') return isOwner
      else if (from === 'ENVIADO') return isManager
      else if (from === 'CANCELADO') return isOwner
      else if (from === 'EN PROCESO') return isManager
      return false
    },
    refactorName(row) {
      const Nombre = row.item.Nombre
      const TipoModelo = row.item.TipoModelo
      const Marca = row.item.Marca
      const Presentacion = row.item.Presentacion
      return `${Nombre} ${TipoModelo} ${Marca} ${Presentacion}`
    },
    isSucursal(row) {
      return row.item.Estatus === 'EN SUCURSAL'
    },
    isSending(row) {
      return row.item.Estatus === 'ENVIADO'
    },
    isCancel(row) {
      return row.item.Estatus === 'CANCELADO'
    },
    isInProcess(row) {
      return row.item.Estatus === 'EN PROCESO'
    },
    isAtendido(row) {
      return row.item.Estatus === 'ATENDIDO'
    },
    refactorFecha(date) {
      const dateMoment = utils.toMoment(date.replace(/Z/g, ''))
      return dateMoment.format('DD/MM/YYYY hh:mm a')
    },
    refactorSucursal(sucRe) {
      return this.options.reduce((suc, sucursal) => {
        if (sucursal.value === sucRe) suc = sucursal.text
        return suc
      }, 'Zaragoza')
    },
    openModal(uuid) {
      this.uuid = uuid
      this.$bvModal.show('modal-li-c')
    },
    atender() {
      if (this.codigo.trim() === '') this.validation = false
      else {
        this.validation = true
        this.$bvModal.hide('modal-li-c')
        this.saveEstatus('ATENDIDO', this.uuid, this.codigo)
      }
    },
    changeSucursal(sucursal) {
      this.setSucursal(sucursal)
      this.sucursal = sucursal
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.sucursal = sucUser
        this.setSucursal(sucUser)
      } else if (this.isArticlesMaker) {
        this.sucursal = 'ALL'
        this.setSucursal('ALL')
      } else this.sucursal = this.$store.state.solicitudarticulo.sucursal
    },
    async openRequest(type, uuid) {
      this.setLoading(true)
      const response = await this.loadSolicitud([uuid])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.setTipoSolicitud(type)
        this.setVentana('EDIT_NEW')
      }
    },
    async loadData() {
      const sucursal = this.$store.state.solicitudarticulo.sucursal
      this.setLoading(true)
      const response = await this.changeData([sucursal])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    prepareCreateSolicitud() {
      this.showAlertDialogOption([
        `¿Quiere solicitar un nuevo articulo?`,
        'Solicitando articulo',
        () => {
          this.hideAlertDialogOption()
          this.newRequest()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async newRequest() {
      const sucursal = this.$store.state.solicitudarticulo.sucursal
      const correo = this.$store.state.user.user.correo_user
      this.setLoading(true)
      const response = await this.createRequest([sucursal, correo])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.loadData()
    },
    prepareChangeEstatus(estatus, UUID, Articulo) {
      let message = ''
      if (estatus === 'CANCELADO') message = '¿Quiere Cancelar la solicitud?'
      if (estatus === 'ENVIADO') message = '¿Quiere Enviar la solicitud?'
      if (estatus === 'EN SUCURSAL') message = '¿Quiere Restaurar la solicitud?'
      if (estatus === 'EN PROCESO')
        message = '¿Quiere poner En Proceso la solicitud?'
      this.showAlertDialogOption([
        message,
        'Cambiando Estatus',
        () => {
          this.hideAlertDialogOption()
          this.saveEstatus(estatus, UUID, Articulo)
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async saveEstatus(Estatus, UUID, Articulo) {
      this.setLoading(true)
      const response = await this.changeEstatus([UUID, Estatus, Articulo])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.loadData()
    },
    prepareDeleteRequest(UUID) {
      this.showAlertDialogOption([
        `¿Quiere eliminar esta solicitud de manera permanente?`,
        'Eliminando Solicitud',
        () => {
          this.hideAlertDialogOption()
          this.deleteSolicitud(UUID)
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async deleteSolicitud(UUID) {
      this.setLoading(true)
      const response = await this.deleteRequest([UUID])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.loadData()
    },
  },
}
</script>
