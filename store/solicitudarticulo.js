if (!localStorage.getItem('spastore_sol_articulos_sucursal'))
  localStorage.setItem('spastore_sol_articulos_sucursal', 'ZR')
if (!sessionStorage.getItem('spastore_sol_articulos_ventana'))
  sessionStorage.setItem('spastore_sol_articulos_ventana', 'LIST')
if (!sessionStorage.getItem('spastore_sol_articulos_v_tipo'))
  sessionStorage.setItem('spastore_sol_articulos_v_tipo', 'VIEW')

export const state = () => ({
  data: sessionStorage.getItem('spastore_sol_articulos_data')
    ? JSON.parse(sessionStorage.getItem('spastore_sol_articulos_data'))
    : { data: [] },
  actual: sessionStorage.getItem('spastore_sol_articulos_actual')
    ? JSON.parse(sessionStorage.getItem('spastore_sol_articulos_actual'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_sol_articulos_sucursal'),
  ventana: sessionStorage.getItem('spastore_sol_articulos_ventana'),
  tipoSolicitud: sessionStorage.getItem('spastore_sol_articulos_v_tipo'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_sol_articulos_data', JSON.stringify(data))
  },
  setActual(state, actual) {
    state.actual = actual
    sessionStorage.setItem(
      'spastore_sol_articulos_actual',
      JSON.stringify(actual)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_sol_articulos_sucursal', sucursal)
  },
  setVentana(state, ventana) {
    state.ventana = ventana
    sessionStorage.setItem('spastore_sol_articulos_ventana', ventana)
  },
  setTipoSolicitud(state, tipoSolicitud) {
    state.tipoSolicitud = tipoSolicitud
    sessionStorage.setItem('spastore_sol_articulos_v_tipo', tipoSolicitud)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/solicitud/articulos?sucursal=' +
        sucursal

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) commit('setData', response.data)

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
  async createRequest({ commit }, [sucursal, CreadoPor]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/solicitud/articulos/' +
        sucursal

      const response = await this.$axios({
        url,
        method: 'post',
        data: { CreadoPor },
      })

      if (response.data.success) {
        commit('setActual', response.data)
        commit('setVentana', 'EDIT_NEW')
        commit('setTipoSolicitud', 'NEW')
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
  async loadSolicitud({ commit }, [uuid]) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/solicitud/articulos/' + uuid

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) commit('setActual', response.data)

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
  async saveRequest({ commit }, [uuid, data]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/solicitud/articulos/' +
        uuid +
        '/update'

      const response = await this.$axios({
        url,
        method: 'put',
        data,
      })

      if (response.data.success) commit('setVentana', 'LIST')

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
  async changeEstatus({ commit }, [uuid, estatus, Articulo]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/solicitud/articulos/' +
        uuid +
        '/status/' +
        estatus

      const response = await this.$axios({
        url,
        method: 'put',
        data: {
          Articulo,
        },
      })

      console.log(response)
      if (response.data.success) commit('setVentana', 'LIST')

      return response.data
    } catch (error) {
      console.log(error.response, error)
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
