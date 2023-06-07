if (!localStorage.getItem('spastore_facturas_sucursal'))
  localStorage.setItem('spastore_facturas_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_facturas_data')
    ? JSON.parse(sessionStorage.getItem('spastore_facturas_data'))
    : { data: [] },
  fechaStart: sessionStorage.getItem('spastore_facturas_date_start'),
  fechaEnd: sessionStorage.getItem('spastore_facturas_date_end'),
  sucursal: localStorage.getItem('spastore_facturas_sucursal'),
  sucursalConsult: localStorage.getItem('spastore_facturas_sucursal_consult'),
  timbrado: localStorage.getItem('spastore_facturas_timbrado'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_facturas_data', JSON.stringify(data))
  },
  setFechaStart(state, fechaStart) {
    state.fechaStart = fechaStart
    sessionStorage.setItem('spastore_facturas_date_start', fechaStart)
  },
  setFechaEnd(state, fechaEnd) {
    state.fechaEnd = fechaEnd
    sessionStorage.setItem('spastore_facturas_date_end', fechaEnd)
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_facturas_sucursal', sucursal)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    localStorage.setItem('spastore_facturas_sucursal_consult', sucursalConsult)
  },
  setTimbrado(state, timbrado) {
    state.timbrado = timbrado
    localStorage.setItem('spastore_facturas_timbrado', timbrado)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, dateStart, dateEnd]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/general/facturas/' +
        sucursal +
        '?dateStart=' +
        dateStart +
        '&dateEnd=' +
        dateEnd

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', response.data)
        commit('setFechaStart', dateStart)
        commit('setFechaEnd', dateEnd)
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
