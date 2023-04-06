if (!sessionStorage.getItem('spastore_datab_sucursal'))
  sessionStorage.setItem('spastore_datab_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_datab_data')
    ? JSON.parse(sessionStorage.getItem('spastore_datab_data'))
    : {
        data: [
          { suc: 'zr', data: [], count: 0 },
          { suc: 'vc', data: [], count: 0 },
          { suc: 'er', data: [], count: 0 },
          { suc: 'ou', data: [], count: 0 },
          { suc: 'sy', data: [], count: 0 },
          { suc: 'jl', data: [], count: 0 },
          { suc: 'bo', data: [], count: 0 },
          { suc: 'sc', data: [], count: 0 },
          { suc: 'tf', data: [], count: 0 },
          { suc: 'ty', data: [], count: 0 },
        ],
      },
  sucursal: sessionStorage.getItem('spastore_datab_sucursal'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_datab_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    sessionStorage.setItem('spastore_datab_sucursal', sucursal)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, dateConsult]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/existencias/' +
        sucursal

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        // const data = sessionStorage.getItem('spastore_datab_data')
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
