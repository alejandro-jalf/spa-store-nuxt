if (!localStorage.getItem('spastore_art_vig_sucursal'))
  localStorage.setItem('spastore_art_vig_sucursal', 'ZR')

export const state = () => ({
  data: localStorage.getItem('spastore_art_vig_data')
    ? JSON.parse(localStorage.getItem('spastore_art_vig_data'))
    : { data: [], count: [] },
  dateConsult: localStorage.getItem('spastore_art_vig_date_consult')
    ? localStorage.getItem('spastore_art_vig_date_consult')
    : '00/00/000 a las 00:00 am',
  sucursal: localStorage.getItem('spastore_art_vig_sucursal'),
  sucursalConsult: localStorage.getItem('spastore_art_vig_suc_consult'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_art_vig_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_art_vig_sucursal', sucursal)
  },
  setDateConsult(state, DateConsult) {
    state.dateConsult = DateConsult
    localStorage.setItem('spastore_art_vig_date_consult', DateConsult)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    localStorage.setItem('spastore_art_vig_suc_consult', sucursalConsult)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, dateConsult, FechaDesde]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/vigentes/' +
        sucursal +
        '?FechaDesde=' +
        FechaDesde

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
}
