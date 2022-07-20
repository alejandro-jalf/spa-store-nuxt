if (!localStorage.getItem('spastore_validaofertas_sucursal'))
  localStorage.setItem('spastore_validaofertas_sucursal', 'ZR')
if (!localStorage.getItem('spastore_validaofertas_only_valid'))
  localStorage.setItem('spastore_validaofertas_only_valid', 'false')
if (!localStorage.getItem('spastore_validaofertasfilter_by_dates'))
  localStorage.setItem('spastore_validaofertasfilter_by_dates', false)

export const state = () => ({
  sucursal: localStorage.getItem('spastore_validaofertas_sucursal'),
  onlyValid:
    typeof localStorage.getItem('spastore_validaofertas_only_valid') ===
    'boolean'
      ? localStorage.getItem('spastore_validaofertas_only_valid')
      : localStorage.getItem('spastore_validaofertas_only_valid') === 'true',
  filterByDates:
    typeof localStorage.getItem('spastore_validaofertasfilter_by_dates') ===
    'boolean'
      ? localStorage.getItem('spastore_validaofertasfilter_by_dates')
      : localStorage.getItem('spastore_validaofertasfilter_by_dates') ===
        'true',
  data: localStorage.getItem('spastore_validaofertas_data')
    ? JSON.parse(localStorage.getItem('spastore_validaofertas_data'))
    : { data: [] },
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_validaofertas_sucursal', sucursal)
  },
  setOnlyValid(state, onlyValid) {
    state.onlyValid = onlyValid
    localStorage.setItem('spastore_validaofertas_only_valid', onlyValid)
  },
  setFilterByDates(state, filterByDates) {
    state.filterByDates = filterByDates
    localStorage.setItem('spastore_validaofertasfilter_by_dates', filterByDates)
  },
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_validaofertas_data', JSON.stringify(data))
  },
}

export const actions = {
  async changeData({ commit }, sucursal) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/ofertas/' +
        sucursal +
        '/validas'
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', { data: response.data.data })
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
