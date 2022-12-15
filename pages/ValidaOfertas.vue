<template>
  <div class="mt-3">
    <transition name="fade">
      <float-button
        v-if="showFloatButton"
        icon-float="arrow-up-circle"
        :click-float="upPage"
        variant-float="info"
      ></float-button>
    </transition>
    <h1 class="text-center mb-3">Validacion de ofertas</h1>
    <b-input-group prepend="Sucursal">
      <b-form-select
        :value="suc"
        :disabled="!accessChangeSucursal"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <template #append>
        <b-button variant="success" @click="getValidation"> Validar </b-button>
      </template>
    </b-input-group>

    <div class="container-filters">
      <span class="title-container" :class="themeTitle">Filtros</span>
      <b-button
        class="float-right btn-help"
        variant="info"
        size="sm"
        @click="showHelpFilters"
      >
        <b-icon icon="question-circle-fill"></b-icon>
      </b-button>
      <b-button-group class="mt-3">
        <b-button
          :pressed="activatedLimit"
          variant="outline-info"
          @click="setActivateLimit('withLimit')"
        >
          Con limite de fecha
        </b-button>
        <b-button
          :pressed="!activatedLimit && !activatedAll"
          variant="outline-info"
          @click="setActivateLimit('withoutLimit')"
        >
          Sin limite de fecha
        </b-button>
        <b-button
          :pressed="activatedAll"
          variant="outline-info"
          @click="setActivateLimit('all')"
        >
          Todas
        </b-button>
      </b-button-group>

      <Divider class="my-2" />

      <b-form-checkbox
        v-model="filterByDates"
        name="filter_by_dates"
        switch
        class="mb-2 d-inline"
        @change="changeFilterByDate"
      >
        Fecha de inicio y Fecha de termino especifica
      </b-form-checkbox>
      <b-button variant="info" size="sm" @click="showHelpDatesSE">
        <b-icon icon="question-circle-fill"></b-icon>
      </b-button>

      <br />

      <div class="inputs mt-2">
        <b-input-group prepend="Del">
          <b-form-datepicker
            id="date-init"
            v-model="dateInit"
            label-no-date-selected="Fecha no seleccionada"
            label-help="Fecha de Inicio"
            label-current-month="Mes Actual"
            label-next-month="Mes Siguiente"
            label-next-year="Año Siguiente"
            label-prev-month="Mes Anterior"
            label-prev-year="Año Anterior"
            label-reset-button="Resetear"
            label-today-button="Hoy"
            :reset-button="true"
            :today-button="true"
          ></b-form-datepicker>
          <b-input-group-append>
            <b-button variant="info" size="sm" @click="showHelpDatesS">
              <b-icon icon="question-circle-fill"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>

      <div class="inputs">
        <b-input-group prepend="Al">
          <b-form-datepicker
            id="date-end"
            v-model="dateEnd"
            label-no-date-selected="Fecha no seleccionada"
            label-help="Fecha de Termino"
            label-current-month="Mes Actual"
            label-next-month="Mes Siguiente"
            label-next-year="Año Siguiente"
            label-prev-month="Mes Anterior"
            label-prev-year="Año Anterior"
            label-reset-button="Resetear"
            label-today-button="Hoy"
            :reset-button="true"
            :today-button="true"
          ></b-form-datepicker>
          <b-input-group-append>
            <b-button variant="info" size="sm" @click="showHelpDatesE">
              <b-icon icon="question-circle-fill"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>

      <b-form-checkbox
        v-model="onliValid"
        name="only_valid"
        switch
        class="mt-2 mb-3"
        @change="changeValid"
      >
        Mostrar solo no validos
      </b-form-checkbox>

      <Divider class="my-2" />
      <div class="h6">Ordernar tabla por:</div>
      <b-form-select
        v-model="orderBy"
        :options="optionsOrder"
        class="select-order"
      ></b-form-select>
      <b-form-select
        v-model="descAsc"
        :options="optionsDescAsc"
        class="select-order"
      ></b-form-select>
    </div>

    <h5>
      <b-badge pill variant="info" class="chip mt-3 mb-1">
        Total: {{ dataRefactor.length }}
      </b-badge>
    </h5>

    <div class="mt-3 mb-2">
      <Colors
        :show-danger="true"
        title-danger="Utilidad baja"
        content-message-danger="La utilidad de la oferta para este articulo esta por debajo del 10%. <br/>Se recomienda comunicarse con el departamento de sistemas para modificar la oferta o quitarla"
      />
    </div>

    <b-table
      v-if="width > 767"
      id="tableValidaOfertas"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      :class="variantThemeTableBody"
    >
      <template #cell(Precio1)="row">
        {{ row.item.Precio1IVAUV }}
      </template>
      <template #cell(PrecioValido)="row">
        {{ row.item.Precio1Valido }}
      </template>
      <template #cell(Acciones)="row">
        <b-button variant="info" @click="showDetails(row.item)">
          Detalles
        </b-button>
      </template>
    </b-table>
    <div v-else>
      <ValidaOfertasCard
        v-for="(article, indexArticle) in dataRefactor"
        :key="indexArticle"
        :article="article"
        :show-details="showDetails"
        class="mb-2"
      />
    </div>
    <ValidaOfertasDetails
      v-if="viewDetails"
      :article-actual="articleActual"
      :close-details="closeDetails"
    />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import ValidaOfertasDetails from '../components/ValidaOfertasDetails'
