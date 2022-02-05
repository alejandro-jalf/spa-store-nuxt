if (!localStorage.getItem('spastore_asistencias_sucursal'))
  localStorage.setItem('spastore_asistencias_sucursal', null)
if (!localStorage.getItem('spastore_asistencias_sucursal_find'))
  localStorage.setItem('spastore_asistencias_sucursal', '')
if (!localStorage.getItem('spastore_asistencias_dateInit'))
  localStorage.setItem('spastore_asistencias_dateInit', '00/00/0000')
if (!localStorage.getItem('spastore_asistencias_dateEnd'))
  localStorage.setItem('spastore_asistencias_dateEnd', '00/00/0000')

export const state = () => ({
  data: localStorage.getItem('spastore_asistencias_data')
    ? JSON.parse(localStorage.getItem('spastore_asistencias_data'))
    : { data: [], firstSession: true },
  sucursal: localStorage.getItem('spastore_asistencias_sucursal'),
  sucursalFind: localStorage.getItem('spastore_asistencias_sucursal_find'),
  dateInit: localStorage.getItem('spastore_asistencias_dateInit'),
  dateEnd: localStorage.getItem('spastore_asistencias_dateEnd'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_asistencias_data', JSON.stringify(data))
  },
  cleanData(state) {
    state.data = { data: [], firstSession: true }
    localStorage.removeItem('spastore_asistencias_data')
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_asistencias_sucursal', sucursal)
  },
  setSucursalFind(state, sucursal) {
    state.sucursalFind = sucursal.toUpperCase()
    localStorage.setItem('spastore_asistencias_sucursal_find', sucursal)
  },
  setDateInit(state, dateInit) {
    state.dateInit = dateInit
    localStorage.setItem('spastore_asistencias_dateInit', dateInit)
  },
  setDateEnd(state, dateEnd) {
    state.dateEnd = dateEnd
    localStorage.setItem('spastore_asistencias_dateEnd', dateEnd)
  },
}

export const actions = {
  async changeData({ commit }, [dateStart, dateEnd, sucursal, empresa]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/trabajadores/asistencias/' +
        sucursal +
        '?fechaini=' +
        dateStart +
        '&fechafin=' +
        dateEnd +
        '&empresa=' +
        empresa
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        const dateInitInvert =
          dateStart.slice(6, 8) +
          '/' +
          dateStart.slice(4, 6) +
          '/' +
          dateStart.slice(0, 4)

        const dateEndInvert =
          dateEnd.slice(6, 8) +
          '/' +
          dateEnd.slice(4, 6) +
          '/' +
          dateEnd.slice(0, 4)
        commit('setData', { data: response.data.data })
        commit('setSucursalFind', sucursal)
        commit('setDateInit', dateInitInvert)
        commit('setDateEnd', dateEndInvert)
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
