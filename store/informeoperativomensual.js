if (!sessionStorage.getItem('spastore_iom_sucursal'))
  sessionStorage.setItem('spastore_iom_sucursal', 'ZR')
if (!sessionStorage.getItem('spastore_iom_date_i'))
  sessionStorage.setItem('spastore_iom_date_i', '00/00/0000')
if (!sessionStorage.getItem('spastore_iom_date_f'))
  sessionStorage.setItem('spastore_iom_date_f', '00/00/0000')

export const state = () => ({
  data: sessionStorage.getItem('spastore_existence_provider_data')
    ? JSON.parse(sessionStorage.getItem('spastore_existence_provider_data'))
    : { data: [] },
  sucursal: sessionStorage.getItem('spastore_iom_sucursal'),
  sucursalConsult: sessionStorage.getItem('spastore_iom_suc_consult'),
  dateStart: sessionStorage.getItem('spastore_iom_date_i'),
  dateEnd: sessionStorage.getItem('spastore_iom_date_f'),
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
    sessionStorage.setItem('spastore_iom_sucursal', sucursal)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    sessionStorage.setItem('spastore_iom_suc_consult', sucursalConsult)
  },
  setDateStart(state, dateStart) {
    state.dateStart = dateStart
    sessionStorage.setItem('spastore_iom_date_i', dateStart)
  },
  setDateEnd(state, dateEnd) {
    state.dateEnd = dateEnd
    sessionStorage.setItem('spastore_iom_date_f', dateEnd)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, fechaStart, fechaEnd]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/movimientos/' +
        sucursal +
        '/informeoperativo?fechaStart=' +
        fechaStart +
        '&fechaEnd=' +
        fechaEnd

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.response.success) {
        commit('setData', response.data.response)
        commit('setSucursalConsult', sucursal)
        commit('setDateStart', fechaStart)
        commit('setDateEnd', fechaEnd)
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
