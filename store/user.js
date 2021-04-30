export const state = () => ({
  login: localStorage.getItem('spastore_login') === 'true' || false,
  user: JSON.parse(localStorage.getItem('spastore_user')) || {},
})

export const mutations = {
  setLogin(state, login) {
    state.login = login
    localStorage.setItem('spastore_login', login)
  },
  setUser(state, user) {
    state.user = user
    localStorage.setItem('spastore_user', JSON.stringify(user))
  },
}

export const actions = {
  async initSesion({ commit }, [user, password]) {
    try {
      const response = await this.$axios({
        url: `${process.env.spastore_base_url}api/v1/usuarios/${user}/login`,
        method: 'post',
        headers: {
          'access-token': process.env.spastore_token,
        },
        data: {
          password_user: password,
        },
      })

      if (response.data.success) {
        commit('setLogin', true)
        commit('setUser', response.data.data)
      }

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      if (error.response) {
        // eslint-disable-next-line no-console
        console.log(error.response)
        return error.response.data
      }
      return {
        case: 'Error fatal',
        error,
      }
    }
  },
}
