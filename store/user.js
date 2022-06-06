if (!sessionStorage.getItem('spastore_sesion_instancia'))
  sessionStorage.setItem('spastore_sesion_instancia', 'null')

if (!sessionStorage.getItem('spastore_sesion_init'))
  sessionStorage.setItem('spastore_sesion_init', 'null')

if (!localStorage.getItem('spastore_login'))
  localStorage.setItem('spastore_login', 'false')

if (!localStorage.getItem('spastore_user'))
  localStorage.setItem('spastore_user', '{}')

if (!localStorage.getItem('spastore_user_name'))
  localStorage.setItem('spastore_user_name', 'Invited')

if (!localStorage.getItem('spastore_user_actual_view'))
  localStorage.setItem('spastore_user_actual_view', '{}')

if (!localStorage.getItem('spastore_user_version_old'))
  localStorage.setItem('spastore_user_version_old', '2.0.0')

export const state = () => ({
  login: localStorage.getItem('spastore_login') === 'true',
  user: JSON.parse(localStorage.getItem('spastore_user')),
  name: localStorage.getItem('spastore_user_name'),
  userActualView: JSON.parse(localStorage.getItem('spastore_user_actual_view')),
  userViewed: 0, // 0 || 1 || 2
  sesionInstancia: sessionStorage.getItem('spastore_sesion_instancia'),
  sesionInit: sessionStorage.getItem('spastore_sesion_init'),
  versionOld: sessionStorage.getItem('spastore_user_version_old'),
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
  changeUSer(state, user) {
    state.userActualView = user
    localStorage.setItem('spastore_user_actual_view', JSON.stringify(user))
  },
  setUserViewed(state, view) {
    state.userViewed = view
  },
  setSesionInstancia(state, instancia) {
    state.sesionInstancia = instancia
    sessionStorage.setItem('spastore_sesion_instancia', instancia)
  },
  setSesionInit(state, sesionInit) {
    state.sesionInit = sesionInit
    sessionStorage.setItem('spastore_sesion_init', sesionInit)
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
        const firstName =
          arrayName.length > 1
            ? arrayName[arrayName.length - 1]
            : user.nombre_user
        const nameUser = firstName + ' ' + user.apellido_p_user
        commit('setNameUser', nameUser)
      }

      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return {
        case: 'Error fatal',
        error,
      }
    }
  },
  logout({ commit }, [store, route]) {
    sessionStorage.removeItem('spastore_users_list')
    commit('setLogin', false)
    commit('setUser', {})
    store.commit('conexiones/setConexiones', {})
    store.commit('existenciasarticulo/setListArticulos', { data: [] })
    store.commit('existenciasarticulo/setArticulosFinded', 0)
    store.commit('asistencia/cleanData')
    store.commit('existenciasarticulo/setArticuloDetails', {})
    route.replace({ name: 'Login' })
  },
  async refreshDataUser({ commit, dispatch }, [store, route]) {
    try {
      const response = await this.$axios({
        url: `${process.env.spastore_base_url}api/v1/usuarios/${store.state.user.user.correo_user}`,
        method: 'get',
        headers: {
          'access-token': process.env.spastore_token,
        },
      })

      if (response.data.success) {
        const user = { ...response.data.data[0] }
        delete user.recovery_code_user
        delete user.password_user
        if (user.activo_user) {
          commit('setUser', user)
          const arrayName = user.nombre_user.trim().split(' ')
          const firstName =
            arrayName.length > 1
              ? arrayName[arrayName.length - 1]
              : user.nombre_user
          const nameUser = firstName + ' ' + user.apellido_p_user
          commit('setNameUser', nameUser)
        } else dispatch('logout', [store, route])
      }

      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return {
        case: 'Error fatal',
        error,
      }
    }
  },
}
