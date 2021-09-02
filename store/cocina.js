if (!localStorage.getItem('spastore_cocina_tipo'))
  localStorage.setItem('spastore_cocina_tipo', 'line')
if (!localStorage.getItem('spastore_cocina_sucursal'))
  localStorage.setItem('spastore_cocina_sucursal', 'ZR')

export const state = () => ({
  dataMes: JSON.parse(localStorage.getItem('spastore_cocina_mes')) || {
    data: [],
    fieldsTotales: ['Dia', 'Septiembre', 'Agosto', 'Total'],
    fieldsCrecimiento: [
      'Dia',
      'Julio',
      'Agosto',
      'CrecimientoDiario',
      'AcumuladoJulio',
      'AcumuladoAgosto',
      'CrecimientoAcumulado',
    ],
  },
  // detalles: JSON.parse(localStorage.getItem('spastore_cocina_detalles')) || {
  //   data: [],
  // },
  detalles: {
    fields: [
      'Suc',
      'Articulo',
      'Nombre',
      'CantidadRegular',
      'Relacion',
      'VentaValorNeta',
      'Fecha',
      'Hora',
    ],
    data: [],
  },
  showGraph: true,
  tipo: localStorage.getItem('spastore_cocina_tipo'),
  sucursalSelected: localStorage.getItem('spastore_cocina_sucursal'),
})

export const mutations = {
  setDataMes(state, data) {
    state.dataMes = data
    localStorage.setItem('spastore_cocina_mes', JSON.stringify(data))
  },
  setDetalles(state, detalles) {
    state.detalles = detalles
    localStorage.setItem('spastore_cocina_detalles', JSON.stringify(detalles))
  },
  setTipoGrafico(state, tipo) {
    state.tipo = tipo
    localStorage.setItem('spastore_cocina_tipo', tipo)
  },
  setSucursalSelected(state, sucursalSelected) {
    state.sucursalSelected = sucursalSelected
    localStorage.setItem('spastore_cocina_sucursal', sucursalSelected)
  },
  setShowGraph(state, showGraph) {
    state.showGraph = showGraph
  },
}

export const actions = {
  async loadDataMoth({ commit }, { sucursales, dateStart, dateEnd }) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/cocina/ventas/' +
        sucursales +
        '?fechaIni=' +
        dateStart +
        '&fechaFin=' +
        dateEnd
      const response = await this.$axios({
        headers: { 'access-token': 'dfa94a69ee28ebdade02657328f187b74db98dd0' },
        url,
        method: 'get',
      })

      if (response.data.response.success) {
        const fieldsCrecimiento = [
          'Dia',
          response.data.response.data.fields[1],
          response.data.response.data.fields[2],
          'CrecimientoDiario',
          `Acumulado${response.data.response.data.fields[1]}`,
          `Acumulado${response.data.response.data.fields[2]}`,
          'CrecimientoAcumulado',
        ]
        const data = {
          data: response.data.response.data.data,
          fieldsTotales: response.data.response.data.fields,
          fieldsCrecimiento,
        }
        commit('setDataMes', data)
      }
      return response.data.response
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      if (error.response) {
        return error.response.data
      }
      return {
        case: 'Error fatal',
        error,
      }
    }
  },
}
