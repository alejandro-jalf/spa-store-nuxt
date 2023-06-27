if (!sessionStorage.getItem('spastore_exist_antig_sucursal'))
  sessionStorage.setItem('spastore_exist_antig_sucursal', 'ZR')
if (!sessionStorage.getItem('spastore_exist_antig_dias'))
  sessionStorage.setItem('spastore_exist_antig_dias', '45')
if (!sessionStorage.getItem('spastore_exist_antig_sucConsulta'))
  sessionStorage.setItem('spastore_exist_antig_sucConsulta', '')

export const state = () => ({
  sucursal: sessionStorage.getItem('spastore_exist_antig_sucursal'),
  dias: sessionStorage.getItem('spastore_exist_antig_dias'),
  sucConsult: sessionStorage.getItem('spastore_exist_antig_sucConsulta'),
  data: sessionStorage.getItem('spastore_exist_antig_data')
    ? JSON.parse(sessionStorage.getItem('spastore_exist_antig_data'))
    : { data: [] },
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    sessionStorage.setItem('spastore_exist_antig_sucursal', sucursal)
  },
  setDias(state, dias) {
    state.dias = dias
    sessionStorage.setItem('spastore_exist_antig_dias', dias)
  },
  setSucConsult(state, sucConsult) {
    state.sucConsult = sucConsult
    sessionStorage.setItem('spastore_exist_antig_sucConsulta', sucConsult)
  },
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_exist_antig_data', JSON.stringify(data))
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, dias]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/general/existencias/' +
        sucursal +
        '/antiguedad/' +
        dias
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', { data: response.data.data })
        commit('setSucConsult', sucursal)
        commit('setDias', dias)
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
