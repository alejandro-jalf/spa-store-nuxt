if (!localStorage.getItem('spastore_stocks_sucursal'))
  localStorage.setItem('spastore_stocks_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_stocks_data')
    ? JSON.parse(sessionStorage.getItem('spastore_stocks_data'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_stocks_sucursal'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_stocks_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_stocks_sucursal', sucursal)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, company]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/stocks?sucursal=' +
        sucursal +
        '&company=' +
        company
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
}
