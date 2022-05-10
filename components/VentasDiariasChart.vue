<template>
  <div>
    <canvas id="planet-chart"></canvas>
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
    utils: {
      required: true,
      type: Object,
    },
    tipo: {
      required: true,
      type: String,
    },
  },
  mounted() {
    const ctx = document.getElementById('planet-chart')
    const that = this
    // eslint-disable-next-line no-new
    new Chart(ctx, that.dataConvert(that.datosReactor))
  },
  methods: {
    dataConvert(datos) {
      const dias = []
      const label = 'Venta Valor Neto'
      const data = []
      datos.forEach((sucursal) => {
        if (sucursal.Dia !== 'Total') {
          dias.push(this.utils.toDate(sucursal.Fecha))
          data.push(parseFloat(this.utils.roundTo(sucursal.VentaTotal)))
        }
      })
      return {
        type: this.tipo,
        data: {
          labels: dias,
          datasets: [
            {
              label,
              data,
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
