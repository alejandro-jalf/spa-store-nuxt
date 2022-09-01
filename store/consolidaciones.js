if (!localStorage.getItem('spastore_consolidaciones_sucursal'))
  localStorage.setItem('spastore_consolidaciones_sucursal', 'ZR')
if (!localStorage.getItem('spastore_consolidaciones_show_details'))
  localStorage.setItem('spastore_consolidaciones_show_details', false)

export const state = () => ({
  data: localStorage.getItem('spastore_consolidaciones_data')
    ? JSON.parse(localStorage.getItem('spastore_consolidaciones_data'))
    : { data: [] },
  details: localStorage.getItem('spastore_consolidaciones_details')
    ? JSON.parse(localStorage.getItem('spastore_consolidaciones_details'))
    : { data: [] },
  consolidacionActual: localStorage.getItem('spastore_consolidaciones_actual')
    ? JSON.parse(localStorage.getItem('spastore_consolidaciones_actual'))
    : { data: [] },
  showDetails:
    typeof localStorage.getItem('spastore_consolidaciones_show_details') ===
    'boolean'
      ? localStorage.getItem('spastore_consolidaciones_show_details')
      : localStorage.getItem('spastore_consolidaciones_show_details') ===
        'true',
  sucursal: localStorage.getItem('spastore_consolidaciones_sucursal'),
})

export const mutations = {
  setConsolidacionActual(state, consolidacionActual) {
    state.consolidacionActual = consolidacionActual
    localStorage.setItem(
      'spastore_consolidaciones_actual',
      JSON.stringify(consolidacionActual)
    )
  },
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_consolidaciones_data', JSON.stringify(data))
  },
  setDetails(state, details) {
    state.details = details
    localStorage.setItem(
      'spastore_consolidaciones_details',
      JSON.stringify(details)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_consolidaciones_sucursal', sucursal)
  },
  setShowDetails(state, showDetails) {
    state.showDetails = showDetails
    localStorage.setItem('spastore_consolidaciones_show_details', showDetails)
  },
}

export const actions = {
  async changeData({ commit }, [dateStart, dateEnd, sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/' +
        sucursal +
        '?fechaIni=' +
        dateStart +
        '&fechaFin=' +
        dateEnd

      console.log(dateStart, dateEnd)
      const response = await this.$axios({
        url,
        method: 'get',
      })

      console.log(response.data)
      if (response.data.response.success) {
        commit('setData', { data: response.data.response.data })
      }

      return response.data.response
    } catch (error) {
      if (error.response) {
        console.log(error.response)
        return error.response.data
      } else console.log(error)
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
  async loadDetails({ commit }, [sucursal, documento, data]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/' +
        sucursal +
        '/articulos/' +
        documento
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setDetails', { data: response.data.data })
        commit('setShowDetails', true)
        commit('setConsolidacionActual', { data })
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
