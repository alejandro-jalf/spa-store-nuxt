export const state = () => ({
  consecutivo: sessionStorage.getItem('spastore_fichinvcea_consecutivo')
    ? JSON.parse(sessionStorage.getItem('spastore_fichinvcea_consecutivo'))
    : { data: [{ Consecutivo: 0 }] },
  tipoEquipo: sessionStorage.getItem('spastore_fichinvcea_tipoEquipo'),
  data: sessionStorage.getItem('spastore_fichinvcea_data')
    ? JSON.parse(sessionStorage.getItem('spastore_fichinvcea_data'))
    : { data: [] },
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_fichinvcea_data', JSON.stringify(data))
  },
  setTipoEquipo(state, tipoEquipo) {
    state.tipoEquipo = tipoEquipo
    sessionStorage.setItem('spastore_fichinvcea_tipoEquipo', tipoEquipo)
  },
  setConsecutivo(state, consecutivo) {
    state.consecutivo = consecutivo
    sessionStorage.setItem(
      'spastore_fichinvcea_consecutivo',
      JSON.stringify(consecutivo)
    )
  },
}

export const actions = {
  async changeData({ commit }) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/inventarioscea/fichas'
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
  async getConsecutivo({ commit }, TipoEquipo) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/inventarioscea/fichas/' +
        TipoEquipo +
        '/last'
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success)
        commit('setConsecutivo', { data: response.data.data })

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
  async addFicha({ commit }, body) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/inventarioscea/fichas'
      const response = await this.$axios({
        url,
        method: 'post',
        data: body,
      })

      if (response.data.success) {
        console.log(response.data.data)
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
