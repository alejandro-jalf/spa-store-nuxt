if (!sessionStorage.getItem('spastore_claves_asist_sucursal'))
  sessionStorage.setItem('spastore_claves_asist_sucursal', 'ZR')
if (!sessionStorage.getItem('spastore_claves_asist_view'))
  sessionStorage.setItem('spastore_claves_asist_view', 'REGISTRO')

export const state = () => ({
  data: sessionStorage.getItem('spastore_claves_asist_data')
    ? JSON.parse(sessionStorage.getItem('spastore_claves_asist_data'))
    : { data: [] },
  sucursal: sessionStorage.getItem('spastore_claves_asist_sucursal'),
  sucConsult: sessionStorage.getItem('spastore_claves_asist_consult'),
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
  setSucConsult(state, sucConsult) {
    state.sucConsult = sucConsult
    sessionStorage.setItem('spastore_claves_asist_consult', sucConsult)
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
  async changeData({ commit }, sucursal) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/trabajadores/' + sucursal

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', response.data)
        commit('setSucConsult', sucursal)
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
  async addClave({ commit }, [sucursal, Clave, Cajero, IdTrabajador]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/trabajadores/claves/' +
        sucursal

      const response = await this.$axios({
        url,
        method: 'post',
        data: { Clave, Cajero, IdTrabajador },
      })

      if (response.data.success) commit('setView', 'REGISTRO')

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
