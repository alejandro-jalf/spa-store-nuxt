if (!localStorage.getItem('spastore_consolidaciones_sucursal'))
  localStorage.setItem('spastore_consolidaciones_sucursal', 'ZR')

export const state = () => ({
  data: localStorage.getItem('spastore_consolidaciones_data')
    ? JSON.parse(localStorage.getItem('spastore_consolidaciones_data'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_consolidaciones_sucursal'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_consolidaciones_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_consolidaciones_sucursal', sucursal)
  },
}

export const actions = {
  async changeData({ commit }, [dateStart, dateEnd, sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/' +
        sucursal +
        '?fechaIni=' +
        dateStart +
        '&fechaFin=' +
        dateEnd
      const response = await this.$axios({
        url,
        method: 'get',
        headers: { 'access-token': 'dfa94a69ee28ebdade02657328f187b74db98dd0' },
      })

      if (response.data.response.success) {
        commit('setData', { data: response.data.response.data })
      }

      return response.data.response
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
