export const state = () => ({
  data: sessionStorage.getItem('spastore_bit_dig_data')
    ? JSON.parse(sessionStorage.getItem('spastore_bit_dig_data'))
    : { data: [] },
  proveedores: sessionStorage.getItem('spastore_bit_dig_provider')
    ? JSON.parse(sessionStorage.getItem('spastore_bit_dig_provider'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_asistencias_sucursal'),
  view: sessionStorage.getItem('spastore_bit_dig_view') || 'NO',
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_bit_dig_data', JSON.stringify(data))
  },
  setProviders(state, proveedores) {
    state.proveedores = proveedores
    sessionStorage.setItem(
      'spastore_bit_dig_provider',
      JSON.stringify(proveedores)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_asistencias_sucursal', sucursal)
  },
  setView(state, view) {
    state.view = view
    sessionStorage.setItem('spastore_bit_dig_view', view)
  },
}

export const actions = {
  async getBitacoraCompras({ commit }, [sucursal, fecha = -1]) {
    try {
      const last = fecha === -1 ? 'last/' : ''
      const complement = fecha === -1 ? '' : '&fecha=' + fecha
      const url =
        process.env.spastore_url_backend +
        'api/v1/bitacoradigital/compras/' +
        last +
        sucursal +
        '?limit=5000' +
        complement
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', { data: response.data.data })
      }

      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
  async getProveedores({ commit }) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/bitacoradigital/proveedores'
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setProviders', { data: response.data.data })
      }

      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
}
