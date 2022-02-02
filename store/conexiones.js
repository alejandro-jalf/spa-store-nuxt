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
  async verifyConexiones({ commit }, sucursal) {
    try {
      const urlBase = process.env.spastore_url_backend
      const sucSplited = sucursal.split(' ')
      const url =
        sucSplited[0].trim().toUpperCase() === 'CAASA'
          ? `${urlBase}api/v1/general/caasa/conexiones/activas`
          : process.env.spastore_url_conexiones
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setConexiones', response.data)
      }
    } catch (error) {
      if (error.response) {
        // eslint-disable-next-line no-console
        console.log(error.response)
      }
    }
  },
}
