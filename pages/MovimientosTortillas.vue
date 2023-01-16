<template>
  <div>
    <h4 class="text-center mt-2">Movimiento de Tortillas</h4>
    <b-input-group prepend="Sucursal" class="mb-3 w-100">
      <b-form-select
        :value="sucursalSelected"
        :options="options"
        class="w-150"
        @change="setSucursal"
      ></b-form-select>
    </b-input-group>
    <b-input-group prepend="Fecha" class="mb-4">
      <b-form-datepicker
        id="dateEnd"
        v-model="date"
        today-button
        label-no-date-selected="Fecha no seleccionada"
        label-calendar="Calendario"
        label-current-month="Mes Actual"
        label-next-month="Mes Siguiente"
        label-prev-month="Mes Anterior"
        label-next-year="Año Siguiente"
        label-prev-year="Año anterior"
        label-help="Seleccione la fecha de consulta"
        label-today-button="Hoy"
      ></b-form-datepicker>
      <b-input-group-append>
        <b-button variant="info" @click="loadData">Consultar</b-button>
      </b-input-group-append>
    </b-input-group>

    <div
      v-for="(move, indexMove) in dataRefactor"
      :key="indexMove"
      class="card card-details"
    >
      <span>
        <b-avatar variant="info" :text="getSucursal(move)" size="3rem" />
      </span>
      <span class="container-title">
        <span class="h4">Tortillas De Maiz</span>
        <div class="subtitle-card">0957042</div>
      </span>
      <b-container
        v-for="(mv, indexMv) in getMovesData(move)"
        :key="indexMv"
        class="move"
        :class="complementClass(mv)"
      >
        <b-row>
          <b-col class="font-weight-bold">{{ getNameMove(mv) }}</b-col>
          <b-col>{{ mv.CantidadRegular + ' KG' }}</b-col>
          <span class="float-right font-italic mr-3">
            {{ getTimeMove(mv) }}
          </span>
        </b-row>
      </b-container>
      <div class="fecha-detail">{{ getDateMove(move) }}</div>
      <div class="mt-3">
        <h5>Existencia Actual</h5>
        <b-progress height="2rem" show-value class="mb-2">
          <b-progress-bar :value="getValueMove(move)" :max="getMaxMove(move)">
            <strong>{{ getExistenceMove(move) }}</strong>
          </b-progress-bar>
        </b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      date: '',
      sucursalSelected: this.$store.state.movimientostortillas.sucursal,
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
        { value: 'ALL', text: 'Todas' },
      ],
      utils,
    }
  },
  computed: {
    dataRefactor() {
      const sucursalConsult =
        this.$store.state.movimientostortillas.sucursalConsult
      const data = this.$store.state.movimientostortillas.data
      if (sucursalConsult && sucursalConsult === 'ALL') {
        console.log(data)
        return data
      } else {
        console.log({ data })
        return { data }
      }
    },
    isAll() {
      const sucursalConsult =
        this.$store.state.movimientostortillas.sucursalConsult
      return sucursalConsult && sucursalConsult === 'ALL'
    },
  },
  mounted() {
    this.date = utils.getDateNow().format('yyyy-MM-DD')
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'movimientostortillas/setSucursal',
    }),
    ...mapActions({
      changeData: 'movimientostortillas/changeData',
    }),
    getSucursal(data) {
      if (data.lenght > 0) return data.sucursal
      else return '?'
    },
    getNameMove(mv) {
      return mv.TipoMovimiento + ' ' + mv.Tercero
    },
    getTimeMove(mv) {
      return utils
        .toMoment('2000-01-01T' + mv.HoraString + '.000')
        .format('hh:mm a')
    },
    getDateMove(data) {
      if (data.lenght > 0) {
        const date = data.Fecha.toString()
        return utils.toMoment(date.replace('Z', '')).format('DD/MM/yyyy')
      } else return '00/00/0000'
    },
    getMovesData(data) {
      if (data.success > 0) {
        return data.data
      } else return []
    },
    complementClass(mv) {
      return mv.TipoDocumento !== 'V' ? 'move-asc' : 'move-des'
    },
    getValueMove(move) {
      console.log(move)
      if (move) return 0
      return move.data[0].ExistenciaActualRegular
    },
    getExistenceMove(move) {
      if (move) return 0
      return move.data[0].ExistenciaActualRegular + 'KG'
    },
    getMaxMove(move) {
      if (move) return 0
      return move.data[0].ExistenciaActualRegular + move.inputs
    },
    async loadData() {
      const sucursal = this.$store.state.movimientostortillas.sucursal
      this.setLoading(true)
      const response = await this.changeData([
        sucursal,
        this.date.replace(/-/g, ''),
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
  },
}
</script>

<style scoped>
.card-details {
  position: relative;
  display: inline-block;
  color: #000;
  padding: 10px;
  margin-right: 4px;
  width: calc(50% - 5px);
}

.container-title {
  position: relative;
}

.subtitle-card {
  position: absolute;
  top: 16px;
  left: 0px;
  font-weight: 600;
  color: rgb(92, 92, 92);
}

.fecha-detail {
  position: absolute;
  top: 5px;
  right: 10px;
  font-style: italic;
  color: rgb(92, 92, 92);
}

.move {
  margin-top: 10px;
  padding: 3px 10px;
  border-radius: 3px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.move-des {
  color: #fff;
  background: rgb(164, 0, 0);
}

.move-asc {
  color: #fff;
  background: rgb(1, 76, 129);
}
</style>
