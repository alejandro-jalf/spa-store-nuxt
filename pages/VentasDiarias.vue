<template>
  <div class="mt-3">
    <div class="h3 text-center">Ventas diarias</div>
    <div id="input-Sucursal" class="inputs">
      <b-input-group prepend="Suc">
        <b-form-select
          v-model="selected"
          :options="options"
          @change="changeSuc"
        ></b-form-select>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="date-init"
          v-model="dateInit"
          label-no-date-selected="Fecha no seleccionada"
          @context="onContextDI"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Al">
        <b-form-datepicker
          id="date-end"
          v-model="dateEnd"
          label-no-date-selected="Fecha no seleccionada"
          @context="onContextDE"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button variant="info" :block="width < 992" @click="updateVentas">
      <b-icon icon="search"></b-icon>
      <span v-if="width < 992">Buscar</span>
    </b-button>

    <div class="h4 my-3">{{ leyenda + sucursal }}</div>

    <b-table
      v-if="width > 991"
      id="tableVentasDiarias"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="mt-3"
      :class="variantThemeTableBody"
      foot-clone
    >
      <template #cell(Sucursal)="row">
        {{ row.item.Sucursal.split(' ')[1] }}
      </template>
      <template #cell(Fecha)="row">
        {{ utils.toDate(row.item.Fecha) }}
      </template>
      <template #cell(VentaTotal)="row">
        {{ dataFormated(row.item.VentaTotal) }}
      </template>
      <template #cell(CostoTotal)="row">
        {{ dataFormated(row.item.CostoTotal) }}
      </template>
      <template #cell(UtilidadTotal)="row">
        {{ dataFormated(row.item.UtilidadTotal) }}
      </template>
      <template #cell(UtilidadPorcentual)="row">
        {{
          utils.parseToPorcent(
            utils.roundTo(row.item.UtilidadPorcentual),
            4,
            true
          ) + ' %'
        }}
      </template>
      <template #cell(TicketsTotales)="row">
        {{ dataFormated(row.item.TicketsTotales) }}
      </template>
      <template #cell(UnidadesVendidas)="row">
        {{ dataFormated(row.item.UnidadesVendidas) }}
      </template>
      <template #cell(MejorTicket)="row">
        {{ dataFormated(row.item.MejorTicket) }}
      </template>
      <template #cell(PeorTicket)="row">
        {{ dataFormated(row.item.PeorTicket) }}
      </template>
      <template #cell(TicketPromedio)="row">
        {{ dataFormated(row.item.TicketPromedio) }}
      </template>
      <template #foot(Sucursal)>{{ '' }}</template>
      <template #foot(Fecha)>{{ 'Totales' }}</template>
      <template #foot(VentaTotal)>{{
        dataFormated(totalesRefactor.VentaTotal)
      }}</template>
      <template #foot(CostoTotal)>{{
        dataFormated(totalesRefactor.CostoTotal)
      }}</template>
      <template #foot(UtilidadTotal)>{{
        dataFormated(totalesRefactor.UtilidadTotal)
      }}</template>
      <template #foot(UtilidadPorcentual)>{{
        utils.parseToPorcent(
          utils.roundTo(totalesRefactor.UtilidadPorcentual),
          4,
          true
        ) + ' %'
      }}</template>
      <template #foot(TicketsTotales)>{{
        dataFormated(totalesRefactor.TicketsTotales)
      }}</template>
      <template #foot(UnidadesVendidas)>{{
        dataFormated(totalesRefactor.UnidadesVendidas)
      }}</template>
      <template #foot(MejorTicket)>{{
        dataFormated(totalesRefactor.MejorTicket)
      }}</template>
      <template #foot(PeorTicket)>{{
        dataFormated(totalesRefactor.PeorTicket)
      }}</template>
      <template #foot(TicketPromedio)>{{
        dataFormated(totalesRefactor.TicketPromedio)
      }}</template>
    </b-table>
    <div v-else>
      <VentasDiariasCard
        v-for="(dia, indexDia) in dataRefactor"
        :key="indexDia"
        :sucursal="dia"
        :data-formated="dataFormated"
        :show-details="updateVentas"
        class="mb-2"
      />
      <VentasDiariasCard
        :sucursal="totalesRefactor"
        :data-formated="dataFormated"
        :show-details="updateVentas"
        class="mb-2"
      />
    </div>
    <div v-if="!emptyData">
      <h2>Grafico</h2>
      <div class="mb-5">
        <b-button variant="info" @click="changeGrafico('bar')">
          <b-icon :icon="graficoBar" />
          Barra
        </b-button>
        <b-button variant="info" @click="changeGrafico('line')">
          <b-icon :icon="graficoLine" />
          Linea
        </b-button>
      </div>
      <VentasDiariasChart
        v-if="showGraph"
        :datos-reactor="dataRefactor"
        :utils="utils"
        :tipo="tipoGrafico"
        class="mb-5"
      />
      <div v-else class="spin">
        <b-spinner variant="primary" label="Spinning"></b-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import VentasDiariasChart from '../components/VentasDiariasChart'
