if (!localStorage.getItem('spastore_rep_gastos_sucursal'))
  localStorage.setItem('spastore_rep_gastos_sucursal', 'ZR')

if (!sessionStorage.getItem('spastore_rep_gastos_sucursal_find'))
  sessionStorage.setItem('spastore_rep_gastos_sucursal_find', '')

if (!sessionStorage.getItem('spastore_rep_gastos_date_corte'))
  sessionStorage.setItem('spastore_rep_gastos_date_corte', '00/00/0000')

export const state = () => ({
  data: sessionStorage.getItem('spastore_rep_gastos_data')
    ? JSON.parse(sessionStorage.getItem('spastore_rep_gastos_data'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_rep_gastos_sucursal'),
  sucursalFind: sessionStorage.getItem('spastore_rep_gastos_sucursal_find'),
  dateCorte: sessionStorage.getItem('spastore_rep_gastos_date_corte'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_rep_gastos_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_rep_gastos_sucursal', sucursal)
  },
  setSucursalFind(state, sucursal) {
    state.sucursalFind = sucursal.toUpperCase()
    sessionStorage.setItem('spastore_rep_gastos_sucursal_find', sucursal)
  },
  setDateCorte(state, dateCorte) {
    state.dateCorte = dateCorte
    sessionStorage.setItem('spastore_rep_gastos_date_corte', dateCorte)
  },
}

export const actions = {
  async changeData({ commit }, [dateCorte, sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/reposiciones/gastos/' +
        sucursal +
        '?FechaCorte=' +
        dateCorte
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        const dateCorteInvert =
          dateCorte.slice(6, 8) +
          '/' +
          dateCorte.slice(4, 6) +
          '/' +
          dateCorte.slice(0, 4)

        commit('setData', { data: response.data.data })
        commit('setSucursalFind', sucursal)
        commit('setDateCorte', dateCorteInvert)
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
