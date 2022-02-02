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
      Programar nueva oferta
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
        <template #cell(Acciones)="row">
          <b-button
            v-if="visibleButton(row.item, 'views')"
            variant="info"
            size="sm"
            class="mr-2 mt-2"
            @click="viewDetails(row.item.uuid, row.item)"
          >
            {{ detailsMessage(row.item.status) }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'action')"
            class="mr-2 mt-2"
            size="sm"
            :variant="variantStatus(row.item.status)"
            @click="prepareChangeStatusOffer(row.item)"
          >
            {{ messageButton(row.item.status) }}
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'cancelar')"
            class="mr-2 mt-2"
            size="sm"
            variant="danger"
            @click="prepareCancelOffer(row.item)"
          >
            Cancelar
          </b-button>
          <b-button
            v-if="visibleButton(row.item, 'eliminar')"
            size="sm"
            class="mr-2 mt-2"
            variant="danger"
            @click="prepareDeleteOffer(row.item)"
          >
            Eliminar
          </b-button>
          <div v-if="visibleButton(row.item, 'load')">
            <b-spinner
              style="width: 10px; height: 10px"
              variant="success"
              type="grow"
            ></b-spinner>
            <b-spinner
              style="width: 10px; height: 10px"
              variant="success"
              type="grow"
            ></b-spinner>
            <b-spinner
              style="width: 10px; height: 10px"
              variant="success"
              type="grow"
            ></b-spinner>
            <b-spinner
              style="width: 10px; height: 10px"
              variant="success"
              type="grow"
            ></b-spinner>
            <b-spinner
              style="width: 10px; height: 10px"
              variant="success"
              type="grow"
            ></b-spinner>
          </div>
        </template>
        <template #cell(sucursal)="row">
          {{ nameSuc(row.item.sucursal) }}
        </template>
        <template #cell(status)="row">
          {{ parseStatusOferta(row.item.status).toUpperCase() }}
        </template>
        <template #cell(fechaInico)="row">
          {{ utils.parseFecha(row.item.fechainicio) }}
        </template>
        <template #cell(tipoOferta)="row">
          {{ row.item.tipooferta }}
        </template>
        <template #cell(fechaFin)="row">
          {{ utils.parseFecha(row.item.fechafin) }}
        </template>
      </b-table>
    </div>
    <float-button
      v-if="tipoUser !== 'manager'"
      :click-float="reloadListaOfertas"
    ></float-button>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import OfertaForm from '../components/OfertaForm'
import OfertaLista from '../components/OfertaLista'
import FloatButton from '../components/FloatButton'
import utils from '../modules/utils'

export default {
  components: {
    OfertaForm,
    OfertaLista,
    FloatButton,
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
        'status',
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
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
    }
  },
  computed: {
    tipoUser() {
      return this.$store.state.user.user.tipo_user
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    listaOfertas() {
      const viewBy = this.active
      const dateActual = this.utils.getDateNow()
      return this.$store.state.ofertas.listaOfertas.data
        .filter((offer) => {
          if (viewBy === 'month')
            return (
              this.utils.toMoment(offer.fechainicio).format('MM/YYYY') ===
              dateActual.format('MM/YYYY')
            )
          else if (viewBy === 'year')
            return (
              this.utils.toMoment(offer.fechainicio).format('YYYY') ===
              dateActual.format('YYYY')
            )
          else return true
        })
        .sort((a, b) =>
          this.utils.toMoment(a.fechainicio).isBefore(b.fechainicio) ? 1 : -1
        )
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
    visibleButton(dataOffer, typeButton) {
      const status = dataOffer.status
      const isOwner = dataOffer.creadopor === this.dataUser.correo_user
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
          if (typeButton === 'action') return this.tipoUser === 'manager'
          else if (typeButton === 'views') return true
          else return false
        case 2:
          if (typeButton === 'action') return this.tipoUser === 'manager'
          else if (typeButton === 'views') return true
          else return false
        case 3:
          if (typeButton === 'views') return true
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
      return status === 0 || status === 2 ? 'Editar' : 'Detalles'
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
      const statusIncrement = offer.status + 1
      const messageStatus =
        offer.status === 1
          ? 'poner en proceso'
          : this.messageButton(offer.status)
      const newStatus = offer.status === 4 ? 0 : statusIncrement

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
      // eslint-disable-next-line no-console
      console.log(dataOffer)
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
        // eslint-disable-next-line no-console
        console.log(response.data)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaOfertas(dataOffer.sucursal)
          this.setLoading(false)
        } else {
          this.showAlertDialog([response.data.message])
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
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
        // eslint-disable-next-line no-console
        console.log(response.data)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaOfertas(dataOffer.sucursal)
          this.setLoading(false)
        } else {
          this.showAlertDialog([response.data.message])
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    messageButton(status) {
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
      setProgramandoOferta: 'ofertas/setProgramandoOferta',
      setEditandoOferta: 'ofertas/setEditandoOferta',
      cleanOfertaActual: 'ofertas/cleanOfertaActual',
      openOferta: 'ofertas/openOferta',
      setEditable: 'ofertas/setEditable',
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
      // eslint-disable-next-line no-console
      console.log(uuid, oferta)
      const ofertaAct = { ...oferta }
      ofertaAct.fechaAlta = ofertaAct.fechaalta
      ofertaAct.fechaInicio = ofertaAct.fechainicio
      ofertaAct.fechaFin = ofertaAct.fechafin
      ofertaAct.tipoOferta = ofertaAct.tipooferta
      ofertaAct.modificadoPor = ofertaAct.modificadopor
      // falta ajustar
      this.setLoading(true)
      await this.changeListaArticulos(uuid)
      this.setLoading(false)
      this.openOferta(ofertaAct)
      this.setProgramandoLista(true)
      this.setEditable(false)
    },
    async reloadListaOfertas() {
      const sucursal = this.$store.state.ofertas.sucursal
      this.setLoading(true)
      const response = await this.changeListaOfertas(sucursal)
      if (!response.success) this.showAlertDialog([response.message])
      this.setLoading(false)
    },
    selectSucursal(sucursal) {
      this.setSucursal(sucursal)
    },
  },
}
</script>

<style scoped>
.container-table-ofe {
  overflow: auto;
  margin-bottom: 30px;
}

#groupDate {
  float: right;
}

@media screen and (max-width: 480px) {
  #groupDate {
    float: none;
    margin-bottom: 5px;
  }
}
</style>
