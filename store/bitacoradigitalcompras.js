export const state = () => ({
  data: sessionStorage.getItem('spastore_bit_dig_data')
    ? JSON.parse(sessionStorage.getItem('spastore_bit_dig_data'))
    : { data: [] },
  proveedores: sessionStorage.getItem('spastore_bit_dig_provider')
    ? JSON.parse(sessionStorage.getItem('spastore_bit_dig_provider'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_asistencias_sucursal'),
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
}

export const actions = {
  async getBitacoraCompras({ commit }, [sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/bitacoradigital/compras/last/' +
        sucursal +
        '?limit=5000'
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
