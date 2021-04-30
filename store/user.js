if (!localStorage.getItem('spastore_login'))
  localStorage.setItem('spastore_login', 'false')

if (!localStorage.getItem('spastore_user'))
  localStorage.setItem('spastore_user', '{}')

if (!localStorage.getItem('spastore_user_name'))
  localStorage.setItem('spastore_user_name', 'Invited')

export const state = () => ({
  login: localStorage.getItem('spastore_login') === 'true' || false,
  user: JSON.parse(localStorage.getItem('spastore_user')) || {},
  name: localStorage.getItem('spastore_user_name') || 'Invited',
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
  setNameUser(state, name) {
    state.name = name
    localStorage.setItem('spastore_user_name', name)
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
        const user = response.data.data
        const arrayName = user.nombre_user.trim().split(' ')
        const firstName = arrayName.length > 1 ? arrayName[1] : user.nombre_user
        const nameUser = firstName + ' ' + user.apellido_p_user
        commit('setNameUser', nameUser)
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
