if (!sessionStorage.getItem('spastore_conexiones'))
  sessionStorage.setItem('spastore_conexiones', '{}')

export const state = () => ({
  conexiones: JSON.parse(sessionStorage.getItem('spastore_conexiones')),
})

export const mutations = {
  setConexiones(state, conexiones) {
    state.conexiones = conexiones
    sessionStorage.setItem('spastore_conexiones', JSON.stringify(conexiones))
  },
}

export const actions = {
  async verifyConexiones({ commit }, [sucursal, store]) {
    try {
      const urlBase = process.env.spastore_url_backend
      const sucSplited = sucursal.split(' ')
      const company =
        sucSplited[0].trim().toUpperCase() === 'CAASA' ? 'caasa' : 'spa'
      const url =
        company === 'spa'
          ? process.env.spastore_url_conexiones
          : `${urlBase}api/v1/general/${company}/conexiones/activas`
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) commit('setConexiones', response.data)
      else {
        commit('setConexiones', [])
        store.commit('general/showAlertDialog', [response.data.message])
      }
    } catch (error) {
      if (error.response) {
        commit('setConexiones', [])
        store.commit('general/showAlertDialog', [error.response.data.message])
      }
    }
  },
}
