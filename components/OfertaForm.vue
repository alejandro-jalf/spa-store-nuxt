<template>
  <div>
    <b-card title="Crear una lista de ofertas" :class="variantTheme">
      <b-card-text>Datos necesarios</b-card-text>
      <b-form class="p-2">
        <b-input-group
          v-if="tipoUser === 'manager'"
          prepend="Tipo"
          class="mb-3 p-0 mr-2"
        >
          <template #prepend>
            <b-button disabled>Sucursal</b-button>
          </template>
          <b-form-select
            :value="suc"
            :options="options"
            @change="selectSucursal"
          ></b-form-select>
        </b-input-group>

        <b-input-group prepend="Tipo" class="mb-3 p-0 mr-2">
          <b-form-input
            ref="inputoftipo"
            v-model="form_oferta.tipo"
            type="text"
            required
            :readonly="disabled_tipo"
            :placeholder="form_oferta.placeholderTipo"
            class="bg-white"
            @click="clickInputTipo"
          ></b-form-input>
          <b-input-group-append>
            <b-dropdown
              id="btnSelectTipoid"
              ref="btnSelectTipo"
              size="sm"
              right
              text=""
              class="m-0"
              variant="primary"
            >
              <b-dropdown-item-button @click="setTipo('Sigma')">
                Sigma
              </b-dropdown-item-button>
              <b-dropdown-item-button @click="setTipo('Ofertas diarias')">
                Ofertas diarias
              </b-dropdown-item-button>
              <b-dropdown-item-button @click="setTipo('Ofertas de fin')">
                Ofertas de fin de semana
              </b-dropdown-item-button>
              <b-dropdown-item-button @click="setTipo('Otro')">
                Otro
              </b-dropdown-item-button>
            </b-dropdown>
          </b-input-group-append>
        </b-input-group>

        <b-input-group prepend="Fecha Inicio" class="mb-0 p-0 mr-2">
          <b-form-datepicker
            id="date-init"
            v-model="form_oferta.fecha_inicio"
            locale="es-MX"
            :state="isValidDateInit && dateStartIsGreater"
            label-no-date-selected="Fecha no seleccionada"
          ></b-form-datepicker>
        </b-input-group>
        <message-text
          :message="textMsgStart"
          :show-message="messageFechaEnd.show"
          :color-text="colorMsgStart"
          class="mb-3"
        ></message-text>

        <b-input-group
          prepend="Fecha Termino"
          class="mb-0 p-0 mr-2"
          description="We will convert your name to lowercase instantly"
        >
          <b-form-datepicker
            id="date-end"
            v-model="form_oferta.fecha_fin"
            locale="es-MX"
            :state="isValidDateEnd && dateStartIsGreater"
            label-no-date-selected="Fecha no seleccionada"
          ></b-form-datepicker>
        </b-input-group>
        <message-text
          :message="textMsgEnd"
          :color-text="colorMsgEnd"
          class="mb-3"
        ></message-text>
      </b-form>
      <b-form-group id="input-group-2" label="Descripcion" label-for="input-2">
        <b-form-textarea
          id="textarea"
          v-model="form_oferta.descripcion"
          placeholder="Breve descripcion"
          rows="3"
          max-rows="6"
          :class="backgroundInputTheme"
          @keyup="verifyTextArea"
        ></b-form-textarea>
        <message-text
          message="Solo pueden ser 1000 letras"
          :show-message="!state_textarea"
          color-text="text-danger"
          class="mb-2"
        ></message-text>
      </b-form-group>
      <b-button v-if="!editandoOferta" variant="success" @click="generarOFerta">
        <b-icon icon="file-earmark-plus-fill" />
        Generar lista de ofertas
      </b-button>
      <b-button
        v-if="editandoOferta"
        variant="success"
        @click="viewListArticles()"
      >
        Lista de articulos
        <b-icon icon="arrow-right-circle-fill" />
      </b-button>
      <b-button variant="warning" @click="setProgramandoOferta(false)">
        <b-icon icon="file-earmark-excel-fill" />
        Cerrar
      </b-button>
      <b-button
        v-if="editandoOferta"
        variant="primary"
        @click="prepareUpdateDataForm()"
      >
        <b-icon icon="check-circle-fill" />
        Guardar Cambios
      </b-button>
    </b-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import MessageText from './MessageText'

