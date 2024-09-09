if (!localStorage.getItem('spastore_pareto_sucursal'))
  localStorage.setItem('spastore_pareto_sucursal', 'ZR')

export const state = () => ({
  data: localStorage.getItem('spastore_pareto_data')
    ? JSON.parse(localStorage.getItem('spastore_pareto_data'))
    : { data: [], sucursal: 'ZR', FechaIni: '', FechaFin: '' },
  sucursal: localStorage.getItem('spastore_pareto_sucursal'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    console.log(data)
    localStorage.setItem('spastore_pareto_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_pareto_sucursal', sucursal)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, FechaIni, FechaFin]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/ventas/' +
        sucursal +
        '/toparticulosventas?FechaIni=' +
        FechaIni +
        '&FechaFin=' +
        FechaFin
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', {
          data: response.data.data,
          sucursal,
          FechaIni,
          FechaFin,
        })
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
