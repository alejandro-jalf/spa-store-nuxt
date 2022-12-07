if (!localStorage.getItem('spastore_cons_articulos_show_details'))
  localStorage.setItem('spastore_cons_articulos_show_details', false)

export const state = () => ({
  data: sessionStorage.getItem('spastore_cons_articulos_data')
    ? JSON.parse(sessionStorage.getItem('spastore_cons_articulos_data'))
    : { data: [], resumen: [] },
  details: sessionStorage.getItem('spastore_cons_articulos_details')
    ? JSON.parse(sessionStorage.getItem('spastore_cons_articulos_details'))
    : { data: [] },
  consolidacionActual: sessionStorage.getItem('spastore_cons_articulos_actual')
    ? JSON.parse(sessionStorage.getItem('spastore_cons_articulos_actual'))
    : { data: [] },
  showDetails:
    typeof localStorage.getItem('spastore_cons_articulos_show_details') ===
    'boolean'
      ? localStorage.getItem('spastore_cons_articulos_show_details')
      : localStorage.getItem('spastore_cons_articulos_show_details') === 'true',
})

export const mutations = {
  setConsolidacionActual(state, consolidacionActual) {
    state.consolidacionActual = consolidacionActual
    sessionStorage.setItem(
      'spastore_cons_articulos_actual',
      JSON.stringify(consolidacionActual)
    )
  },
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_cons_articulos_data', JSON.stringify(data))
  },
  setDetails(state, details) {
    state.details = details
    sessionStorage.setItem(
      'spastore_cons_articulos_details',
      JSON.stringify(details)
    )
  },
  setShowDetails(state, showDetails) {
    state.showDetails = showDetails
    localStorage.setItem('spastore_cons_articulos_show_details', showDetails)
  },
}

export const actions = {
  async changeData({ commit }, [dateStart, dateEnd]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/articulos/' +
        dateStart +
        '/' +
        dateEnd

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.response.success) {
        commit('setData', {
          data: response.data.response.data,
          resumen: response.data.response.resumen,
        })
      }

      return response.data.response
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
