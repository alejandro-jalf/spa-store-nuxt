export const state = () => ({
  data: localStorage.getItem('spastore_depsinvcea_data')
    ? JSON.parse(localStorage.getItem('spastore_depsinvcea_data'))
    : { data: [] },
})

export const mutations = {
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_depsinvcea_data', JSON.stringify(data))
  },
}

export const actions = {
  async changeData({ commit }) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/inventarioscea/departamentos'
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
  async add({ commit }, body) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/inventarioscea/departamentos'
      const response = await this.$axios({
        url,
        method: 'post',
        data: body,
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
  async update({ commit }, [Codigo, body]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/inventarioscea/departamentos/' +
        Codigo
      const response = await this.$axios({
        url,
        method: 'put',
        data: body,
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
  async delete({ commit }, Codigo) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/inventarioscea/departamentos/' +
        Codigo
      const response = await this.$axios({
        url,
        method: 'delete',
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
