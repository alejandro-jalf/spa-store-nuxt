<template>
  <div class="mt-3">
    <div class="h3 text-center">Ventas Por Articulo</div>
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
    <b-form-tags
      v-model="articles"
      no-outer-focus
      class="mb-2"
      tag-variant="primary"
    >
      <template
        v-slot="{
          tags,
          inputAttrs,
          inputHandlers,
          tagVariant,
          addTag,
          removeTag,
        }"
      >
        <b-input-group class="mb-2">
          <b-form-input
            v-bind="inputAttrs"
            placeholder="Escribe el articulo y presiona enter para agregar"
            class="form-control"
            v-on="inputHandlers"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="primary" @click="addTag()">Agregar</b-button>
          </b-input-group-append>
        </b-input-group>
        <div class="d-inline-block" style="font-size: 1.5rem">
          <b-form-tag
            v-for="tag in tags"
            :key="tag"
            :title="tag"
            :variant="tagVariant"
            class="mr-1"
            @remove="removeTag(tag)"
          >
            {{ tag }}
          </b-form-tag>
        </div>
      </template>
    </b-form-tags>

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
      <template #cell(Fecha)="row">
        {{ utils.toDate(row.item.Fecha) }}
      </template>
      <template #cell(Zaragoza)="row">
        {{ dataFormated(row.item.Zaragoza) }}
      </template>
      <template #cell(Victoria)="row">
        {{ dataFormated(row.item.Victoria) }}
      </template>
      <template #cell(Enriquez)="row">
        {{ dataFormated(row.item.Enriquez) }}
      </template>
      <template #cell(Oluta)="row">
        {{ dataFormated(row.item.Oluta) }}
      </template>
      <template #cell(Sayula)="row">
        {{ dataFormated(row.item.Sayula) }}
      </template>
      <template #cell(Jaltipan)="row">
        {{ dataFormated(row.item.Jaltipan) }}
      </template>
      <template #foot(Fecha)>{{ 'Totales' }}</template>
      <template #foot(Zaragoza)>
        {{ dataFormated(totalesRefactor.Zaragoza) }}
      </template>
      <template #foot(Victoria)>
        {{ dataFormated(totalesRefactor.Victoria) }}
      </template>
      <template #foot(Enriquez)>
        {{ dataFormated(totalesRefactor.Enriquez) }}
      </template>
      <template #foot(Oluta)>
        {{ dataFormated(totalesRefactor.Oluta) }}
      </template>
      <template #foot(Sayula)>
        {{ dataFormated(totalesRefactor.Sayula) }}
      </template>
      <template #foot(Jaltipan)>
        {{ dataFormated(totalesRefactor.Jaltipan) }}
      </template>
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
      selected: 'ALL',
      options: [
        { value: 'ALL', text: 'Todas' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'SC', text: 'Soconusco', disabled: true },
        { value: 'BO', text: 'Bodega', disabled: true },
      ],
      articles: [],
      dateInit: '',
      dateEnd: '',
      dateInitLetra: '',
      dateEndLetra: '',
      fields: [
        'Fecha',
        'Zaragoza',
        'Victoria',
        'Enriquez',
        'Oluta',
        'Sayula',
        'Jaltipan',
        'Totales',
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
      return []
    },
    totalesRefactor() {
      const totales = {
        Fecha: 'Resumen de Ventas',
        Zaragoza: 0,
        Victoria: 0,
        Enriquez: 0,
        Oluta: 0,
        Sayula: 0,
        Jaltipan: 0,
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
      if (value === null || value === undefined) return '-'
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    setDateInitials() {
      const dayActual = utils.getDateNow()
      const dayLast = utils.getDateNow().add(-7, 'days')
      this.dateInit = dayLast.format('yyyy-MM-DD')
      this.dateEnd = dayActual.format('yyyy-MM-DD')
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
