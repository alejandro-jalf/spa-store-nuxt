<template>
  <div>
    <canvas :id="'planet-chart-' + article"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: {
    datosReactor: {
      required: true,
      type: Array,
    },
    fields: {
      required: true,
      type: Array,
    },
    utils: {
      required: true,
      type: Object,
    },
    tipo: {
      required: true,
      type: String,
    },
    article: {
      required: true,
      type: String,
    },
    view: {
      required: false,
      type: String,
      default: 'Piezas',
    },
  },
  mounted() {
    const ctx = document.getElementById('planet-chart-' + this.article)
    const that = this
    // eslint-disable-next-line no-new
    new Chart(ctx, that.dataConvert(that.datosReactor))
  },
  methods: {
    aplyFormat(value) {
      return parseFloat(this.utils.roundTo(value))
    },
    getBackground(sucursal) {
      const suc = sucursal.value
      if (suc === 'ZR') return 'rgba(251, 92, 0, 0.5)'
      else if (suc === 'VC') return 'rgba(0, 81, 255, 0.5)'
      else if (suc === 'ER') return 'rgba(0, 255, 17, 0.5)'
      else if (suc === 'OU') return 'rgba(246, 255, 0, 0.5)'
      else if (suc === 'SY') return 'rgba(0, 242, 255, 0.5)'
      else if (suc === 'JL') return 'rgba(132, 0, 255, 0.5)'
      else if (suc === 'SC') return 'rgba(255, 0, 242, 0.5)'
    },
    getColor(sucursal) {
      const suc = sucursal.value
      if (suc === 'ZR') return '#dd3603'
      else if (suc === 'VC') return '#2c4ee6'
      else if (suc === 'ER') return '#00ff11'
      else if (suc === 'OU') return '#cfd600'
      else if (suc === 'SY') return '#00f2ff'
      else if (suc === 'JL') return '#8400ff'
      else if (suc === 'SC') return '#ff00f2'
    },
    dataConvert(datos) {
      const labels = this.fields.filter(
        (suc) => suc.value !== 'ALL' && suc.value !== 'SC' && suc.value !== 'BO'
      )
      const fechas = []
      const dataSets = []
      datos.forEach((dia) => {
        const dateFinded = fechas.find((fecha) => dia.Fecha === fecha)
        if (!dateFinded) fechas.push(dia.Fecha)
        labels.forEach((sucursal) => {
          const sucIndex = dataSets.findIndex(
            (info) => info.sucursalInfo === sucursal.value
          )
          let item =
            dia[`${sucursal.value}`] &&
            dia[`${sucursal.value}`][`${this.article}`]
              ? dia[`${sucursal.value}`][`${this.article}`][`${this.view}`]
              : 0
          item = this.aplyFormat(item)
          if (sucIndex === -1) {
            dataSets.push({
              sucursalInfo: sucursal.value,
              label: sucursal.text,
              data: [item],
              backgroundColor: this.getBackground(sucursal),
              borderColor: this.getColor(sucursal),
              borderWidth: 3,
            })
          } else dataSets[sucIndex].data.push(item)
        })
      })
      return {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: dataSets,
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

<style scoped>
.example {
  background: rgba(251, 92, 0, 0.5);
  color: #dd3603;
  background: rgba(0, 81, 255, 0.5);
  color: #2c4ee6;
  background: rgba(0, 255, 17, 0.5);
  color: #00ff11;
  background: rgba(246, 255, 0, 0.5);
  color: #cfd600;
  background: rgba(0, 242, 255, 0.5);
  color: #00f2ff;
  background: rgba(132, 0, 255, 0.5);
  color: #8400ff;
  background: rgba(255, 0, 242, 0.5);
  color: #ff00f2;
}
</style>
