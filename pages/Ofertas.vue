<template>
  <div>
    <h1 class="text-center">Programacion de ofertas</h1>
    <b-input-group
      v-if="tipoUser === 'manager' && viewCrearOferta"
      prepend="Sucursal"
      class="mt-3 mb-3"
    >
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-form-input
          id="input-limit"
          v-model="limit"
          v-b-tooltip.hover
          title="Limite de ofertas. 0 significa todas"
          value="100"
          placeholder="Limite"
          type="number"
          size="sm"
          min="0"
          class="h-100 w-25"
          :class="backgroundInputTheme"
          @keyup.enter="reloadListaOfertas"
        ></b-form-input>
        <b-button variant="info" @click="reloadListaOfertas">Buscar</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-button
      v-if="viewCrearOferta"
      variant="success"
      class="mb-3"
      @click="programarOferta()"
    >
      <b-icon icon="folder-plus" />
      Crear Lista de Ofertas
    </b-button>
    <b-button variant="info" class="mb-3" @click="showStepper = true">
      <b-icon icon="question-circle-fill"></b-icon>
      Ayuda
    </b-button>
    <div v-if="viewCrearOferta" id="groupDate">
      <b-button-group>
        <b-button
          :pressed="activeDateM"
          variant="outline-primary"
          @click="setActiveDate('month')"
        >
          {{ textDateM }}
        </b-button>
        <b-button
          :pressed="activeDateY"
          variant="outline-primary"
          @click="setActiveDate('year')"
        >
          {{ textDateY }}
        </b-button>
        <b-button
          :pressed="activeDateA"
          variant="outline-primary"
          @click="setActiveDate('all')"
        >
          Todas
        </b-button>
      </b-button-group>
    </div>
    <div v-if="viewCrearOferta" class="groupDate">
      <b-button
        :pressed="onlyIcons"
        :variant="themeButtonClose"
        @click="setOnlyIcons(!onlyIcons)"
      >
        <b-icon :icon="iconOnlyIcons"></b-icon>
        Solo Iconos En Acciones
      </b-button>
    </div>
    <oferta-form v-if="programandoOferta" class="pt-2 pb-2 mb-3"></oferta-form>
    <oferta-lista
      v-if="programandoListaOferta"
      class="pb-2 mb-3"
      :prepare-change-status-offer="prepareChangeStatusOffer"
      :visible-button="visibleButton"
      :validate-articles-for-program="validateArticlesForProgram"
    ></oferta-lista>
    <div v-if="viewCrearOferta" class="container-table-ofe">
      <b-table
        hover
        head-variant="dark"
        fixed
        outlined
        responsive
        :items="listaOfertas"
        :fields="fields"
        :class="variantThemeTableBody"
      >
        <template #cell(Articulos)="row">
          <b-badge
            pill
            variant="info"
            class="py-1 px-2"
            style="font-size: 14px"
          >
            {{ row.item.Articulos }}
          </b-badge>
        </template>
        <template #cell(Acciones)="row">
          <b-button
            v-if="visibleButton(row.item, 'views')"
            v-b-tooltip.hover
            :title="msgTooltipDetails(row.item.estatus)"
            variant="info"
            size="sm"
            class="mr-2 mt-2"
            @click="viewDetails(row.item.uuid, row.item)"
          >
            <b-icon :icon="getIconDetail(row.item.estatus)" />
            {{ detailsMessage(row.item.estatus) }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'validate')"
            v-b-tooltip.hover
            :title="tooltipMessage('Validar')"
            class="mr-2 mt-2"
            size="sm"
            variant="success"
            @click="validateArticlesForProgram(row.item)"
          >
            <b-icon icon="info-circle-fill" />
            {{ messageButtonIcons('Validar') }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'check')"
            v-b-tooltip.hover
            :title="tooltipMessage('Verificar')"
            class="mr-2 mt-2"
            size="sm"
            variant="success"
            @click="verifyArticlesOffered(row.item)"
          >
            <b-icon icon="binoculars-fill" />
            {{ messageButtonIcons('Verificar') }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'action')"
            v-b-tooltip.hover
            :title="msgTooltipAction(row.item.estatus)"
            class="mr-2 mt-2"
            size="sm"
            :variant="variantStatus(row.item.estatus)"
            @click="prepareChangeStatusOffer(row.item)"
          >
            <b-icon icon="folder-symlink-fill" />
            {{ messageButton(row.item.estatus) }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'cancelar')"
            v-b-tooltip.hover
            :title="tooltipMessage('Cancelar')"
            class="mr-2 mt-2"
            size="sm"
            variant="danger"
            @click="prepareCancelOffer(row.item)"
          >
            <b-icon icon="x-circle-fill" />
            {{ messageButtonIcons('Cancelar') }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'eliminar')"
            v-b-tooltip.hover
            :title="tooltipMessage('Eliminar')"
            size="sm"
            class="mr-2 mt-2"
            variant="danger"
            @click="prepareDeleteOffer(row.item)"
          >
            <b-icon icon="trash-fill" />
            {{ messageButtonIcons('Eliminar') }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'excel')"
            v-b-tooltip.hover
            :title="tooltipMessage('Descargar Excel')"
            class="mr-2 mt-2"
            size="sm"
            variant="light"
            @click="generateExcel(row.item)"
          >
            <b-icon icon="download" />
            {{ messageButtonIcons('EXCEL') }}
          </b-button>
          <div v-if="visibleButton(row.item, 'load')">
            <b-spinner
              v-for="(canti, position) in 9"
              :key="position"
              style="width: 6px; height: 6px"
              class="ml-1"
              variant="success"
              type="grow"
            ></b-spinner>
          </div>
        </template>
        <template #cell(sucursal)="row">
          {{ nameSuc(row.item.sucursal) }}
        </template>
        <template #cell(estatus)="row">
          {{ parseStatusOferta(row.item.estatus).toUpperCase() }}
        </template>
        <template #cell(fechaInico)="row">
          {{ utils.parseFecha(row.item.fechaInicio) }}
        </template>
        <template #cell(tipoOferta)="row">
          {{ row.item.tipoOferta }}
        </template>
        <template #cell(fechaFin)="row">
          {{ utils.parseFecha(row.item.fechaFin) }}
        </template>
      </b-table>
    </div>
    <OfertaArticulosValidados v-if="showDetails" />
    <OfertaArticulosOfertados v-if="showOffered" />
    <float-button
      v-if="tipoUser !== 'manager'"
      :click-float="reloadListaOfertas"
    ></float-button>
    <Stepper
      v-if="showStepper"
      :steppers="steppers"
      :close-stepper="closeStepper"
    />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import OfertaForm from '../components/OfertaForm'
