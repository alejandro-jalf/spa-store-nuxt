if (!localStorage.getItem('spastore_ventasdiarias_sucursal'))
  localStorage.setItem('spastore_ventasdiarias_sucursal', null)
if (!localStorage.getItem('spastore_ventasdiarias_dateInit'))
  localStorage.setItem('spastore_ventasdiarias_dateInit', '00/00/0000')
if (!localStorage.getItem('spastore_ventasdiarias_dateEnd'))
  localStorage.setItem('spastore_ventasdiarias_dateEnd', '00/00/0000')
if (!localStorage.getItem('spastore_ventasdiarias_tipo'))
  localStorage.setItem('spastore_ventasdiarias_tipo', 'line')

export const state = () => ({
  data: localStorage.getItem('spastore_ventasdiarias_data')
    ? JSON.parse(localStorage.getItem('spastore_ventasdiarias_data'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_ventasdiarias_sucursal'),
  sucursalConsult: localStorage.getItem('spastore_ventasdiarias_suc_consu'),
  dateInit: localStorage.getItem('spastore_ventasdiarias_dateInit'),
  dateEnd: localStorage.getItem('spastore_ventasdiarias_dateEnd'),
  tipo: localStorage.getItem('spastore_ventasdiarias_tipo'),
  showGraph: true,
})

export const mutations = {
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_ventasdiarias_data', JSON.stringify(data))
  },
  cleanData(state) {
    state.data = { data: [] }
    localStorage.removeItem('spastore_ventasdiarias_data')
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_ventasdiarias_sucursal', sucursal)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    localStorage.setItem('spastore_ventasdiarias_suc_consu', sucursalConsult)
  },
  setDateInit(state, dateInit) {
    state.dateInit = dateInit
    localStorage.setItem('spastore_ventasdiarias_dateInit', dateInit)
  },
  setDateEnd(state, dateEnd) {
    state.dateEnd = dateEnd
    localStorage.setItem('spastore_ventasdiarias_dateEnd', dateEnd)
  },
  setTipoGrafico(state, tipo) {
    state.tipo = tipo
    localStorage.setItem('spastore_ventasdiarias_tipo', tipo)
  },
  setShowGraph(state, showGraph) {
    state.showGraph = showGraph
  },
}

export const actions = {
  async changeData(
    { commit },
    [sucursal, dateStart, dateEnd, dateStartLetra, dateEndLetra]
  ) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/ventas/' +
        sucursal +
        '?FechaIni=' +
        dateStart +
        '&FechaFin=' +
        dateEnd
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', { data: response.data.data })
        commit('setDateInit', dateStartLetra)
        commit('setDateEnd', dateEndLetra)
        commit('setSucursalConsult', sucursal)
      }

      return response.data
    } catch (error) {
      if (error.response) return error.response.data
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
}
