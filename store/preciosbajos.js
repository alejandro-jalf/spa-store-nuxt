if (!localStorage.getItem('spastore_preciosbajos_sucursal'))
  localStorage.setItem('spastore_preciosbajos_sucursal', 'ZR')
if (!localStorage.getItem('spastore_preciosbajos_suc_consult'))
  localStorage.setItem('spastore_preciosbajos_suc_consult', '')
if (!localStorage.getItem('spastore_preciosbajos_horaConsulta'))
  localStorage.setItem('spastore_preciosbajos_horaConsulta', '')

export const state = () => ({
  sucursal: localStorage.getItem('spastore_preciosbajos_sucursal'),
  sucursalConsult: localStorage.getItem('spastore_preciosbajos_suc_consult'),
  horaConsult: localStorage.getItem('spastore_preciosbajos_horaConsulta'),
  data: localStorage.getItem('spastore_preciosbajos_data')
    ? JSON.parse(localStorage.getItem('spastore_preciosbajos_data'))
    : { data: [] },
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_preciosbajos_sucursal', sucursal)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    localStorage.setItem('spastore_preciosbajos_suc_consult', sucursalConsult)
  },
  setHoraConsult(state, horaConsult) {
    state.horaConsult = horaConsult
    localStorage.setItem('spastore_preciosbajos_horaConsulta', horaConsult)
  },
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_preciosbajos_data', JSON.stringify(data))
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, procentaje]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/utilidades/' +
        sucursal +
        '?porcentajeUtilidad=' +
        procentaje
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', { data: response.data.data })
        commit('setSucursalConsult', sucursal)
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