import OfertaLista from '../components/OfertaLista'
import OfertaArticulosValidados from '../components/OfertaArticulosValidados'
import OfertaArticulosOfertados from '../components/OfertaArticulosOfertados'
import FloatButton from '../components/FloatButton'
import Stepper from '../components/Stepper'
import utils from '../modules/utils'

export default {
  components: {
    Stepper,
    OfertaForm,
    OfertaLista,
    FloatButton,
    OfertaArticulosValidados,
    OfertaArticulosOfertados,
  },
  data() {
    return {
      dataUser: this.$store.state.user.user,
      activeDateY: false,
      activeDateM: true,
      activeDateA: false,
      textDateY: '',
      textDateM: '',
      active: 'month',
      utils,
      fields: [
        'sucursal',
        'Articulos',
        'estatus',
        'tipoOferta',
        'fechaInico',
        'fechaFin',
        'descripcion',
        'Acciones',
      ],
      selected: 'ZR',
      options: [
        { value: 'ALL', text: 'TODAS' },
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
      ],
      limit: 100,
      showStepper: false,
      steppers: [
        {
          title: '¿Como actualizar la lista de ofertas?',
          image: 'tool.png',
          content:
            'Para actualizar la lista de ofertas, precione el boton de refrescar, que por lo general se encuentra ubicado en la parte inferior derecha. Con lo cual al dar click comenzara el proceso de busqueda.',
        },
        {
          title: '¿Como crear una nueva lista de ofertas?',
          image: 'cesta.png',
          content:
            'Para actualizar la lista de ofertas, precione el boton de refrescar, que por lo general se encuentra ubicado en la parte inferior derecha. Con lo cual al dar click comenzara el proceso de busqueda.',
        },
      ],
    }
  },
  computed: {
    onlyIcons() {
      return this.$store.state.ofertas.onlyIcons
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    showDetails() {
      return this.$store.state.ofertas.detallesValidacion.show
    },
    themeButtonClose() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    iconOnlyIcons() {
      return this.onlyIcons ? 'check-square' : 'square'
    },
    showOffered() {
      return this.$store.state.ofertas.detallesVerify.show
    },
    tipoUser() {
      return this.$store.state.user.user.tipo_user
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    listaOfertas() {
      const viewBy = this.active
      const dateActual = this.utils.getDateNow()
      const offersFiltered = this.$store.state.ofertas.listaOfertas.data
        .filter((offer) => {
          if (viewBy === 'month')
            return (
              this.utils
                .toMoment(offer.fechaAlta.replace('T', ' ').replace('Z', ''))
                .format('MM/YYYY') === dateActual.format('MM/YYYY')
            )
          else if (viewBy === 'year')
            return (
              this.utils
                .toMoment(offer.fechaAlta.replace('T', ' ').replace('Z', ''))
                .format('YYYY') === dateActual.format('YYYY')
            )
          else return true
        })
        .sort((a, b) =>
          this.utils
            .toMoment(a.fechaAlta.replace('T', ' ').replace('Z', ''))
            .isBefore(b.fechaAlta.replace('T', ' ').replace('Z', ''))
            ? 1
            : -1
        )
      const listOffers = [...offersFiltered]
      listOffers.forEach((offer) => {
        const fechaFin = utils.toMoment(
          offer.fechaFin.replace('T', ' ').replace('Z', '')
        )
        const status = offer.estatus
        if (status === 4) offer._rowVariant = 'danger'
        else if (status === 3) {
          if (dateActual.isAfter(fechaFin)) offer._rowVariant = 'secondary'
          else offer._rowVariant = 'success'
        } else if (status === 2) offer._rowVariant = 'info'
        else if (status === 1) offer._rowVariant = 'warning'
        else offer._rowVariant = 'light'
      })

      return listOffers
    },
    programandoOferta() {
      return this.$store.state.ofertas.programandoOferta
    },
    programandoListaOferta() {
      return this.$store.state.ofertas.programandoListaOferta
    },
    viewCrearOferta() {
      if (
        !this.$store.state.ofertas.programandoOferta &&
        !this.$store.state.ofertas.programandoListaOferta
      ) {
        return true
      }
      return false
    },
    suc() {
      return this.$store.state.ofertas.sucursal
    },
  },
  mounted() {
    if (this.tipoUser !== 'manager')
      this.setSucursal(utils.getSucursalByName(this.dataUser.sucursal_user))
    const date = new Date()
    this.textDateY = date.getFullYear().toString()
    this.textDateM = utils._arrayMonths[date.getMonth()] + '/' + this.textDateY
  },
  methods: {
    closeStepper() {
      this.showStepper = false
    },
    visibleButton(dataOffer, typeButton) {
      const status = dataOffer.estatus
      const isOwner = dataOffer.creadoPor === this.dataUser.correo_user
      switch (status) {
        case 0:
          if (
            typeButton === 'views' ||
            typeButton === 'action' ||
            typeButton === 'cancelar'
          )
            return isOwner
          else if (typeButton === 'load') return !isOwner
          else return false
        case 1:
          if (typeButton === 'action' || typeButton === 'excel')
            return this.tipoUser === 'manager'
          else if (typeButton === 'views') return true
          else return false
        case 2:
          if (
            typeButton === 'action' ||
            typeButton === 'validate' ||
            typeButton === 'excel'
          )
            return this.tipoUser === 'manager'
          else if (typeButton === 'views') return true
          else return false
        case 3:
          if (typeButton === 'views') return true
          if (typeButton === 'check' || typeButton === 'excel')
            return this.tipoUser === 'manager'
          else return false
        case 4:
          if (typeButton === 'action' || typeButton === 'eliminar')
            return isOwner
          else if (typeButton === 'views') return true
          else return false
        default:
          return false
      }
    },
    nameSuc(sucursal) {
      const suc = this.options.find((sucF) => sucF.value === sucursal)
      return suc ? suc.text : sucursal
    },
    detailsMessage(status) {
      if (this.onlyIcons) return ''
      if (status === 0 || (status === 2 && this.tipoUser === 'manager'))
        return 'Editar'
      return 'Detalles'
    },
    msgTooltipDetails(status) {
      if (!this.onlyIcons) return null
      if (status === 0 || (status === 2 && this.tipoUser === 'manager'))
        return 'Editar'
      return 'Detalles'
    },
    tooltipMessage(message) {
      if (!this.onlyIcons) return null
      return message
    },
    messageButtonIcons(message) {
      if (this.onlyIcons) return ''
      return message
    },
    getIconDetail(status) {
      if (status === 0 || (status === 2 && this.tipoUser === 'manager'))
        return 'pencil-fill'
      return 'folder-fill'
    },
    async validateArticlesForProgram(dataOffer) {
      try {
        const urlBase = process.env.spastore_url_backend
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            dataOffer.sucursal +
            '/articulos/validos/' +
            dataOffer.uuid,
          method: 'get',
        })
        this.setLoading(false)

        if (response.data.success) this.setArticlesDetails({ data: [] })
        else {
          this.showAlertDialog([response.data.message])
          this.setArticlesDetails({ data: response.data.error })
        }
        this.setShowDetails(true)
      } catch (error) {
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
        return false
      }
    },
    async verifyArticlesOffered(dataOffer) {
      try {
        const urlBase = process.env.spastore_url_backend
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            dataOffer.sucursal +
            '/articulos/' +
            dataOffer.uuid +
            '/check',
          method: 'get',
        })
        this.setLoading(false)

        if (response.data.success) {
          this.setShowVerify(true)
          this.setArticlesVerify({ data: response.data.data })
        } else this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
        return false
      }
    },
    prepareCancelOffer(dataOffer) {
      this.showAlertDialogOption([
        '¿Quiere "cancelar" la oferta?',
        'Cancelando oferta',
        () => {
          this.hideAlertDialogOption()
          this.changeStatusOffer(dataOffer, 4)
        },
        'danger',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    prepareChangeStatusOffer(dataOffer) {
      const offer = { ...dataOffer }
      const statusIncrement = offer.estatus + 1
      const messageStatus =
        offer.estatus === 1
          ? 'poner en proceso'
          : this.messageButton(offer.estatus, true)
      const newStatus = offer.estatus === 4 ? 0 : statusIncrement

      this.showAlertDialogOption([
        `¿Quiere "${messageStatus}" la oferta?`,
        'Cambiando status de oferta',
        () => {
          this.hideAlertDialogOption()
          this.changeStatusOffer(offer, newStatus)
        },
        'success',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async changeStatusOffer(dataOffer, newStatus) {
      try {
        const urlBase = process.env.spastore_url_backend
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            dataOffer.sucursal +
            '/maestros/' +
            dataOffer.uuid +
            '/status',
          method: 'put',
          data: {
            status: newStatus,
            modificadoPor: this.dataUser.correo_user,
          },
        })
        this.setLoading(false)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaOfertas([this.suc, this.limit])
          this.setProgramandoOferta(false)
          this.setProgramandoLista(false)
          this.setLoading(false)
          return true
        } else {
          if (
            response.data.message ===
            'Hay articulos con detalles, Verifica los detalles para poder programar las ofertas'
          ) {
            this.setArticlesDetails({ data: response.data.error })
            this.setShowDetails(true)
          }
          this.showAlertDialog([response.data.message])
          return false
        }
      } catch (error) {
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
        return false
      }
    },
    prepareDeleteOffer(dataOffer) {
      this.showAlertDialogOption([
        '¿Quiere "eliminar" la oferta de manera permanente?',
        'Eliminando oferta',
        () => {
          this.hideAlertDialogOption()
          this.deleteOffer(dataOffer)
        },
        'danger',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async deleteOffer(dataOffer) {
      try {
        const urlBase = process.env.spastore_url_backend
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            dataOffer.sucursal +
            '/maestros/' +
            dataOffer.uuid,
          method: 'delete',
        })
        this.setLoading(false)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaOfertas([this.suc, this.limit])
          this.setLoading(false)
        } else {
          this.showAlertDialog([response.data.message])
        }
      } catch (error) {
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    messageButton(status, isText = false) {
      if (!isText && this.onlyIcons) return ''
      switch (status) {
        case 0:
          return 'Enviar'
        case 1:
          return 'En proceso'
        case 2:
          return 'Programar'
        case 4:
          return 'Restaurar'
        default:
          return ''
      }
    },
    msgTooltipAction(status) {
      if (!this.onlyIcons) return null
      else if (status === 0) return 'Enviar'
      else if (status === 1) return 'Poner En Proceso'
      else if (status === 2) return 'Programar'
      else if (status === 4) return 'Restaurar'
    },
    variantStatus(status) {
      switch (status) {
        case 0:
          return 'success'
        case 1:
          return 'primary'
        case 2:
          return 'primary'
        case 4:
          return 'success'
        default:
          return ''
      }
    },
    parseStatusOferta(status) {
      switch (status) {
        case 0:
          return 'Creada'
        case 1:
          return 'Enviada'
        case 2:
          return 'En proceso'
        case 3:
          return 'Programada'
        case 4:
          return 'Cancelada'
        default:
          return 'Estatus invalido'
      }
    },
    setActiveDate(from) {
      this.active = from
      this.activeDateY = false
      this.activeDateA = false
      this.activeDateM = false
      if (this.active === 'month') this.activeDateM = true
      if (this.active === 'year') this.activeDateY = true
      if (this.active === 'all') this.activeDateA = true
    },
    ...mapMutations({
      setOnlyIcons: 'ofertas/setOnlyIcons',
      setProgramandoOferta: 'ofertas/setProgramandoOferta',
      setEditandoOferta: 'ofertas/setEditandoOferta',
      cleanOfertaActual: 'ofertas/cleanOfertaActual',
      openOferta: 'ofertas/openOferta',
      setEditable: 'ofertas/setEditable',
      setArticlesDetails: 'ofertas/setArticlesDetails',
      setArticlesVerify: 'ofertas/setArticlesVerify',
      setShowDetails: 'ofertas/setShowDetails',
      setShowVerify: 'ofertas/setShowVerify',
      setProgramandoLista: 'ofertas/setProgramandoLista',
      setLoading: 'general/setLoading', // nuevas
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'ofertas/setSucursal',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      changeListaOfertas: 'ofertas/changeListaOfertas', // nuevas
      changeListaArticulos: 'ofertas/changeListaArticulos', // nuevas
    }),
    programarOferta() {
      this.setEditandoOferta(false)
      this.setProgramandoOferta(true)
      this.setEditable(true)
      this.cleanOfertaActual()
    },
    async viewDetails(uuid, oferta) {
      const ofertaAct = { ...oferta }
      // falta ajustar
      this.setLoading(true)
      const response = await this.changeListaArticulos(uuid)
      if (response.success) {
        this.openOferta(ofertaAct)
        this.setProgramandoLista(true)
        this.setEditable(false)
      } else this.showAlertDialog([response.message])
      this.setLoading(false)
    },
    async reloadListaOfertas() {
      const sucursal = this.$store.state.ofertas.sucursal
      if (this.tipoUser === 'manager') {
        if (this.limit === '') {
          this.showAlertDialog(['Limite de ofertas no puede ser vacio'])
          return false
        } else if (typeof this.limit < 0) {
          this.showAlertDialog(['Limite de ofertas no puede ser menor que 0'])
          return false
        }
      }
      if (this.limit === '' || typeof this.limit < 0) this.limit = 100
      this.setLoading(true)
      const response = await this.changeListaOfertas([sucursal, this.limit])
      if (!response.success) this.showAlertDialog([response.message])
      this.setLoading(false)
    },
    selectSucursal(sucursal) {
      this.setSucursal(sucursal)
    },
    getNameSucursal(suc) {
      if (suc.toUpperCase() === 'ZR') return 'SPAZARAGOZA'
      if (suc.toUpperCase() === 'VC') return 'SPAVICTORIA'
      if (suc.toUpperCase() === 'ER') return 'SPAENRIQUEZ'
      if (suc.toUpperCase() === 'OU') return 'SPAOLUTA'
      if (suc.toUpperCase() === 'SY') return 'SPASAYULA'
      if (suc.toUpperCase() === 'JL') return 'SPAJALTIPAN'
      return 'SPA'
    },
    async generateExcel(master) {
      const fechaInicio = utils.parseFecha(master.fechaInicio)
      const fechaFin = utils.parseFecha(master.fechaFin)
      const fechas = `Del ${fechaInicio} AL ${fechaFin}`
      const sucursal = this.getNameSucursal(master.sucursal)
      this.setLoading(true)
      const response = await this.changeListaArticulos(master.uuid)
      if (response.success) this.createExcel(sucursal, fechas, response.data)
      else this.showAlertDialog([response.message])
      this.setLoading(false)
    },
    createExcel(sucursal, fechas, dataArticles) {
      const wb = XLSX.utils.book_new()
      wb.Props = {
        Title: 'Ofertas ' + fechas + ' - ' + sucursal,
        Subject: 'Ofertas',
        Author: this.$store.state.user.name,
      }
      wb.SheetNames.push('Hoja')

      const header = [
        'Sucursal',
        'Num',
        'Articulo',
        'Descripcion',
        'Costo',
        'Precio',
        'Margen',
        'Oferta',
        'Utilidad',
        'Empty',
        'Image',
        'Descrip',
        'Entero',
        'Fraccion',
        'FraccionReducida',
      ]

      const listRefactor = []
      let consecutivo = 1

      listRefactor.push({
        Sucursal: 'Sucursal',
        Num: 'Num',
        Articulo: 'Articulo',
        Descripcion: 'Descripcion',
        Costo: 'Costo',
        Precio: 'Precio',
        Margen: 'Margen',
        Oferta: 'Oferta',
        Utilidad: 'Utilidad',
        Empty: '',
        Image: '',
        Descrip: '',
        Entero: '',
        Fraccion: '',
        FraccionReducida: '',
      })

      dataArticles.forEach((article) => {
        const arrayOffer = utils.roundTo(article.oferta.toString()).split('.')
        const fraccion = arrayOffer.length > 1 ? arrayOffer[1] : '00'
        listRefactor.push({
          Sucursal: sucursal,
          Num: consecutivo,
          Articulo: article.articulo,
          Descripcion: article.nombre,
          Costo: article.costo,
          Precio: article.precio,
          Margen: 1 - article.costo / article.precio,
          Oferta: article.oferta,
          Utilidad: 1 - article.costo / article.oferta,
          Empty: '',
          Image: '',
          Descrip: article.nombre,
          Entero: parseInt(article.oferta),
          Fraccion: fraccion,
          FraccionReducida: parseInt(fraccion),
        })
        consecutivo++
      })

      const data = XLSX.utils.json_to_sheet(listRefactor, {
        header,
        skipHeader: true,
        origin: 'A1',
      })

      wb.Sheets.Hoja = data
      wb.Sheets.Hoja['!cols'] = [
        { wpx: 90 },
        { wpx: 40 },
        { wpx: 70 },
        { wpx: 250 },
        { wpx: 60 },
        { wpx: 60 },
        { wpx: 90 },
        { wpx: 60 },
        { wpx: 90 },
        { wpx: 20 },
        { wpx: 200 },
        { wpx: 250 },
        { wpx: 30 },
        { wpx: 30 },
        { wpx: 30 },
      ]

      const fechaImpresion = utils.getDateNow().format('YYYYMMDD')
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

      FileSaver.saveAs(
        new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
        fechaImpresion + ' -  Ofertas ' + fechas + ' Suc ' + sucursal + '.xlsx'
      )
    },
    s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      // eslint-disable-next-line prettier/prettier
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    },
  },
}
</script>

<style scoped>
.container-table-ofe {
  overflow: auto;
  margin-bottom: 30px;
}

#groupDate,
.groupDate {
  float: right;
}

.groupDate {
  margin-right: 10px;
}

@media screen and (max-width: 480px) {
  #groupDate,
  .groupDate {
    float: none;
    margin-bottom: 5px;
  }

  .groupDate {
    margin-right: 0px;
  }
}
</style>
