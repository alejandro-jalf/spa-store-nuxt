<template>
  <div>
    <h4 class="text-center my-4">Monitor de Articulos</h4>
    <div v-if="viewList">
      <b-input-group prepend="Sucursal" size="sm" class="mb-2">
        <b-form-select
          :value="sucursal"
          :options="options"
          @change="setSucursal"
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
          {{ refactorSucursal(row.item.sucursal) }}
        </template>
        <template #cell(Acciones)="row">
          <b-button v-if="isSucursal(row)" variant="info" size="sm">
            <b-icon icon="telegram" /> Enviar
          </b-button>
          <b-button v-if="isSucursal(row)" variant="warning" size="sm">
            <b-icon icon="x-circle-fill" /> Cancelar
          </b-button>
          <b-button v-if="isSucursal(row)" variant="secondary" size="sm">
            <b-icon icon="pencil-square" /> Editar
          </b-button>
          <b-button v-if="isCancel(row)" variant="success" size="sm">
            <b-icon icon="arrow-up-left-circle-fill" /> Restaurar
          </b-button>
          <b-button v-if="isCancel(row)" variant="danger" size="sm">
            <b-icon icon="trash-fill" /> Eliminar
          </b-button>
          <b-button v-if="isSending(row)" variant="info" size="sm">
            <b-icon icon="arrow-up-right-circle-fill" /> En Proceso
          </b-button>
          <b-button v-if="isInProcess(row)" variant="info" size="sm">
            <b-icon icon="patch-check-fill" /> Atendido
          </b-button>
          <b-button v-if="isAtendido(row)" variant="info" size="sm">
            <b-icon icon="eye-fill" /> Ver
          </b-button>
        </template>
      </b-table>
    </div>
    <div v-else>
      <h5>Solicitud</h5>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      sucursal: 'ALL',
      options: [
        { value: 'ALL', text: 'Todas' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
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
    }),
    ...mapActions({
      changeData: 'solicitudarticulo/changeData',
      createRequest: 'solicitudarticulo/createRequest',
    }),
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
      const dateMoment = utils.toMoment(date.replaceAll('z', ''))
      return dateMoment.format('DD/MM/YYYY hh:mm a')
    },
    refactorSucursal(sucRe) {
      return this.options.reduce((suc, sucursal) => {
        if (sucursal.value === sucRe) suc = sucursal.text
        return suc
      }, 'Zaragoza')
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.sucursal = sucUser
        this.setSucursal(sucUser)
      } else this.sucursal = this.$store.state.solicitudarticulo.sucursal
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
  },
}
</script>
