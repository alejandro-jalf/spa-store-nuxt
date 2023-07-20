if (!sessionStorage.getItem('spastore_claves_asist_sucursal'))
  sessionStorage.setItem('spastore_claves_asist_sucursal', 'ZR')
if (!sessionStorage.getItem('spastore_claves_asist_view'))
  sessionStorage.setItem('spastore_claves_asist_view', 'REGISTRO')

export const state = () => ({
  data: sessionStorage.getItem('spastore_claves_asist_data')
    ? JSON.parse(sessionStorage.getItem('spastore_claves_asist_data'))
    : { data: [] },
  sucursal: sessionStorage.getItem('spastore_claves_asist_sucursal'),
  view: sessionStorage.getItem('spastore_claves_asist_view'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_claves_asist_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    sessionStorage.setItem('spastore_claves_asist_sucursal', sucursal)
  },
  setView(state, view) {
    state.view = view
    sessionStorage.setItem('spastore_claves_asist_view', view)
  },
}

export const actions = {
  async registerA({ commit }, [sucursal, cajero, Clave, estatus]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/trabajadores/asistencias/' +
        sucursal +
        '/' +
        cajero +
        '/' +
        estatus

      const response = await this.$axios({
        url,
        method: 'post',
        data: { Clave },
      })

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