export default {
  components: {
    MessageText,
  },
  data() {
    return {
      utils,
      dataUser: this.$store.state.user.user,
      form_oferta: {
        placeholderTipo: 'Seleccione...',
        isVisibleTipo: false,
        isVisibleFechaI: false,
        isVisibleFechaF: false,
        tipo: '',
        fecha_inicio: '',
        fecha_inicio_complete: '',
        contextIni: '',
        fecha_fin: '',
        fecha_fin_complete: '',
        contextFin: '',
        descripcion: '',
      },
      disabled_tipo: true,
      state_date_end: false,
      state_date_start: false,
      state_textarea: true,
      messageTextArea: {
        color: 'text-secondary',
        message: 'Elija una fecha',
      },
      messageFechaStart: {
        show: true,
        color: 'text-secondary',
        message: 'Elija una fecha',
      },
      messageFechaEnd: {
        show: true,
        color: 'text-secondary',
        message: 'Elija una fecha',
      },
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
      ],
    }
  },
  computed: {
    tipoUser() {
      return this.$store.state.user.user.tipo_user
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
    editandoOferta() {
      return this.$store.state.ofertas.editandoOferta
    },
    textMsgStart() {
      const today = utils.getDateNow()
      const hora = ' 23:59:59.999'
      if (
        !this.form_oferta.fecha_inicio ||
        this.form_oferta.fecha_inicio === null ||
        this.form_oferta.fecha_inicio === ''
      )
        return 'Elija la fecha de inicio'
      const fechaFin = this.form_oferta.fecha_fin
        ? this.form_oferta.fecha_fin.split('T')
        : ['2100-01-01']
      const fechaIni = this.form_oferta.fecha_inicio.split('T')
      const dateEnd = utils.toMoment(fechaFin[0] + hora)
      const dateInit = utils.toMoment(fechaIni[0] + hora)
      if (dateInit < today)
        return 'La fecha de inicio no puede ser menor al dia actual'
      if (dateInit > dateEnd)
        return 'La fecha de inicio no puede ser mayor que la fecha de termino'
      return 'Fecha aprobada'
    },
    textMsgEnd() {
      if (
        !this.form_oferta.fecha_fin ||
        this.form_oferta.fecha_fin === null ||
        this.form_oferta.fecha_fin === ''
      )
        return 'Elija la fecha de termino'
      const today = utils.getDateNow()
      const hora = ' 23:59:59.999'
      const fechaFin = this.form_oferta.fecha_fin.split('T')
      const fechaIni = this.form_oferta.fecha_inicio
        ? this.form_oferta.fecha_inicio.split('T')
        : ['2000-01-01']
      const dateEnd = utils.toMoment(fechaFin[0] + hora)
      const dateInit = utils.toMoment(fechaIni[0] + hora)
      if (dateEnd < today)
        return 'La fecha de termino no puede ser menor que la fecha actual'
      if (dateInit > dateEnd)
        return 'La fecha de termino no puede ser menor que la fecha de inicio'
      return 'Fecha aprobada'
    },
    colorMsgStart() {
      if (
        !this.form_oferta.fecha_inicio ||
        this.form_oferta.fecha_inicio === null ||
        this.form_oferta.fecha_inicio === ''
      )
        return 'text-warning'
      const today = utils.getDateNow()
      const hora = ' 23:59:59.999'
      const fechaFin = this.form_oferta.fecha_fin
        ? this.form_oferta.fecha_fin.split('T')
        : ['2100-01-01']
      const fechaIni = this.form_oferta.fecha_inicio.split('T')
      const dateEnd = utils.toMoment(fechaFin[0] + hora)
      const dateInit = utils.toMoment(fechaIni[0] + hora)
      if (dateInit >= today && dateInit <= dateEnd) return 'text-success'
      return 'text-danger'
    },
    colorMsgEnd() {
      if (
        !this.form_oferta.fecha_fin ||
        this.form_oferta.fecha_fin === null ||
        this.form_oferta.fecha_fin === ''
      )
        return 'text-warning'
      const today = utils.getDateNow()
      const hora = ' 23:59:59.999'
      const fechaFin = this.form_oferta.fecha_fin.split('T')
      const fechaIni = this.form_oferta.fecha_inicio
        ? this.form_oferta.fecha_inicio.split('T')
        : ['2000-01-01']
      const dateEnd = utils.toMoment(fechaFin[0] + hora)
      const dateInit = utils.toMoment(fechaIni[0] + hora)
      if (dateEnd >= today && dateInit <= dateEnd) return 'text-success'
      return 'text-danger'
    },
    suc() {
      return this.$store.state.ofertas.sucursal
    },
    isValidDateInit() {
      const hora = ' 23:59:59.999'
      if (
        !this.form_oferta.fecha_inicio ||
        this.form_oferta.fecha_inicio.trim() === ''
      )
        return false
      const fechaIni = this.form_oferta.fecha_inicio.split('T')
      const dateInit = utils.toMoment(fechaIni[0] + hora)
      const today = utils.getDateNow()
      return dateInit >= today
    },
    isValidDateEnd() {
      const hora = ' 23:59:59.999'
      const fechaFin = this.form_oferta.fecha_fin.split('T')
      const dateEnd = utils.toMoment(fechaFin[0] + hora)
      const today = utils.getDateNow()
      return dateEnd > today
    },
    dateStartIsGreater() {
      const hora = ' 23:59:59.999'
      const fechaFin = this.form_oferta.fecha_fin
        ? this.form_oferta.fecha_fin.split('T')
        : ['2100-01-01']
      const fechaIni = this.form_oferta.fecha_inicio
        ? this.form_oferta.fecha_inicio.split('T')
        : ['2000-01-01']
      const dateEnd = utils.toMoment(fechaFin[0] + hora)
      const dateInit = utils.toMoment(fechaIni[0] + hora)
      return dateEnd >= dateInit
    },
  },
  mounted() {
    this.form_oferta.uuid = this.$store.state.ofertas.ofertaActual.tipo
    this.form_oferta.tipo = this.$store.state.ofertas.ofertaActual.tipoOferta
    this.form_oferta.fecha_inicio =
      this.$store.state.ofertas.ofertaActual.fechaInicio
    this.form_oferta.fecha_fin = this.$store.state.ofertas.ofertaActual.fechaFin
    this.form_oferta.descripcion =
      this.$store.state.ofertas.ofertaActual.descripcion

    if (this.tipoUser !== 'manager')
      this.setSucursal(utils.getSucursalByName(this.dataUser.sucursal_user))

    this.$root.$on('bv::dropdown::show', (bvEvent) => {
      if (bvEvent.componentId === 'btnSelectFechaF') {
      }
      if (bvEvent.componentId === 'btnSelectFechaI') {
      }
      if (bvEvent.componentId === 'btnSelectTipoid') {
      }
    })
    this.$root.$on('bv::dropdown::hide', (bvEvent) => {
      if (bvEvent.componentId === 'btnSelectFechaF') {
      }
      if (bvEvent.componentId === 'btnSelectFechaI') {
      }
      if (bvEvent.componentId === 'btnSelectTipoid') {
      }
    })
  },
  methods: {
    selectSucursal(sucursal) {
      this.setSucursal(sucursal)
    },
    validaFormulario() {
      if (this.form_oferta.tipo.trim() === '') {
        this.showAlertDialog(['Falta elejir el tipo de oferta'])
        return false
      }
      if (this.form_oferta.fecha_inicio.trim() === '') {
        this.showAlertDialog(['Falta seleccionar la fecha de inicio'])
        return false
      }
      if (this.form_oferta.fecha_fin.trim() === '') {
        this.showAlertDialog([
          'Falta seleccionar la fecha de termino de la oferta',
        ])
        return false
      }
      const today = utils.getDateNow()
      const hora = ' 23:59:59.999'
      const fechaFin = this.form_oferta.fecha_fin.split('T')
      const fechaIni = this.form_oferta.fecha_inicio.split('T')
      const dateEnd = utils.toMoment(fechaFin[0] + hora)
      const dateInit = utils.toMoment(fechaIni[0] + hora)
      if (dateInit < today) {
        this.showAlertDialog([
          'La fecha de inicio no puede ser menor que la fecha actual',
        ])
        return false
      }
      if (dateInit > dateEnd) {
        this.showAlertDialog([
          'La fecha de termino no puede ser menor que la fecha de inicio',
        ])
        return false
      }
      if (this.form_oferta.descripcion.trim() === '') {
        this.showAlertDialog(['Falta ingresar observaciones'])
        return false
      }
      return true
    },
    prepareUpdateDataForm() {
      this.showAlertDialogOption([
        '¿Quiere guardar los cambios en la oferta?',
        'Actualizando datos de la oferta',
        () => {
          this.hideAlertDialogOption()
          this.updateDataForm()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async updateDataForm() {
      if (!this.validaFormulario()) return false
      try {
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.sucursal
        const uuidMaster = this.$store.state.ofertas.ofertaActual.uuid
        const dateStart = this.form_oferta.fecha_inicio.includes('T')
          ? this.form_oferta.fecha_inicio.replace('Z', 'z')
          : this.form_oferta.fecha_inicio + 'T23:59:59.999z'
        const dateEnd = this.form_oferta.fecha_fin.includes('T')
          ? this.form_oferta.fecha_fin.replace('Z', 'z')
          : this.form_oferta.fecha_fin + 'T23:59:59.999z'
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase + 'api/v1/ofertas/' + sucursal + '/maestros/' + uuidMaster,
          method: 'put',
          data: {
            status: this.$store.state.ofertas.ofertaActual.estatus,
            editable: this.$store.state.ofertas.ofertaActual.editable,
            tipoOferta: this.form_oferta.tipo,
            fechaInicio: dateStart,
            fechaFin: dateEnd,
            descripcion: this.form_oferta.descripcion,
            modificadoPor: this.dataUser.correo_user,
          },
        })
        this.setLoading(false)

        this.showAlertDialog([response.data.message, 'Informacion', 'success'])
        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaOfertas([sucursal, 100])
          this.setLoading(false)
          this.setProgramandoLista(false)
          this.setProgramandoOferta(false)
        }
      } catch (error) {
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    viewListArticles() {
      this.setProgramandoOferta(false)
      this.setProgramandoLista(true)
    },
    async generarOFerta() {
      if (!this.validaFormulario()) return false
      const sucursal = this.$store.state.ofertas.sucursal
      const creadoPor = this.dataUser.correo_user
      const newOferta = {
        sucursal,
        status: 0,
        editable: true,
        tipoOferta: this.form_oferta.tipo,
        fechaInicio: this.form_oferta.fecha_inicio + 'T23:59:59.999z',
        fechaFin: this.form_oferta.fecha_fin + 'T23:59:59.999z',
        descripcion: this.form_oferta.descripcion,
        creadoPor,
      }

      this.setLoading(true)
      const response = await this.createMasterOffer(newOferta)
      this.setLoading(false)
      this.showAlertDialog([response.message, 'Informacion', 'success'])
      if (response.success) {
        response.data.newOffer.estatus = 0
        this.setLoading(true)
        await this.changeListaOfertas([sucursal, 100])
        this.setLoading(false)
        this.setListaArticulos({ data: [] })
        this.setProgramandoOferta(false)
        this.setProgramandoLista(true)
        this.openOferta(response.data.newOffer)
      }
    },
    ...mapMutations({
      setProgramandoLista: 'ofertas/setProgramandoLista',
      setProgramandoOferta: 'ofertas/setProgramandoOferta',
      openOferta: 'ofertas/openOferta',
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
      setListaArticulos: 'ofertas/setListaArticulos',
      setSucursal: 'ofertas/setSucursal',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      createMasterOffer: 'ofertas/createMasterOffer',
      changeListaOfertas: 'ofertas/changeListaOfertas',
    }),
    clickInputTipo() {
      if (this.disabled_tipo) {
        if (!this.form_oferta.isVisibleTipo) {
          this.form_oferta.isVisibleTipo = true
          this.$refs.btnSelectTipo.show()
        } else {
          this.form_oferta.isVisibleTipo = false
          this.$refs.btnSelectTipo.hide()
        }
      }
    },
    setTextTipo(text) {
      this.disabled_tipo = true
      this.form_oferta.tipo = text
      this.form_oferta.placeholderTipo = 'Seleccione...'
    },
    setTipo(tipo) {
      if (tipo === 'Otro') {
        this.disabled_tipo = false
        this.form_oferta.tipo = ''
        this.form_oferta.placeholderTipo = 'Escriba el tipo de oferta'
        this.$refs.inputoftipo.focus()
        return
      }
      if (tipo === 'Sigma') {
        this.setTextTipo('Sigma')
        return true
      }
      if (tipo === 'Ofertas diarias') {
        this.setTextTipo('Ofertas diarias')
        return true
      }
      if (tipo === 'Ofertas de fin') {
        this.setTextTipo('Ofertas de fin de semana')
        return true
      }
    },
    verifyTextArea(evt) {
      if (this.form_oferta.descripcion.length > 1001) {
        this.form_oferta.descripcion = this.form_oferta.descripcion.slice(
          0,
          1001
        )
        this.state_textarea = false
      } else {
        this.state_textarea = true
      }
    },
  },
}
</script>
