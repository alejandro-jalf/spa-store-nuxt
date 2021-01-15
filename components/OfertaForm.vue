<template>
  <div>
    <b-card title="Crear una lista de ofertas">
      <b-card-text>Datos necesarios</b-card-text>
      <b-form class="p-2">
        <b-input-group prepend="Tipo" class="mb-3 p-0 mr-2">
          <template #prepend>
            <b-button disabled>Tipo</b-button>
          </template>
          <b-form-input
            ref="inputoftipo"
            v-model="form_oferta.tipo"
            type="text"
            required
            :readonly="disabled_tipo"
            placeholder="Seleccione..."
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
          <template #prepend>
            <b-button disabled>Fecha Inicio</b-button>
          </template>
          <b-form-input
            id="input-of-fechaini"
            v-model="form_oferta.fecha_inicio_complete"
            type="text"
            required
            readonly
            placeholder="Inicio de oferta"
            class="bg-white"
            :state="state_date_start"
            @click="clickInputFechaI"
          ></b-form-input>
          <b-input-group-append>
            <b-dropdown
              id="btnSelectFechaI"
              ref="btnSelectFechaIR"
              size="sm"
              right
              text=""
              class="m-0"
              variant="primary"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template #button-content>
                <b-icon-calendar-2-date></b-icon-calendar-2-date>
              </template>
              <b-dropdown-form class="text-center">
                <b-calendar
                  v-model="form_oferta.fecha_inicio"
                  selected-variant="success"
                  today-variant="info"
                  nav-button-variant="primary"
                  @context="setContextIni"
                ></b-calendar>
              </b-dropdown-form>
              <b-dropdown-item-button>
                <b-button block variant="primary">Aceptar</b-button>
              </b-dropdown-item-button>
            </b-dropdown>
          </b-input-group-append>
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
          <template #prepend>
            <b-button disabled>Fecha Termino</b-button>
          </template>
          <b-form-input
            id="input-of-fechafin"
            v-model="form_oferta.fecha_fin_complete"
            type="text"
            required
            readonly
            placeholder="Termino de oferta"
            class="bg-white"
            :state="state_date_end"
            @click="clickInputFechaR"
          ></b-form-input>
          <b-input-group-append>
            <b-dropdown
              id="btnSelectFechaF"
              ref="btnSelectFechaFR"
              size="sm"
              right
              text=""
              toggle-class="text-decoration-none"
              no-caret
              class="m-0"
              variant="primary"
            >
              <template #button-content>
                <b-icon-calendar-2-date></b-icon-calendar-2-date>
              </template>
              <b-dropdown-form class="text-center">
                <b-calendar
                  v-model="form_oferta.fecha_fin"
                  selected-variant="success"
                  today-variant="info"
                  nav-button-variant="primary"
                  @context="setContextFin"
                ></b-calendar>
              </b-dropdown-form>
              <b-dropdown-item-button>
                <b-button block variant="primary">Aceptar</b-button>
              </b-dropdown-item-button>
            </b-dropdown>
          </b-input-group-append>
        </b-input-group>
        <message-text
          :message="textMsgEnd"
          :show-message="messageFechaStart.show"
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
        <b-icon-file-earmark-plus-fill></b-icon-file-earmark-plus-fill>
        Generar lista de ofertas
      </b-button>
      <b-button
        v-if="editandoOferta"
        variant="success"
        @click="setDataUpdateForm()"
      >
        Lista de articulos
        <b-icon-arrow-right-circle-fill></b-icon-arrow-right-circle-fill>
      </b-button>
      <b-button variant="warning" @click="setProgramandoOferta(false)">
        <b-icon-file-earmark-excel-fill></b-icon-file-earmark-excel-fill>
        Cancelar
      </b-button>
    </b-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {
  BIconCalendar2Date,
  BIconFileEarmarkPlusFill,
  BIconFileEarmarkExcelFill,
  BIconArrowRightCircleFill,
} from 'bootstrap-vue'
import MessageText from './MessageText'

