if (!localStorage.getItem('spastore_cocina_tipo'))
  localStorage.setItem('spastore_cocina_tipo', 'line')
if (!localStorage.getItem('spastore_cocina_sucursal'))
  localStorage.setItem('spastore_cocina_sucursal', 'ZR')
if (!localStorage.getItem('spastore_cocina_mes1'))
  localStorage.setItem('spastore_cocina_mes1', 'null')
if (!localStorage.getItem('spastore_cocina_mes2'))
  localStorage.setItem('spastore_cocina_mes2', 'null')

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
  detalles: JSON.parse(localStorage.getItem('spastore_cocina_detalles')) || {
    data: [],
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
  },
  showGraph: true,
  tipo: localStorage.getItem('spastore_cocina_tipo'),
  sucursalSelected: localStorage.getItem('spastore_cocina_sucursal'),
  mes1:
    localStorage.getItem('spastore_cocina_mes1') !== 'null'
      ? localStorage.getItem('spastore_cocina_mes1')
      : null,
  mes2:
    localStorage.getItem('spastore_cocina_mes2') !== 'null'
      ? localStorage.getItem('spastore_cocina_mes2')
      : null,
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
  setMes1(state, mes1) {
    state.mes1 = mes1
    localStorage.setItem('spastore_cocina_mes1', mes1)
  },
  setMes2(state, mes2) {
    state.mes2 = mes2
    localStorage.setItem('spastore_cocina_mes2', mes2)
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
      if (error.response) {
        return error.response.data
      }
      return {
        case: 'Error fatal',
        error,
      }
    }
  },
  async loadDetails({ commit }, { sucursal, dateStart, dateEnd }) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/cocina/ventas/' +
        sucursal +
        '/detalles' +
        '?fechaIni=' +
        dateStart +
        '&fechaFin=' +
        dateEnd
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.response.success) {
        const data = {
          data: response.data.response.data,
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
        }
        commit('setDetalles', data)
      }
      return response.data.response
    } catch (error) {
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
