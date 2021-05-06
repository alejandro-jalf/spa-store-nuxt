if (!sessionStorage.getItem('spastore_conexiones'))
  sessionStorage.setItem('spastore_conexiones', '{}')

export const state = () => ({
  conexiones: JSON.parse(sessionStorage.getItem('spastore_conexiones')) || {},
})

export const mutations = {
  setConexiones(state, conexiones) {
    state.conexiones = conexiones
    sessionStorage.setItem('spastore_conexiones', JSON.stringify(conexiones))
  },
}

export const actions = {
  async verifyConexiones({ commit }) {
    try {
      const response = await this.$axios({
        url: process.env.spastore_url_conexiones,
        method: 'get',
      })

      if (response.data.success) {
        commit('setConexiones', response.data)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      if (error.response) {
        // eslint-disable-next-line no-console
        console.log(error.response)
      }
    }
  },
}
