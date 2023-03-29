if (!localStorage.getItem('spastore_existence_bs_sucursal'))
  localStorage.setItem('spastore_existence_bs_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_existence_bs_data')
    ? JSON.parse(sessionStorage.getItem('spastore_existence_bs_data'))
    : { data: [], count: [] },
  dateConsult: sessionStorage.getItem('spastore_existence_bs_date_consult')
    ? sessionStorage.getItem('spastore_existence_bs_date_consult')
    : '00/00/000 a las 00:00 am',
  sucursal: localStorage.getItem('spastore_existence_bs_sucursal'),
  sucursalConsult: sessionStorage.getItem('spastore_existence_bs_suc_consult'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_existence_bs_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_existence_bs_sucursal', sucursal)
  },
  setDateConsult(state, DateConsult) {
    state.dateConsult = DateConsult
    sessionStorage.setItem('spastore_existence_bs_date_consult', DateConsult)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    sessionStorage.setItem('spastore_existence_bs_suc_consult', sucursalConsult)
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
        commit('setData', response.data)
        commit('setDateConsult', dateConsult)
        commit('setSucursalConsult', sucursal)
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
  async loadProveedores({ commit }, [sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/proveedores/' + sucursal
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
