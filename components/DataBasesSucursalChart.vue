<template>
  <div>
    <canvas id="planet-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: {
    sucursal: {
      required: true,
      type: String,
    },
    tipo: {
      required: false,
      type: String,
      default: 'bar',
    },
  },
  computed: {
    dataExistencias() {
      const data = this.$store.state.databases.data.data
      const sucursal = this.sucursal
      const sucFindIndex = data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      return sucFindIndex !== -1 ? data[sucFindIndex].data : []
    },
  },
  mounted() {
    const ctx = document.getElementById('planet-chart')
    const that = this
    // eslint-disable-next-line no-new
    new Chart(ctx, that.dataConvert(that.dataExistencias))
  },
  methods: {
    dataConvert(datos) {
      console.log('Entra', datos)
      const dbNames = []
      const label1 = 'Data MB'
      const label2 = 'Log MB'
      const dataMB = []
      const logMB = []
      datos.forEach((dbInfo) => {
        // const diaFinded = dbNames.find((dia) => dbInfo.Dia === dia)
        dbNames.push(dbInfo.DataBaseName)
        dataMB.push(parseFloat(dbInfo.DataFileSizeMB))
        logMB.push(parseFloat(dbInfo.LogFileSizeMB))
        // if (dbInfo.Dia !== 'Total') {
        // }
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
