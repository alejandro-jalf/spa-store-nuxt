if (!sessionStorage.getItem('spastore_datab_sucursal'))
  sessionStorage.setItem('spastore_datab_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_datab_data')
    ? JSON.parse(sessionStorage.getItem('spastore_datab_data'))
    : {
        data: [
          { suc: 'ZR', data: [], count: 0 },
          { suc: 'VC', data: [], count: 0 },
          { suc: 'ER', data: [], count: 0 },
          { suc: 'OU', data: [], count: 0 },
          { suc: 'SY', data: [], count: 0 },
          { suc: 'JL', data: [], count: 0 },
          { suc: 'BO', data: [], count: 0 },
          { suc: 'SC', data: [], count: 0 },
          { suc: 'TF', data: [], count: 0 },
          { suc: 'TY', data: [], count: 0 },
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
  async changeData({ commit }, [sucursal]) {
    try {
      const url = `${process.env.spastore_url_backend}api/v1/general/databases/${sucursal}/information`

      const response = await this.$axios({
        url,
        method: 'get',
      })

      console.log(response.data)
      if (response.data.success) {
        const data = sessionStorage.getItem('spastore_datab_data')
          ? JSON.parse(sessionStorage.getItem('spastore_datab_data'))
          : {
              data: [
                { suc: 'ZR', data: [], count: 0 },
                { suc: 'VC', data: [], count: 0 },
                { suc: 'ER', data: [], count: 0 },
                { suc: 'OU', data: [], count: 0 },
                { suc: 'SY', data: [], count: 0 },
                { suc: 'JL', data: [], count: 0 },
                { suc: 'BO', data: [], count: 0 },
                { suc: 'SC', data: [], count: 0 },
                { suc: 'TF', data: [], count: 0 },
                { suc: 'TY', data: [], count: 0 },
              ],
            }

        const sucFindIndex = data.data.findIndex(
          (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
        )
        data.data[sucFindIndex].data = response.data.data
        data.data[sucFindIndex].count = response.data.data.length
        commit('setData', data)
      }

      return response.data
    } catch (error) {
      console.log(error.response || error)
      if (error.response) return error.response.data
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
}