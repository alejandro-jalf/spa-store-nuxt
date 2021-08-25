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
      const label1 = this.fields[1]
      const label2 = this.fields[2]
      const data1 = []
      const data2 = []
      datos.forEach((sucursal) => {
        if (sucursal.Dia !== 'Total') {
          const diaFinded = dias.find((dia) => sucursal.Dia === dia)
          if (!diaFinded) dias.push(sucursal.Dia)
          data1.push(
            parseFloat(this.utils.roundTo(sucursal[`Venta${this.fields[1]}`]))
          )
          data2.push(
            parseFloat(this.utils.roundTo(sucursal[`Venta${this.fields[2]}`]))
          )
        }
      })
      return {
        type: this.tipo,
        data: {
          labels: dias,
          datasets: [
            {
              label: label1,
              data: data1,
              backgroundColor: 'rgba(251, 92, 0, 0.5)',
              borderColor: '#dd3603',
              borderWidth: 3,
            },
            {
              label: label2,
              data: data2,
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
