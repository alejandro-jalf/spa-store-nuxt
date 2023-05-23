if (!localStorage.getItem('spastore_revision_costos_sucursal'))
  localStorage.setItem('spastore_revision_costos_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_revision_costos_data')
    ? JSON.parse(sessionStorage.getItem('spastore_revision_costos_data'))
    : { data: [] },
  fecha: sessionStorage.getItem('spastore_revision_costos_date'),
  sucursal: localStorage.getItem('spastore_revision_costos_sucursal'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem(
      'spastore_revision_costos_data',
      JSON.stringify(data)
    )
  },
  setFecha(state, fecha) {
    state.fecha = fecha
    sessionStorage.setItem('spastore_revision_costos_date', fecha)
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_revision_costos_sucursal', sucursal)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, fecha]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/' +
        sucursal +
        '/costos/' +
        fecha

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', response.data)
        commit('setFecha', fecha)
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
  async updateCostos({ commit }, [sucursal, listCostos]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/' +
        sucursal +
        '/costos/'

      const response = await this.$axios({
        url,
        method: 'put',
        data: { listCostos },
      })

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
