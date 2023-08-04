if (!sessionStorage.getItem('spastore_claves_asist_sucursal'))
  sessionStorage.setItem('spastore_claves_asist_sucursal', 'ZR')
if (!sessionStorage.getItem('spastore_claves_asist_view'))
  sessionStorage.setItem('spastore_claves_asist_view', 'REGISTRO')

export const state = () => ({
  data: sessionStorage.getItem('spastore_claves_asist_data')
    ? JSON.parse(sessionStorage.getItem('spastore_claves_asist_data'))
    : { data: [] },
  claves: localStorage.getItem('spastore_claves_asist_claves')
    ? JSON.parse(localStorage.getItem('spastore_claves_asist_claves'))
    : { data: [] },
  sucursal: sessionStorage.getItem('spastore_claves_asist_sucursal'),
  sucConsult: sessionStorage.getItem('spastore_claves_asist_consult'),
  sucClaves: localStorage.getItem('spastore_claves_asist_succlaves'),
  view: sessionStorage.getItem('spastore_claves_asist_view'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_claves_asist_data', JSON.stringify(data))
  },
  setClaves(state, claves) {
    state.claves = claves
    localStorage.setItem('spastore_claves_asist_claves', JSON.stringify(claves))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    sessionStorage.setItem('spastore_claves_asist_sucursal', sucursal)
  },
  setSucConsult(state, sucConsult) {
    state.sucConsult = sucConsult
    sessionStorage.setItem('spastore_claves_asist_consult', sucConsult)
  },
  setSucClaves(state, sucClaves) {
    state.sucClaves = sucClaves
    localStorage.setItem('spastore_claves_asist_succlaves', sucClaves)
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
  async getClave({ commit }, [sucursal, cajero]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/trabajadores/claves/' +
        sucursal +
        '/' +
        cajero

      const response = await this.$axios({
        url,
        method: 'get',
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
  async getAllClaves({ commit }, sucursal) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/trabajadores/claves/' +
        sucursal

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setClaves', response.data)
        commit('setSucClaves', sucursal)
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
  async updateClaveTrabajador({ commit }, [sucursal, Cajero, Clave]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/trabajadores/claves/' +
        sucursal +
        '/' +
        Cajero

      const response = await this.$axios({
        url,
        method: 'put',
        data: { Clave },
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
  async updateIdTrabajador({ commit }, [sucursal, Cajero, IdTrabajador]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/trabajadores/claves/' +
        sucursal +
        '/' +
        Cajero +
        '/IdTrabajador'

      const response = await this.$axios({
        url,
        method: 'put',
        data: { IdTrabajador },
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
