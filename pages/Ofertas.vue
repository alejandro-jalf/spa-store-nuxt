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
          <div v-if="isOwnerUser(row)">
            <b-button
              variant="info"
              size="sm"
              class="mr-2 mt-2"
              @click="viewDetails(row.item.uuid)"
            >
              {{ detailsMessage(row.item.status) }}
            </b-button>
            <b-button
              v-if="row.item.status !== 3"
              class="mr-2 mt-2"
              size="sm"
              :variant="variantStatus(row.item.status)"
            >
              {{ messageButton(row.item.status) }}
            </b-button>
            <b-button
              v-if="row.item.status === 0"
              class="mr-2 mt-2"
              size="sm"
              variant="danger"
            >
              Cancelar
            </b-button>
            <b-button
              v-if="row.item.status === 4"
              size="sm"
              class="mr-2 mt-2"
              variant="danger"
              @click="viewDetails(row.item.uuid)"
            >
              Eliminar
            </b-button>
          </div>
          <div v-else>
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
    isOwnerUser(row) {
      const user = row.item.creadopor
      const status = row.item.status
      if (status === 0) return user === this.dataUser.correo_user
      else if (status === 2) return user !== this.dataUser.correo_user
      else return true
    },
    nameSuc(sucursal) {
      const suc = this.options.find((sucF) => sucF.value === sucursal)
      return suc ? suc.text : sucursal
    },
    detailsMessage(status) {
      return status === 0 || status === 2 ? 'Editar' : 'Detalles'
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
      openOfertaByUuid: 'ofertas/openOfertaByUuid',
      setEditable: 'ofertas/setEditable',
      setProgramandoLista: 'ofertas/setProgramandoLista',
      setLoading: 'general/setLoading', // nuevas
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'ofertas/setSucursal',
    }),
    ...mapActions({
      changeListaOfertas: 'ofertas/changeListaOfertas', // nuevas
    }),
    programarOferta() {
      this.setEditandoOferta(false)
      this.setProgramandoOferta(true)
      this.setEditable(true)
      this.cleanOfertaActual()
    },
    viewDetails(uuid) {
      // falta ajustar
      this.setProgramandoLista(true)
      this.setEditable(false)
      this.openOfertaByUuid(uuid)
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
