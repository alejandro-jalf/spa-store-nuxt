export const state = () => ({
  alert: {
    show: false,
    title: 'Arvertencia',
    message: 'Error en la solicitud',
    headerBackground: 'warning',
    headerTexColor: 'light',
  },
  loading: 0,
  listTabs: [
    {
      path: '/',
      name: 'index',
      nickname: 'Inicio',
      icon: 'house-door-fill',
    },
    {
      path: '/ofertas',
      name: 'ofertas',
      nickname: 'Ofertas',
      icon: 'percent',
    },
    {
      path: '/ventav',
      name: 'ventav',
      nickname: 'Ventas',
      icon: 'shop',
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      nickname: 'Usuarios',
      icon: 'people-fill',
    },
    {
      path: '/conexiones',
      name: 'conexiones',
      nickname: 'Conexiones',
      icon: 'cloud-check-fill',
    },
    {
      path: '/existenciasarticulo',
      name: 'existenciasarticulo',
      nickname: 'Existencias Articulos',
      icon: 'collection',
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
    if (value) state.loading++
    else if (state.loading <= 0) state.loading = 0
    else state.loading--
  },
  setTabActual(state, nameTab) {
    state.tabActual = nameTab
  },
}