export default {
  components: {
    BIconCalendar2Date,
    MessageText,
    BIconFileEarmarkPlusFill,
    BIconFileEarmarkExcelFill,
    BIconArrowRightCircleFill,
  },
  data() {
    return {
      form_oferta: {
        clickTipo: false,
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
    }
  },
  computed: {
    editandoOferta() {
      return this.$store.state.ofertas.editandoOferta
    },
    textMsgStart() {
      if (this.form_oferta.fecha_inicio === '') {
        return 'Elija una fecha'
      }
      if (!this.state_date_start) {
        return 'La fecha no puede ser menor al dia actual'
      }
      return 'Fecha aprobada'
    },
    textMsgEnd() {
      if (this.form_oferta.fecha_fin === '') {
        return 'Elija una fecha'
      }
      if (!this.state_date_end) {
        return 'La fecha de termino no puede ser menor a la fecha inicio'
      }
      return 'Fecha aprobada'
    },
    colorMsgStart() {
      if (this.form_oferta.fecha_inicio === '') {
        return 'text-secondary'
      }
      if (this.state_date_start) {
        return 'text-success'
      }
      return 'text-danger'
    },
    colorMsgEnd() {
      if (this.form_oferta.fecha_fin === '') {
        return 'text-secondary'
      }
      if (this.state_date_end) {
        return 'text-success'
      }
      return 'text-danger'
    },
  },
  mounted() {
    this.form_oferta.uuid = this.$store.state.ofertas.ofertaActual.tipo
    this.form_oferta.tipo = this.$store.state.ofertas.ofertaActual.tipoOferta
    this.form_oferta.fecha_inicio = this.$store.state.ofertas.ofertaActual.fechaInico
    this.form_oferta.fecha_fin = this.$store.state.ofertas.ofertaActual.fechaFin
    this.form_oferta.descripcion = this.$store.state.ofertas.ofertaActual.descripcion
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
      const dateStart = new Date(this.form_oferta.contextIni.activeDate)
      const today = this.getDateWithTime0()
      if (dateStart < today) {
        this.showAlertDialog([
          'La fecha de inicio no puede ser menor que la fecha actual',
        ])
        return false
      }
      const dateEnd = new Date(this.form_oferta.contextFin.activeDate)
      if (dateStart > dateEnd) {
        this.showAlertDialog([
          'La fecha de termino no puede ser menor que la fecha de inicio',
        ])
        return false
      }
      return true
    },
    setDataUpdateForm() {
      const newOferta = {
        tipoOferta: this.form_oferta.tipo,
        fechaInico: this.form_oferta.fecha_inicio,
        fechaFin: this.form_oferta.fecha_fin,
        descripcion: this.form_oferta.descripcion,
      }
      this.updateDataForm(newOferta)
      this.setProgramandoOferta(false)
      this.setProgramandoLista(true)
    },
    pseudoUuid() {
      const ramdonNum = parseInt(Math.random() * 100000)
      return 'Oferta_' + ramdonNum
    },
    generarOFerta() {
      if (!this.validaFormulario()) {
        return false
      }
      const uuid = this.pseudoUuid()
      const newOferta = {
        status: 'En espera',
        uuid,
        tipoOferta: this.form_oferta.tipo,
        fechaInico: this.form_oferta.fecha_inicio,
        fechaFin: this.form_oferta.fecha_fin,
        descripcion: this.form_oferta.descripcion,
        listaProductos: [],
      }
      this.openOferta(newOferta)
      this.setProgramandoOferta(false)
      this.setProgramandoLista(true)
    },
    ...mapMutations({
      setProgramandoLista: 'ofertas/setProgramandoLista',
      setProgramandoOferta: 'ofertas/setProgramandoOferta',
      openOferta: 'ofertas/openOferta',
      updateDataForm: 'ofertas/updateDataForm',
      showAlertDialog: 'general/showAlertDialog',
    }),
    getDateWithTime0() {
      const fecha = new Date()
      let mes = (fecha.getMonth() + 1).toString()
      mes = mes.length < 2 ? '0' + mes : mes

      let dia = fecha.getDate().toString()
      dia = dia.length < 2 ? '0' + dia : dia

      const newDate =
        fecha.getFullYear() + '-' + mes + '-' + dia + 'T06:00:00.000Z'
      return new Date(newDate)
    },
    setStateDateStart() {
      const dateStart = new Date(this.form_oferta.contextIni.activeDate)
      const today = this.getDateWithTime0()
      const dateEnd = new Date(this.form_oferta.contextFin.activeDate)
      if (dateStart === 'Invalid Date') {
        this.state_date_start = false
        return true
      }
      if (dateStart < today) {
        this.state_date_start = false
      } else {
        this.state_date_start = true
      }
      if (dateEnd !== 'Invalid Date' && dateEnd < dateStart) {
        this.state_date_end = false
      } else {
        this.state_date_end = true
      }
    },
    setStateDateEnd() {
      const fechaInicio = new Date(this.form_oferta.contextIni.activeDate)
      const fechaFin = new Date(this.form_oferta.contextFin.activeDate)
      if (fechaFin === 'Invalid Date') {
        this.state_date_start = false
        return true
      }
      if (fechaInicio > fechaFin) {
        this.state_date_end = false
      } else {
        this.state_date_end = true
      }
    },
    setContextIni(ctx) {
      this.form_oferta.contextIni = ctx
      this.form_oferta.fecha_inicio_complete = ctx.selectedFormatted
      this.setStateDateStart()
    },
    setContextFin(ctx) {
      this.form_oferta.contextFin = ctx
      this.form_oferta.fecha_fin_complete = ctx.selectedFormatted
      this.setStateDateEnd()
    },
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
    clickInputFechaR() {
      if (!this.form_oferta.isVisibleFechaF) {
        this.form_oferta.isVisibleFechaF = true
        this.$refs.btnSelectFechaFR.show()
      } else {
        this.$refs.btnSelectFechaFR.hide()
        this.form_oferta.isVisibleFechaF = false
      }
    },
    clickInputFechaI() {
      if (!this.form_oferta.isVisibleFechaI) {
        this.form_oferta.isVisibleFechaI = true
        this.$refs.btnSelectFechaIR.show()
      } else {
        this.form_oferta.isVisibleFechaI = false
        this.$refs.btnSelectFechaIR.hide()
      }
    },
    setTextTipo(text) {
      this.disabled_tipo = true
      this.form_oferta.tipo = text
    },
    setTipo(tipo) {
      if (tipo === 'Otro') {
        this.disabled_tipo = false
        this.form_oferta.tipo = ''
        this.$refs.inputoftipo.focus()
        return true
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