import VentasDiariasCard from '../components/VentasDiariasCard'
import utils from '../modules/utils'

export default {
  components: {
    VentasDiariasChart,
    VentasDiariasCard,
  },
  data() {
    return {
      selected: null,
      options: [],
      dateInit: '',
      dateEnd: '',
      dateInitLetra: '',
      dateEndLetra: '',
      fields: [
        'Sucursal',
        'Fecha',
        'VentaTotal',
        'CostoTotal',
        'UtilidadTotal',
        'UtilidadPorcentual',
        'UnidadesVendidas',
        'TicketsTotales',
        'MejorTicket',
        'PeorTicket',
        'TicketPromedio',
      ],
      totales: {
        Fecha: 'Resumen de Ventas',
        VentaTotal: 0,
        CostoTotal: 0,
        UtilidadTotal: 0,
        UtilidadPorcentual: 0,
        UnidadesVendidas: 0,
        TicketsTotales: 0,
        MejorTicket: 0,
        PeorTicket: 0,
        TicketPromedio: 0,
      },
      utils,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    dataUser() {
      return this.$store.state.user.user
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      const datos = [...this.$store.state.ventasdiarias.data.data]
      datos.forEach((dia, indexDia) => {
        if (indexDia === 0) {
          this.totales.VentaTotal = dia.VentaTotal
          this.totales.CostoTotal = dia.CostoTotal
          this.totales.UtilidadTotal = dia.UtilidadTotal
          this.totales.TicketsTotales = dia.TicketsTotales
          this.totales.UnidadesVendidas = dia.UnidadesVendidas
          this.totales.TicketPromedio = dia.TicketPromedio
        } else {
          this.totales.VentaTotal += dia.VentaTotal
          this.totales.CostoTotal += dia.CostoTotal
          this.totales.UnidadesVendidas += dia.UnidadesVendidas
          this.totales.UtilidadTotal += dia.UtilidadTotal
          this.totales.TicketsTotales += dia.TicketsTotales
          this.totales.TicketPromedio += dia.TicketPromedio
        }
        if (indexDia === datos.length - 1) {
          const bestTickets = datos.reduce((acumDia, dia) => {
            acumDia.push(dia.MejorTicket)
            return acumDia
          }, [])
          const worseTickets = datos.reduce((acumDia, dia) => {
            acumDia.push(dia.PeorTicket)
            return acumDia
          }, [])

          this.totales.UtilidadPorcentual =
            1 - this.totales.CostoTotal / this.totales.VentaTotal
          this.totales.MejorTicket = Math.max(...bestTickets)
          this.totales.PeorTicket = Math.min(...worseTickets)
          this.totales.TicketPromedio =
            this.totales.TicketPromedio / datos.length
        }
      })
      datos.sort((a, b) =>
        utils
          .toMoment(a.Fecha.replace('z', ''))
          .isAfter(utils.toMoment(b.Fecha.replace('z', '')))
          ? 1
          : -1
      )
      return datos
    },
    totalesRefactor() {
      const totales = {
        Fecha: 'Resumen de Ventas',
        VentaTotal: 0,
        CostoTotal: 0,
        UtilidadTotal: 0,
        UtilidadPorcentual: 0,
        UnidadesVendidas: 0,
        TicketsTotales: 0,
        MejorTicket: 0,
        PeorTicket: 0,
        TicketPromedio: 0,
      }
      return this.$store.state.ventasdiarias.data.data.length !== 0
        ? this.totales
        : totales
    },
    leyenda() {
      return (
        'Reporte de ventas del ' +
        this.$store.state.ventasdiarias.dateInit +
        ' Al ' +
        this.$store.state.ventasdiarias.dateEnd +
        ' De la sucursal '
      )
    },
    sucursal() {
      return this.$store.state.ventasdiarias.data.data[0]
        ? this.$store.state.ventasdiarias.data.data[0].Sucursal.toUpperCase()
        : ''
    },
    emptyData() {
      return this.$store.state.ventasdiarias.data.data.length <= 0
    },
    graficoBar() {
      return this.$store.state.ventasdiarias.tipo === 'bar'
        ? 'check-circle-fill'
        : 'circle'
    },
    graficoLine() {
      return this.$store.state.ventasdiarias.tipo !== 'bar'
        ? 'check-circle-fill'
        : 'circle'
    },
    showGraph() {
      return this.$store.state.ventasdiarias.showGraph
    },
    tipoGrafico() {
      return this.$store.state.ventasdiarias.tipo
    },
  },
  mounted() {
    const tableVentasDiarias = document.getElementById('tableVentasDiarias')
    const sucSel = this.$store.state.ventasdiarias.sucursal
    this.selected = sucSel
    this.setDateInitials()
    this.setDataForCompany()

    if (tableVentasDiarias) {
      tableVentasDiarias.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableVentasDiarias.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'ventasdiarias/setSucursal',
      setTipoGrafico: 'ventasdiarias/setTipoGrafico',
      setShowGraph: 'ventasdiarias/setShowGraph',
    }),
    ...mapActions({
      changeData: 'ventasdiarias/changeData',
    }),
    onContextDI(ctx) {
      this.dateInitLetra = ctx.selectedFormatted
    },
    onContextDE(ctx) {
      this.dateEndLetra = ctx.selectedFormatted
    },
    validateData() {
      if (
        this.$store.state.ventasdiarias.sucursal === null ||
        this.$store.state.ventasdiarias.sucursal === 'null'
      ) {
        this.showAlertDialog(['Necesita seleccionar una sucursal'])
        return false
      }
      if (this.dateInit === '') {
        this.showAlertDialog(['No ha seleccionado la fecha de inicio'])
        return false
      }
      if (this.dateEnd === '') {
        this.showAlertDialog(['No ha seleccionado la fecha final'])
        return false
      }
      return true
    },
    async updateVentas() {
      if (!this.validateData()) return false
      this.setLoading(true)
      this.setShowGraph(false)
      const response = await this.changeData([
        this.$store.state.ventasdiarias.sucursal,
        this.dateInit.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
        this.dateInitLetra,
        this.dateEndLetra,
      ])
      this.setLoading(false)
      this.setShowGraph(true)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    dataFormated(value) {
      if (value === null) return '-'
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    setDateInitials() {
      const dayActual = utils.getDateNow()
      const dayLast = utils.getDateNow().add(-1, 'days')
      this.dateInit = dayLast.format('yyyy-MM-DD')
      this.dateEnd = dayActual.format('yyyy-MM-DD')
    },
    setDataForCompany() {
      const sucSplited = this.dataUser.sucursal_user.split(' ')
      this.company =
        sucSplited[0].trim().toUpperCase() === 'CAASA' ? 'CAASA' : 'SPA'
      if (this.company === 'SPA') {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'ZR', text: 'Zaragoza' },
          { value: 'VC', text: 'Victoria' },
          { value: 'ER', text: 'Enriquez' },
          { value: 'TF', text: 'Tortilleria Acayucan' },
          { value: 'OU', text: 'Oluta' },
          { value: 'SY', text: 'Sayula' },
          { value: 'TY', text: 'Sayula Tortilleria' },
          { value: 'SC', text: 'Soconusco' },
          { value: 'JL', text: 'Jaltipan' },
          { value: 'BO', text: 'Bodega' },
        ]
      } else {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'SU', text: 'Super' },
          { value: 'MA', text: 'Mayoreo' },
        ]
      }
      const sucFinded = this.options.find((suc) => suc.value === this.selected)
      if (!sucFinded) this.selected = null
    },
    changeSuc(suc) {
      this.setSucursal(suc)
    },
    changeGrafico(tipo) {
      const that = this
      this.setShowGraph(false)
      setTimeout(() => {
        that.setTipoGrafico(tipo)
        this.setShowGraph(true)
      }, 10)
    },
  },
}
</script>

<style scoped>
.inputs {
  width: (33% - 8px);
  margin-bottom: 10px;
  display: inline-block;
}

@media screen and (max-width: 1199px) {
  .inputs {
    width: calc(49% - 19px);
  }

  #input-Sucursal {
    width: 100%;
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
}
</style>
