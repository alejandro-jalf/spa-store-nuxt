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
    <b-button
      v-if="viewCrearOferta"
      variant="info"
      class="mb-3"
      @click="showStepper = true"
    >
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
    <oferta-form v-if="programandoOferta" class="pt-2 pb-2 mb-3"></oferta-form>
    <oferta-lista
      v-if="programandoListaOferta"
      class="pb-2 mb-3"
      :prepare-change-status-offer="prepareChangeStatusOffer"
      :visible-button="visibleButton"
      :validate-articles-for-program="validateArticlesForProgram"
      :create-pdf-offers="createPdfOffers"
    ></oferta-lista>
    <div v-if="viewCrearOferta" class="container-table-ofe">
      <div class="mt-3 mb-2">
        <Colors
          :show-warning="true"
          :show-danger="true"
          :show-info="true"
          :show-secondary="true"
          :show-success="true"
          :show-white="true"
          title-warning="Enviada"
          title-danger="Cancelada"
          title-info="En proceso"
          title-secondary="Finalizada"
          title-white="Creada"
          title-success="Programada"
          content-message-warning="La oferta ya ha sido enviada, y esta en espera de ser atendida"
          content-message-danger="La oferta fue cancelada, en este punto se puede restaurar para enviarla o eliminarla"
          content-message-secondary="La oferta ya fue programada y ademas ya termino debido a la fecha"
          content-message-info="La oferta esta en preoceso, esta siendo revisada y programada por la persona encargada"
          content-message-white="La oferta fue creada y esta siendo editada por la sucursal"
          content-message-success="La oferta fue programada y esta vigente todavia"
        />
      </div>
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
          <b-dropdown v-else size="sm" no-caret>
            <template #button-content>
              Acciones
              <b-icon icon="caret-down-fill" />
            </template>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'views')"
              variant="info"
              @click="viewDetails(row.item.uuid, row.item)"
            >
              <b-icon :icon="getIconDetail(row.item.estatus)" />
              {{ detailsMessage(row.item.estatus) }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'validate')"
              variant="success"
              @click="validateArticlesForProgram(row.item)"
            >
              <b-icon icon="info-circle-fill" />
              {{ messageButtonIcons('Validar') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'check')"
              variant="success"
              @click="verifyArticlesOffered(row.item)"
            >
              <b-icon icon="binoculars-fill" />
              {{ messageButtonIcons('Verificar') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'action')"
              :variant="variantStatus(row.item.estatus)"
              @click="prepareChangeStatusOffer(row.item)"
            >
              <b-icon icon="folder-symlink-fill" />
              {{ messageButton(row.item.estatus) }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'cancelar')"
              variant="danger"
              @click="prepareCancelOffer(row.item)"
            >
              <b-icon icon="x-circle-fill" />
              {{ messageButtonIcons('Cancelar') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'eliminar')"
              variant="danger"
              @click="prepareDeleteOffer(row.item)"
            >
              <b-icon icon="trash-fill" />
              {{ messageButtonIcons('Eliminar') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'excel')"
              @click="generateExcel(row.item)"
            >
              <b-icon icon="download" />
              {{ messageButtonIcons('EXCEL') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'pdf')"
              @click="createPdf(row.item, true)"
            >
              <b-icon icon="printer-fill" />
              {{ messageButtonIcons('PDF') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="visibleButton(row.item, 'precios')"
              variant="danger"
              @click="prepareOmitePrecios(row.item)"
            >
              <b-icon icon="currency-dollar" />
              Omitir Precios
            </b-dropdown-item>
          </b-dropdown>
        </template>
        <template #cell(sucursal)="row">
          {{ nameSuc(row.item.sucursal) }}
        </template>
        <template #cell(estatus)="row">
          {{ parseStatusOferta(row.item.estatus).toUpperCase() }}
        </template>
        <template #cell(fechaInico)="row">
          {{ utils.parseFechaMoment(row.item.fechaInicio) }}
        </template>
        <template #cell(tipoOferta)="row">
          {{ row.item.tipoOferta }}
        </template>
        <template #cell(fechaFin)="row">
          {{ utils.parseFechaMoment(row.item.fechaFin) }}
        </template>
      </b-table>
    </div>
    <OfertaArticulosValidados v-if="showDetails" />
    <OfertaArticulosOfertados v-if="showOffered" />
    <float-button
      v-if="tipoUser !== 'manager' && viewCrearOferta"
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
import { jsPDF } from 'jspdf'
import OfertaForm from '../components/OfertaForm'
import OfertaLista from '../components/OfertaLista'
import OfertaArticulosValidados from '../components/OfertaArticulosValidados'
import OfertaArticulosOfertados from '../components/OfertaArticulosOfertados'
import FloatButton from '../components/FloatButton'
import Stepper from '../components/Stepper'
import Colors from '../components/Colors'
import utils from '../modules/utils'
import 'jspdf-autotable'

export default {
  components: {
    Stepper,
    OfertaForm,
    OfertaLista,
    FloatButton,
    OfertaArticulosValidados,
    OfertaArticulosOfertados,
    Colors,
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
          image: 'h-ofertas-reloadoffers.png',
          content: `Para actualizar la lista de ofertas, precione el boton de refrescar, que por lo general se encuentra ubicado en la parte inferior derecha.
            Con lo cual al dar click comenzara el proceso de busqueda.`,
          sizeImage: 300,
        },
        {
          title: '¿Como crear una nueva lista de ofertas?',
          image: 'h-ofertas-createlist.png',
          content: `Para crear una lista de ofertas, solo se tiene que dar click en el boton de "Crear lista de ofertas".
            Posteriormente se debe rellenar los campos que se solicitan para continuar con el proceso`,
        },
        {
          title: '¿Para que sirve el boton de "Solo Iconos  En Acciones"?',
          image: 'h-ofertas-onlyicons.png',
          content: `Este boton sirve para ocultar las letras de los botones de acciones, de manera que en la tabla de datos se reduzcan el tamaño de las filas`,
        },
        {
          title: '¿Como filtrar las listas de ofertas?',
          image: 'h-ofertas-filters.png',
          content: `
Para filtrar la lista de ofertas, solo se tiene que seleccionar entre las tres opciones:

- El primero muestra todas las listas de ofertas que se crearon en el mes actual.
- La segunda opcion muestra las listas de ofertas que se crearon en el año actual.
- La tercera opcion muestra todas las listas de ofertas.

*Nota*: El filtro va en base a la fecha de creacion, ademas como limite cualquiera solo puede mostrar como maximo 100 filas.`,
        },
        {
          title: '¿Que significa cada "Estatus"?',
          image: 'h-ofertas-estatus.png',
          content: `
En estatus que aparece en la tabla de ofertas dice lo siguiente de cada oferta:
- **CREADA**: Quiere decir que la oferta ha sido creada y que todavia se encuentra en la sucursal, por lo tanto todavia se pueden editar los articulos y agregar nuevo o quitar articulos si fuera el caso.
- **ENVIADA**: Este estatus indica La oferta ya fue enviada para su programacion, en esta parte ya no se pueden editar ni agrega articulos.
- **EN PROCESO**: La oferta ya esta siendo atendida y validada para su posterior programacion. Si hubiera algun detalle con algun articulo, el encargado de programar la oferta se comunicara para corroborar la informacion, de caso contrario la lista de oferta pasaria a ser programada.
- **PROGRAMADA**: La oferta ya fue prograda para las fechas especificas.
- **CANCELADA**: La oferta fue cancelada y hay dos cosas por hacer con ella, la primera seria restaurar; lo cual hace que la lista se vuelva a habilitar para seguir editando y enviar, o lo segundo seria eliminarla, lo cual borraria de manera permanente la oferta.`,
        },
        {
          title: '¿Como ver los articulos de mis ofertas ya enviadas?',
          image: 'h-ofertas-details.png',
          content: `Para ver los articulos que contiene cada lista de ofertas solo se tiene que dar click sobre el boton que tiene el icono de una carpeta. En seguida se consultara la lista de articulos y se mostrara en pantalla.`,
        },
        {
          title: '¿Como editar mi lista de articulos?',
          image: 'h-ofertas-edit.png',
          content: `Para seguir editando solo se da click sobre el boton editar, postoriormente se abrira la ventana de captura de articulos.
          **_Nota_**: La lista de articulos solo se puede editar mientras el estatus siga como **CREADA**, una vez enviada no se podra edita la lista articulos`,
        },
        {
          title: '¿Como enviar mi lista de articulos para ofertar?',
          image: 'h-ofertas-send.png',
          content: `Para enviar la lista de articulos, solo hay que dar click sobre el boton de enviar. Una vez enviado se esperara para ser programados`,
        },
        {
          title: '¿Puedo cancelar una lista de ofertas?',
          image: 'h-ofertas-cancel.png',
          content: `Al cancelar una oferta sigue apareciendo pero con estatus cancelada. En este punto se puede restaurar la lista de ofertas o eliminar de forma permanente`,
        },
        {
          title: '¿Que pasa se elimino una lista de ofertas?',
          image: 'h-ofertas-delete.png',
          content: `Al dar click sobre el boton de eliminar, la oferta se borrara por completo, y ya no aparecera mas en su lista. Por lo cual una vez eliminada no podra ser ser restaurada`,
        },
        {
          title: '¿Como restaurar una lista cancelada?',
          image: 'h-ofertas-restore.png',
          content: `Para restaurar una lista de articulos solo hay que dar click sobre el boton de restaurar en automatico podra seguir editando`,
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
                .format('MM/YYYY') === dateActual.format('MM/YYYY') ||
              this.utils
                .toMoment(offer.fechaInicio.replace('T', ' ').replace('Z', ''))
                .format('MM/YYYY') === dateActual.format('MM/YYYY')
            )
          else if (viewBy === 'year')
            return (
              this.utils
                .toMoment(offer.fechaAlta.replace('T', ' ').replace('Z', ''))
                .format('YYYY') === dateActual.format('YYYY') ||
              this.utils
                .toMoment(offer.fechaInicio.replace('T', ' ').replace('Z', ''))
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
      // algo
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
          if (typeButton === 'views' || typeButton === 'pdf') return true
          if (typeButton === 'check' || typeButton === 'precios') {
            const dateActual = this.utils.getDateNow()
            const fechaFin = dataOffer.fechaFin
              .replace('T', ' ')
              .replace('Z', '')
            const dateEnd = utils.toMoment(fechaFin)
            return dateActual.isBefore(dateEnd)
          }
          if (typeButton === 'excel') return this.tipoUser === 'manager'
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
      // if (this.onlyIcons) return ''
      if (status === 0 || (status === 2 && this.tipoUser === 'manager'))
        return 'Editar'
      return 'Detalles'
    },
    msgTooltipDetails(status) {
      // if (!this.onlyIcons) return null
      if (status === 0 || (status === 2 && this.tipoUser === 'manager'))
        return 'Editar'
      return 'Detalles'
    },
    tooltipMessage(message) {
      // if (!this.onlyIcons) return null
      return message
    },
    messageButtonIcons(message) {
      // if (this.onlyIcons) return ''
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
    prepareOmitePrecios(master) {
      this.showAlertDialogOption([
        'Este boton pone a los precios 2, 3, 4, etc. en 0 piezas para cambio de precio, esto evita que esos precios afecten a la oferta.<br/>Posteriormente despues de terminada la oferta los precios se tienen que regresar de manera manual.<br/>¿Continuar?',
        'Omitiendo Precios',
        () => {
          this.hideAlertDialogOption()
          this.omitePrecios(master)
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async omitePrecios(master) {
      try {
        const urlBase = process.env.spastore_url_backend
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            master.sucursal +
            '/maestros/' +
            master.uuid +
            '/precios',
          method: 'put',
        })
        this.setLoading(false)

        if (response.data.success) {
          const total = response.data.data[1]
          this.showAlertDialog([
            `Se ha puesto 0 piezas para cambio de precios a un total de [${total}] niveles de precios`,
            'Exito',
            'success',
          ])
        } else this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    messageButton(status, isText = false) {
      // if (!isText && this.onlyIcons) return ''
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
      // if (!this.onlyIcons) return null
      if (status === 0) return 'Enviar'
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
    async createPdf(master, preview = false) {
      const fechaInicio = utils.parseFecha(master.fechaInicio)
      const fechaFin = utils.parseFecha(master.fechaFin)
      const fechas = `Del ${fechaInicio} AL ${fechaFin}`
      const sucursal = this.getNameSucursal(master.sucursal)
      this.setLoading(true)
      const response = await this.changeListaArticulos(master.uuid)
      if (response.success)
        this.createPdfOffers(
          sucursal,
          fechas,
          master.tipoOferta,
          response.data,
          preview
        )
      else this.showAlertDialog([response.message])
      this.setLoading(false)
    },
    createPdfOffers(sucursal, fechas, tipo, data, preview = false) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'letter')

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(tipo, 105, 15, 'center')
      doc.text(fechas + ', Suc ' + sucursal, 105, 22, 'center')
      doc.setFontSize(9)

      doc.text('Total Articulos: ' + data.length, 10, 27)
      doc.setFont('helvetica', 'normal')

      const body = data.reduce((acumData, dato) => {
        acumData.push([
          { content: dato.articulo },
          { content: dato.nombre },
          {
            content: utils.roundTo(dato.costo),
          },
          {
            content: utils.roundTo(dato.precio),
          },
          {
            content: utils.roundTo((1 - dato.costo / dato.precio) * 100) + '%',
          },
          {
            content: utils.roundTo(dato.oferta),
          },
          {
            content: utils.roundTo((1 - dato.costo / dato.oferta) * 100) + '%',
          },
        ])
        return acumData
      }, [])

      doc.autoTable({
        startY: 32,
        tableWidth: 190,
        margin: {
          left: 10,
        },
        styles: { fontSize: 9 },
        headStyles: {
          fontStyle: 'bold',
          halign: 'left',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        bodyStyles: { textColor: [0, 0, 0] },
        head: [
          [
            'Articulo',
            'Nombre',
            'Costo',
            'Precio',
            'Margen',
            'Oferta',
            'Utilidad',
          ],
        ],
        body,
      })

      doc.setFont('helvetica', 'bold')
      doc.setDrawColor(0, 0, 0)
      const fechaImpresion = utils.getDateNow().format('YYYY-MM-DD HH:mm:ss')

      const countPages = doc.getNumberOfPages()
      let pageCurrent = 0
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      for (let page = 0; page < countPages; page++) {
        doc.setPage(page)
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(`Pagina ${pageCurrent} de ${countPages}`, 207, 275, 'right')
        doc.text('Impreso: ' + fechaImpresion, 8, 275)
        if (pageCurrent === 1) doc.line(10, 39, 200, 39)
      }

      if (preview) doc.output('dataurlnewwindow')
      else doc.save(`${fechaImpresion} - Ofertas ${fechas} Suc ${sucursal}.pdf`)
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
