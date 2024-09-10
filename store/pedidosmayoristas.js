export const state = () => ({
  data: sessionStorage.getItem('spastore_pedidosmayor_data')
    ? JSON.parse(sessionStorage.getItem('spastore_pedidosmayor_data'))
    : { data: [] },
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_pedidosmayor_data', JSON.stringify(data))
  },
}

export const actions = {
  async changeData({ commit }, [dateInit, dateEnd]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/mayoristas/solicitudes?dateAt=' +
        dateInit +
        '&dateTo=' +
        dateEnd

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', response.data)
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
