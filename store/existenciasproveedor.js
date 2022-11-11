if (!localStorage.getItem('spastore_existencias_provider_sucursal'))
  localStorage.setItem('spastore_existencias_provider_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_existence_provider_data')
    ? JSON.parse(sessionStorage.getItem('spastore_existence_provider_data'))
    : { data: [], resumen: [] },
  providers: localStorage.getItem('spastore_existence_provider_providers')
    ? JSON.parse(localStorage.getItem('spastore_existence_provider_providers'))
    : {
        data: [],
      },
  provider: localStorage.getItem('spastore_existence_provider_provider')
    ? JSON.parse(localStorage.getItem('spastore_existence_provider_provider'))
    : {
        Proveedor: '',
        Nombre: '',
      },
  providerConsult: localStorage.getItem(
    'spastore_existence_provider_c_provider'
  )
    ? JSON.parse(localStorage.getItem('spastore_existence_provider_c_provider'))
    : {
        Proveedor: '',
        Nombre: '',
      },
  sucursal: localStorage.getItem('spastore_existencias_provider_sucursal'),
  sucursalConsult: localStorage.getItem(
    'spastore_existencias_provider_suc_consult'
  ),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem(
      'spastore_existence_provider_data',
      JSON.stringify(data)
    )
  },
  setProviders(state, providers) {
    state.providers = providers
    localStorage.setItem(
      'spastore_existence_provider_providers',
      JSON.stringify(providers)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_existencias_provider_sucursal', sucursal)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    localStorage.setItem(
      'spastore_existencias_provider_suc_consult',
      sucursalConsult
    )
  },
  setProvider(state, provider) {
    state.provider = provider
    localStorage.setItem(
      'spastore_existence_provider_provider',
      JSON.stringify(provider)
    )
  },
  setProviderConsult(state, providerConsult) {
    state.providerConsult = providerConsult
    localStorage.setItem(
      'spastore_existence_provider_c_provider',
      JSON.stringify(providerConsult)
    )
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, proveedor]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/existencias/' +
        sucursal +
        '/proveedor/' +
        proveedor.Proveedor

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setData', response.data)
        commit('setProviderConsult', proveedor)
        commit('setSucursalConsult', sucursal)
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
  async loadProveedores({ commit }, [sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend + 'api/v1/proveedores/' + sucursal
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setProviders', { data: response.data.data })
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