import ValidaOfertasCard from '../components/ValidaOfertasCard'
import Colors from '../components/Colors'
import utils from '../modules/utils'

export default {
  components: {
    ValidaOfertasDetails,
    ValidaOfertasCard,
    Colors,
  },
  data() {
    return {
      fields: [
        'Suc',
        'Articulo',
        'Nombre',
        'PrecioOferta',
        'UtilidadOferta',
        'OfertaValida',
        'Descuento',
        'UltimoCosto',
        'Precio1',
        'UtilidadVenta',
        'PrecioValido',
        'Acciones',
      ],
      utils,
      onliValid: true,
      statusLimit: 'all',
      selected: 'ZR',
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      articleActual: {
        Suc: 'ZR',
        UtilidadVenta: '15%',
      },
      viewDetails: false,
      filterByDates: true,
      dateInit: '',
      dateEnd: '',
      orderBy: 'Articulo',
      optionsOrder: [
        { value: 'Articulo', text: 'Articulo' },
        { value: 'Nombre', text: 'Nombre' },
        { value: 'Precio', text: 'Precio de Venta' },
        { value: 'UtilidadPrecio', text: 'Utilidad de Venta' },
        { value: 'Oferta', text: 'Precio de Oferta' },
        { value: 'UtilidadOferta', text: 'Utilidad de Oferta' },
        { value: 'Costo', text: 'Costo' },
        { value: 'FechaInicio', text: 'Fecha de Inicio' },
        { value: 'FechaTermino', text: 'Fecha de Termino' },
      ],
      descAsc: 'Descendente',
      optionsDescAsc: [
        { value: 'Descendente', text: 'Descendente' },
        { value: 'Ascendente', text: 'Ascendente' },
      ],
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    showFloatButton() {
      return this.$store.state.general.scrollScreenY >= 500
    },
    activatedLimit() {
      return this.statusLimit === 'withLimit'
    },
    activatedAll() {
      return this.statusLimit === 'all'
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    themeTitle() {
      return this.$store.state.general.themesComponents.themeGeneral
    },
    suc() {
      return this.$store.state.validaofertas.sucursal
    },
    isFilterByDates() {
      return this.$store.state.validaofertas.filterByDates
    },
    dataRefactor() {
      const dateIS = this.dateInit
      const dateES = this.dateEnd
      const orderBy = this.orderBy
      const datos = []
      this.$store.state.validaofertas.data.data.forEach((oferta) => {
        const onlyValid = this.$store.state.validaofertas.onlyValid
        const statusLimit = this.statusLimit
        const data = { ...oferta }
        data.UtilidadOferta =
          utils.parseToPorcent(utils.roundTo(data.UtilidadOferta, 4, true)) +
          ' %'
        data.Descuento = utils.roundTo(data.Descuento)
        data.UltimoCostoNeto = utils.roundTo(data.UltimoCostoNeto)
        data.Precio1IVAUV = utils.roundTo(data.Precio1IVAUV)
        data.UtilidadVenta =
          utils.parseToPorcent(utils.roundTo(data.UtilidadVenta, 4, true)) +
          ' %'
        data.PrecioOferta = utils.roundTo(data.PrecioOferta)
        data.UltimoCosto = utils.roundTo(data.UltimoCosto)
        data.FechaInicialO = data.FechaInicial
        data.FechaFinalO = data.FechaFinal
        data.FechaInicial = utils.toDate(data.FechaInicial)
        data.FechaFinal = utils.toDate(data.FechaFinal)
        if (data.OfertaValida === 'NO') data._rowVariant = 'danger'
        if (statusLimit === 'withLimit') {
          if (onlyValid) {
            if (data.OfertaCaduca === 'SI' && data.OfertaValida === 'NO')
              datos.push(data)
          } else if (data.OfertaCaduca === 'SI') datos.push(data)
        } else if (statusLimit === 'withoutLimit') {
          if (onlyValid) {
            if (data.OfertaCaduca === 'NO' && data.OfertaValida === 'NO')
              datos.push(data)
          } else if (data.OfertaCaduca === 'NO') datos.push(data)
        } else if (onlyValid) {
          if (data.OfertaValida === 'NO') datos.push(data)
        } else datos.push(data)
      })

      const datosFiltered = datos.filter((data) => {
        // Filtros para fechas
        const dateStartOffer = utils.toMoment(
          data.FechaInicialO.replace('T', ' ').replace('Z', '')
        )
        const dateEndOffer = utils.toMoment(
          data.FechaFinalO.replace('T', ' ').replace('Z', '')
        )

        if (this.filterByDates) {
          if (dateIS !== '' && dateES !== '') {
            const dateInitSelected = utils.toMoment(dateIS)
            const dateEndSelected = utils.toMoment(dateES)
            return (
              dateInitSelected.format('YYYY-MM-DD') ===
                dateStartOffer.format('YYYY-MM-DD') &&
              dateEndSelected.format('YYYY-MM-DD') ===
                dateEndOffer.format('YYYY-MM-DD')
            )
          } else if (dateIS !== '' && dateES === '') {
            const dateInitSelected = utils.toMoment(dateIS)
            return (
              dateInitSelected.format('YYYY-MM-DD') ===
              dateStartOffer.format('YYYY-MM-DD')
            )
          } else if (dateIS === '' && dateES !== '') {
            const dateEndSelected = utils.toMoment(dateES)
            return (
              dateEndSelected.format('YYYY-MM-DD') ===
              dateEndOffer.format('YYYY-MM-DD')
            )
          }
          return true
        } else {
          if (dateIS !== '' && dateES !== '') {
            const dateInitSelected = utils.toMoment(dateIS)
            const dateEndSelected = utils.toMoment(dateES)
            return (
              dateStartOffer.isBetween(
                dateInitSelected,
                dateEndSelected,
                'day',
                '[]'
              ) &&
              dateEndOffer.isBetween(
                dateInitSelected,
                dateEndSelected,
                'day',
                '[]'
              )
            )
          } else if (dateIS !== '' && dateES === '') {
            const dateInitSelected = utils.toMoment(dateIS)
            return (
              dateInitSelected.format('YYYY-MM-DD') ===
                dateStartOffer.format('YYYY-MM-DD') ||
              dateInitSelected.format('YYYY-MM-DD') ===
                dateEndOffer.format('YYYY-MM-DD') ||
              dateStartOffer.isAfter(dateInitSelected, 'day') ||
              dateEndOffer.isAfter(dateInitSelected, 'day')
            )
          } else if (dateIS === '' && dateES !== '') {
            const dateEndSelected = utils.toMoment(dateES)
            return (
              dateEndSelected.format('YYYY-MM-DD') ===
                dateEndOffer.format('YYYY-MM-DD') ||
              dateEndSelected.format('YYYY-MM-DD') ===
                dateStartOffer.format('YYYY-MM-DD') ||
              dateEndOffer.isBefore(dateEndSelected, 'day') ||
              dateStartOffer.isBefore(dateEndSelected, 'day')
            )
          }
          return true
        }
      })

      const min = this.descAsc === 'Descendente' ? -1 : 1
      const max = this.descAsc === 'Descendente' ? 1 : -1
      switch (orderBy) {
        case 'Articulo':
          return datosFiltered.sort((a, b) =>
            a.Articulo < b.Articulo ? min : max
          )
        case 'Nombre':
          return datosFiltered.sort((a, b) => (a.Nombre < b.Nombre ? min : max))
        case 'Precio':
          return datosFiltered.sort((a, b) =>
            a.Precio1IVAUV < b.Precio1IVAUV ? min : max
          )
        case 'UtilidadPrecio':
          return datosFiltered.sort((a, b) =>
            a.UtilidadVenta < b.UtilidadVenta ? min : max
          )
        case 'Oferta':
          return datosFiltered.sort((a, b) =>
            a.PrecioOferta < b.PrecioOferta ? min : max
          )
        case 'UtilidadOferta':
          return datosFiltered.sort((a, b) =>
            a.UtilidadOferta < b.UtilidadOferta ? min : max
          )
        case 'Costo':
          return datosFiltered.sort((a, b) =>
            a.UltimoCosto < b.UltimoCosto ? min : max
          )
        case 'FechaInicio':
          return datosFiltered.sort((a, b) =>
            utils
              .toMoment(a.FechaInicialO.replace('T', ' ').replace('Z', ''))
              .isBefore(
                utils.toMoment(
                  b.FechaInicialO.replace('T', ' ').replace('Z', '')
                )
              )
              ? min
              : max
          )
        case 'FechaTermino':
          return datosFiltered.sort((a, b) =>
            utils
              .toMoment(a.FechaFinalO.replace('T', ' ').replace('Z', ''))
              .isBefore(
                utils.toMoment(b.FechaFinalO.replace('T', ' ').replace('Z', ''))
              )
              ? min
              : max
          )

        default:
          return datosFiltered
      }
    },
  },
  mounted() {
    const tableValidaOfertas = document.getElementById('tableValidaOfertas')

    this.loadOnlyValid()
    this.loadFilterByDate()
    this.setSucursalForUser()

    if (tableValidaOfertas) {
      tableValidaOfertas.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableValidaOfertas.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'validaofertas/setSucursal',
      setOnlyValid: 'validaofertas/setOnlyValid',
      setFilterByDates: 'validaofertas/setFilterByDates',
    }),
    ...mapActions({
      changeData: 'validaofertas/changeData',
    }),
    showHelpFilters() {
      this.showAlertDialog([
        'En esta apartatado podra filtrar las ofertas vigentes por los diferentes filtros que se presentan. <br/>Los filtros se aplican despues de realizar la busquedas; <br/>esto quiero decir que primero debe realizar la validacion y posteriormente jugar con los filtros para mostrar la informacion que usted requiera',
        'Ayuda',
        'info',
      ])
    },
    showHelpDatesSE() {
      this.showAlertDialog([
        'Activar este filtro permite solo obtener las ofertas que comiencen y terminen en fechas especificas. <br/>Por ejemplo: <br/>Si quiere buscar una oferta que comenzo un dia determinado y que termina en una fecha especifica; el filtro evalua unicamente la fecha de Inicio y la Fecha de termino de la Oferta. <br/><br/>Si se mantiene desactivado busca ofertas vigentes entre las fechas determinadas',
        'Ayuda',
        'info',
      ])
    },
    showHelpDatesS() {
      this.showAlertDialog([
        'Si se deja sin seleccionar se considera la fecha de inicio como indeterminada, en este sentido el filtro no considera una fecha de inicio',
        'Ayuda, Fecha de Inicio',
        'info',
      ])
    },
    showHelpDatesE() {
      this.showAlertDialog([
        'Si se deja sin seleccionar se considera la fecha de termino como indeterminada, en este sentido el filtro no considera una fecha de termino',
        'Ayuda, Fecha de Termino',
        'info',
      ])
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
    upPage() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    },
    setActivateLimit(statusNew) {
      this.statusLimit = statusNew
    },
    selectSucursal(sucursal) {
      this.selected = sucursal
      this.setSucursal(sucursal)
    },
    showDetails(article) {
      this.viewDetails = true
      this.articleActual = article
    },
    closeDetails() {
      this.articleActual = {}
      this.viewDetails = false
    },
    loadOnlyValid() {
      const valid = this.$store.state.validaofertas.onlyValid
      this.onliValid = valid
    },
    changeValid(valid) {
      this.setOnlyValid(valid)
    },
    loadFilterByDate() {
      const filter = this.$store.state.validaofertas.filterByDates
      this.filterByDates = filter
    },
    changeFilterByDate(filterByDate) {
      this.setFilterByDates(filterByDate)
    },
    async getValidation() {
      this.setLoading(true)
      const response = await this.changeData([
        this.$store.state.validaofertas.sucursal,
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.select-order {
  width: calc(49% - 5px);
  margin-bottom: 5px;
  margin-right: 5px;
}

.footerConexiones {
  background: rgba(196, 167, 167, 0.411);
  width: 100%;
  padding: 10px;
  padding-right: 10px;
  margin-bottom: 30px;
}

.title-container,
.btn-help {
  position: absolute;
  top: -15px;
  left: 10px;
  padding: 2px 10px;
  font-weight: bold;
}

.btn-help {
  padding: 1px 3px;
  left: 75px;
}

.container-filters {
  position: relative;
  margin-top: 20px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgb(0, 208, 255);
}

.inputs {
  width: (33% - 8px);
  margin-bottom: 10px;
  display: inline-block;
}

@media screen and (max-width: 1199px) {
  .inputs {
    width: calc(49% - 19px);
  }
}

@media screen and (max-width: 991px) {
  .inputs {
    width: calc(49% + 2px);
  }
}

@media screen and (max-width: 767px) {
  .inputs {
    width: 100%;
  }

  .select-order {
    width: 100%;
    margin-right: 0px;
  }
}
</style>
