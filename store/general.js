export const state = () => ({
  alert: {
    show: false,
    title: 'Arvertencia',
    message: 'Error en la solicitud',
    headerBackground: 'warning',
    headerTexColor: 'light',
  },
  loading: false,
  listTabs: [
    {
      path: '/',
      name: 'index',
      nickname: 'Inicio',
    },
    {
      path: '/about',
      name: 'about',
      nickname: 'Acerca de',
    },
    {
      path: '/ofertas',
      name: 'ofertas',
      nickname: 'Ofertas',
    },
    {
      path: '/ventav',
      name: 'ventav',
      nickname: 'Ventas',
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      nickname: 'Usuarios',
    },
  ],
  tabActual: 'Inicio',
})

export const mutations = {
  showAlertDialog: (
    state,
    [
      message = null,
      title = 'Advertencia',
      background = 'warning',
      textColor = 'light',
    ]
  ) => {
    if (message === null) return true
    state.alert.show = true
    state.alert.message = message
    state.alert.title = title
    state.alert.headerBackground = background
    state.alert.headerTexColor = textColor
  },
  hideAlertDialog(state) {
    state.alert.show = false
  },
  setLoading(state, value) {
    state.loading = value
  },
  setTabActual(state, nameTab) {
    state.tabActual = nameTab
  },
}
