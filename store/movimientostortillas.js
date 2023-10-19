if (!localStorage.getItem('spastore_moves_tortillas_sucursal'))
  localStorage.setItem('spastore_moves_tortillas_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_existence_provider_data')
    ? JSON.parse(sessionStorage.getItem('spastore_existence_provider_data'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_moves_tortillas_sucursal'),
  sucursalConsult: localStorage.getItem('spastore_moves_tortillas_suc_consult'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem(
      'spastore_existence_provider_data',
      JSON.stringify(data)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_moves_tortillas_sucursal', sucursal)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    localStorage.setItem(
      'spastore_moves_tortillas_suc_consult',
      sucursalConsult
    )
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, fecha]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/movimientos/' +
        sucursal +
        '/tortillas?fecha=' +
        fecha

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', response.data)
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
