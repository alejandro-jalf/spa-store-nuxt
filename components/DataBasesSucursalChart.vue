<template>
  <div>
    <h2>Grafico</h2>
    <div class="mb-5">
      <b-button variant="info" @click="refreshGrafico()">
        <b-icon icon="arrow-repeat" />
        Refrescar
      </b-button>
    </div>
    <canvas :id="'chart-suc-' + sucursal" class="mb-5"></canvas>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Chart from 'chart.js'

export default {
  props: {
    sucursal: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      tipo: 'bar',
    }
  },
  computed: {
    showGraph() {
      return this.$store.state.databases.showGraph
    },
    dataExistencias() {
      const data = [...this.$store.state.databases.data.data]
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      return sucFindIndex !== -1 ? data[sucFindIndex].data : []
    },
  },
  mounted() {
    const that = this
    const ctx = document.getElementById('chart-suc-' + that.sucursal)
    // eslint-disable-next-line no-new
    new Chart(ctx, that.dataConvert(that.dataExistencias))
  },
  methods: {
    ...mapMutations({
      setShowGraph: 'databases/setShowGraph',
    }),
    refreshGrafico() {
      const that = this
      this.setShowGraph(false)
      setTimeout(() => {
        that.setShowGraph(true)
      }, 100)
    },
    dataConvert(datos) {
      const dbNames = []
      const label1 = 'Data MB'
      const label2 = 'Log MB'
      const dataMB = []
      const logMB = []
      datos.forEach((dbInfo) => {
        dbNames.push(dbInfo.DataBaseName)
        dataMB.push(parseFloat(dbInfo.DataFileSizeMB))
        logMB.push(parseFloat(dbInfo.LogFileSizeMB))
      })
      return {
        type: this.tipo,
        data: {
          labels: dbNames,
          datasets: [
            {
              label: label1,
              data: dataMB,
              backgroundColor: 'rgba(251, 92, 0, 0.5)',
              borderColor: '#dd3603',
              borderWidth: 3,
            },
            {
              label: label2,
              data: logMB,
              backgroundColor: 'rgba(0, 81, 255, 0.5)',
              borderColor: '#2c4ee6',
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25,
                },
              },
            ],
          },
        },
      }
    },
  },
}
</script>
